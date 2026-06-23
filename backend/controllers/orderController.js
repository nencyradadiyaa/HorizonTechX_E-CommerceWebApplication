import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Verify stock and fetch correct prices from DB to avoid client-side injection of lower prices
    let dbOrderItems = [];
    let calculatedTotal = 0;

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.title} not found` });
      }

      if (dbProduct.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${dbProduct.title}. Stock available: ${dbProduct.stock}`,
        });
      }

      // Decrement stock
      dbProduct.stock -= item.qty;
      await dbProduct.save();

      dbOrderItems.push({
        product: dbProduct._id,
        title: dbProduct.title,
        qty: item.qty,
        price: dbProduct.price,
      });

      calculatedTotal += dbProduct.price * item.qty;
    }

    const order = new Order({
      user: req.user._id,
      products: dbOrderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: Number(calculatedTotal.toFixed(2)),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    // Populate user name and email from User collection
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // If order is cancelled, return the stock back to products
      if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.qty;
            await product.save();
          }
        }
      }
      // If order is restored from cancelled, deduct stock again
      else if (order.orderStatus === 'Cancelled' && status !== 'Cancelled') {
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock = Math.max(0, product.stock - item.qty);
            await product.save();
          }
        }
      }

      order.orderStatus = status;
      const updatedOrder = await order.save();
      
      // Populate user info for responses that show it (Admin Dashboard)
      const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'id name email');
      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
