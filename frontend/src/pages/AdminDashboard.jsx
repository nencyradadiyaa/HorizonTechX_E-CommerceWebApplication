import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  X,
  Check,
  AlertTriangle,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Modal / Form state for Add/Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImage, setFormImage] = useState('');

  // Status variables
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch both products and orders in parallel
      const [prodRes, orderRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders', axiosConfig),
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch administrator data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory('Laptops');
    setFormStock('');
    setFormImage('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormCategory(product.category);
    setFormStock(product.stock);
    setFormImage(product.image);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Product Submit (Create or Update)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle || !formDescription || !formPrice || !formCategory || formStock === '') {
      setFormError('Please fill out all required fields');
      return;
    }

    setSubmitting(true);

    const productPayload = {
      title: formTitle,
      description: formDescription,
      price: Number(formPrice),
      category: formCategory,
      stock: Number(formStock),
      image: formImage || undefined,
    };

    try {
      if (editingProduct) {
        // Edit flow
        const { data } = await axios.put(
          `/api/products/${editingProduct._id}`,
          productPayload,
          axiosConfig
        );
        // Update local state
        setProducts(prev => prev.map(p => (p._id === data._id ? data : p)));
      } else {
        // Create flow
        const { data } = await axios.post('/api/products', productPayload, axiosConfig);
        // Append to local state
        setProducts(prev => [data, ...prev]);
      }
      setIsModalOpen(false);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setFormError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  // Handle Product Delete
  const handleProductDelete = async (id) => {
    if (window.confirm('Are you absolutely sure you want to remove this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, axiosConfig);
        setProducts(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        alert(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Error deleting product'
        );
      }
    }
  };

  // Handle Order Status Toggle Change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        axiosConfig
      );
      // Update locally
      setOrders(prev => prev.map(o => (o._id === data._id ? data : o)));
    } catch (err) {
      alert(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error updating order status'
      );
    }
  };

  // Calculations for stats
  const totalSales = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;

  if (loading) {
    return (
      <div className="py-32 flex justify-center flex-grow">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="glass-panel p-8 rounded-2xl max-w-lg mx-auto text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Error loading Admin Panel</h3>
          <p className="text-slate-400 text-xs sm:text-sm">{error}</p>
          <button onClick={fetchData} className="gradient-btn px-6 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 mx-auto">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Console</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage product lists and track customer transactions.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="gradient-btn flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-550 uppercase font-semibold tracking-wider block">Total Sales</span>
            <span className="text-lg font-extrabold text-white">${totalSales.toFixed(2)}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-550 uppercase font-semibold tracking-wider block">Total Orders</span>
            <span className="text-lg font-extrabold text-white">{orders.length}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-550 uppercase font-semibold tracking-wider block">Active Products</span>
            <span className="text-lg font-extrabold text-white">{products.length}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-550 uppercase font-semibold tracking-wider block">Pending Orders</span>
            <span className="text-lg font-extrabold text-white">{pendingOrders}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-900 flex space-x-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-brand-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-brand-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'products' ? (
        <div className="glass-panel rounded-2xl overflow-hidden">
          {products.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <FolderOpen className="h-10 w-10 text-slate-500 mx-auto" />
              <p className="text-slate-400 text-sm font-medium">No products registered in Catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Title / ID</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">In Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-900/10">
                      <td className="p-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                        />
                      </td>
                      <td className="p-4 max-w-[200px] truncate">
                        <p className="font-bold text-slate-100 truncate">{product.title}</p>
                        <span className="text-[10px] font-mono text-slate-500">{product._id}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-900 border border-slate-850 text-slate-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">${product.price.toFixed(2)}</td>
                      <td className="p-4 font-semibold">
                        {product.stock === 0 ? (
                          <span className="text-red-400">0 Left</span>
                        ) : product.stock <= 5 ? (
                          <span className="text-amber-400">{product.stock} Left</span>
                        ) : (
                          <span className="text-emerald-450">{product.stock}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit"
                            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleProductDelete(product._id)}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Orders Tab */
        <div className="glass-panel rounded-2xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <FileSpreadsheet className="h-10 w-10 text-slate-500 mx-auto" />
              <p className="text-slate-400 text-sm font-medium">No order transactions placed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {orders.map((order) => {
                    const dateStr = new Date(order.createdAt).toLocaleDateString();
                    return (
                      <tr key={order._id} className="hover:bg-slate-900/10">
                        <td className="p-4 font-mono font-bold text-slate-350">{order._id}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-200">{order.user?.name || 'Deleted Account'}</p>
                          <p className="text-[10px] text-slate-500">{order.user?.email || 'N/A'}</p>
                        </td>
                        <td className="p-4 text-slate-400">{dateStr}</td>
                        <td className="p-4 font-bold text-white">${order.totalAmount.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                              order.orderStatus === 'Delivered'
                                ? 'text-emerald-450 bg-emerald-950/20 border-emerald-500/10'
                                : order.orderStatus === 'Cancelled'
                                ? 'text-red-400 bg-red-950/20 border-red-500/10'
                                : 'text-amber-400 bg-amber-950/20 border-amber-500/10'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer focus:border-brand-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              {editingProduct ? 'Edit Product Item' : 'Create Product Item'}
            </h3>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 text-xs flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="MacBook Air M3"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="999.99"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 focus:border-brand-500 rounded-xl py-2 px-3 text-slate-200 focus:outline-none bg-slate-950"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Wearables">Wearables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail product features and specifications here..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl py-2 px-3 text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gradient-btn px-6 py-2 rounded-xl flex items-center space-x-1"
                >
                  <Check className="h-4 w-4" />
                  <span>{submitting ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
