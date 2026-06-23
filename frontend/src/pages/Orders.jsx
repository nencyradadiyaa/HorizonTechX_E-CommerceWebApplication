import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { ShoppingBag, ChevronDown, ChevronUp, Calendar, MapPin, DollarSign, Package } from 'lucide-react';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-450 bg-emerald-950/30 border-emerald-500/20';
      case 'Shipped':
        return 'text-cyan-400 bg-cyan-950/30 border-cyan-500/20';
      case 'Processing':
        return 'text-indigo-400 bg-indigo-950/30 border-indigo-500/20';
      case 'Cancelled':
        return 'text-red-400 bg-red-950/30 border-red-500/20';
      default: // Pending
        return 'text-amber-400 bg-amber-950/30 border-amber-500/20';
    }
  };

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
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-4 text-xs max-w-lg mx-auto">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="glass-panel p-12 rounded-3xl text-center space-y-6 max-w-lg mx-auto">
          <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl w-fit mx-auto text-slate-500">
            <Package className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">No Orders Placed Yet</h2>
            <p className="text-slate-400 text-sm">You haven't completed any transactions yet. Your purchases will display here.</p>
          </div>
          <Link to="/products" className="inline-flex items-center space-x-1.5 gradient-btn px-6 py-2.5 rounded-full text-xs font-semibold">
            <ShoppingBag className="h-4 w-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Order History</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Review tracking statuses and line items of your purchases.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <div
              key={order._id}
              className={`glass-panel rounded-2xl overflow-hidden border transition-all ${
                isExpanded ? 'border-brand-500/30' : 'border-slate-900'
              }`}
            >
              {/* Collapsed Header Summary */}
              <div
                onClick={() => toggleExpandOrder(order._id)}
                className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/30 transition-colors"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow max-w-4xl">
                  {/* Order ID */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Order ID</span>
                    <span className="text-xs font-mono font-bold text-slate-200 truncate block max-w-[120px]">
                      {order._id}
                    </span>
                  </div>

                  {/* Order Date */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Date Placed</span>
                    <span className="text-xs font-semibold text-slate-350 flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  {/* Total Value */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Total Value</span>
                    <span className="text-sm font-extrabold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Current Status */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Status</span>
                    <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="border-t border-slate-900 bg-slate-950/40 p-6 space-y-6">
                  {/* Grid: Shipping and payment info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                    {/* Shipping Address details */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-brand-400" />
                        <span>Shipping Cargo Address</span>
                      </h4>
                      <div className="text-slate-400 pl-4 border-l border-slate-850 space-y-1">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p className="uppercase tracking-wider font-semibold text-slate-500 text-[10px]">{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                        <DollarSign className="h-3.5 w-3.5 text-brand-400" />
                        <span>Transaction Details</span>
                      </h4>
                      <div className="text-slate-400 pl-4 border-l border-slate-850 space-y-1">
                        <p>Method: <span className="text-slate-200">{order.paymentMethod}</span></p>
                        <p>Currency: <span className="text-slate-200">USD ($)</span></p>
                        <p>Gate: <span className="text-emerald-450 font-bold uppercase tracking-wider text-[9px] bg-emerald-950/20 border border-emerald-500/10 px-1.5 py-0.5 rounded">Success</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-900 pb-2">
                      Order Line Items
                    </h4>
                    <div className="divide-y divide-slate-900">
                      {order.products.map((item) => (
                        <div key={item._id} className="flex justify-between items-center py-3 text-xs sm:text-sm">
                          <div>
                            <Link to={`/products/${item.product}`} className="font-bold text-slate-200 hover:text-brand-400 transition-colors">
                              {item.title}
                            </Link>
                            <span className="text-slate-500 text-[10px] block mt-0.5 font-medium">
                              Qty: {item.qty} @ ${item.price.toFixed(2)} each
                            </span>
                          </div>
                          <span className="font-extrabold text-white">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
