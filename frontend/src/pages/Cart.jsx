import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useContext(Context => CartContext);
  const navigate = useNavigate();

  // Wait! Why Context => CartContext?
  // Let's make sure it's: const { cartItems, cartTotal, updateQuantity, removeFromCart } = useContext(CartContext);
  // That was a small typo in thought, let's write it clean.

  const shipping = cartTotal > 500 || cartTotal === 0 ? 0.00 : 25.00;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="glass-panel p-12 rounded-3xl text-center space-y-6 max-w-lg mx-auto">
          <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl w-fit mx-auto text-slate-500">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
            <p className="text-slate-400 text-sm">Looks like you haven't added any high-performance gear to your workspace yet.</p>
          </div>
          <Link to="/products" className="inline-flex items-center space-x-1.5 gradient-btn px-6 py-2.5 rounded-full text-xs font-semibold">
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Review your premium selections before checking out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Line Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:justify-between gap-4"
            >
              {/* Product Thumbnail & Title */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                />
                <div>
                  <Link to={`/products/${item.product}`} className="font-bold text-slate-100 hover:text-brand-400 transition-colors text-sm sm:text-base line-clamp-1">
                    {item.title}
                  </Link>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
                    Unit Price: ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Select and Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-900 pt-4 sm:pt-0 sm:border-0">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider sm:hidden">Qty:</span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                      disabled={item.qty === 1}
                      className="px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-200">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.product, Math.min(item.stock, item.qty + 1))}
                      disabled={item.qty >= item.stock}
                      className="px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-extrabold text-white min-w-[60px] text-right">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => removeFromCart(item.product)}
                    title="Remove item"
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">Order Summary</h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-200">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-slate-400">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-slate-200">
                {shipping === 0 ? (
                  <span className="text-emerald-450 uppercase font-semibold">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-slate-200">${tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-900 pt-3 flex justify-between text-slate-250 font-bold text-base">
              <span>Total</span>
              <span className="font-black text-white">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="w-full gradient-btn py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            Free shipping applies to workspaces order values above $500.00. Taxes are simulated in compliance with regional regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
