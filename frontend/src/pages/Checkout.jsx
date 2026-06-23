import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Spinner from '../components/Spinner';
import { ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Form states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  // Payment states (Simulated card)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const shipping = cartTotal > 500 ? 0.00 : 25.00;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!street || !city || !state || !zipCode || !country) {
      setError('Please fill out all shipping fields');
      return;
    }

    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      setError('Please fill out simulated payment card details');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        product: item.product,
        title: item.title,
        qty: item.qty,
        price: item.price
      }));

      const shippingAddress = { street, city, state, zipCode, country };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress,
          paymentMethod: 'Simulated Card Ending in ' + cardNumber.slice(-4)
        },
        config
      );

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setPlacedOrder(data);
      setOrderSuccess(true);
      clearCart();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  // Render Success Page
  if (orderSuccess && placedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto">
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-450 rounded-full w-fit mx-auto animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Purchase Successful!</h2>
            <p className="text-slate-400 text-sm">
              Thank you for shopping at HorizonTechX. Your order is registered in our database.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl text-left space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-3 text-xs sm:text-sm font-semibold">
              <span className="text-slate-400">Order Reference ID:</span>
              <span className="text-brand-300 font-mono">{placedOrder._id}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Total Transaction:</span>
              <span className="font-extrabold text-white">${placedOrder.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Shipping Mode:</span>
              <span className="text-slate-200">Insured Priority Cargo</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Current Status:</span>
              <span className="text-amber-450 font-bold uppercase tracking-wider text-[10px] bg-amber-950/30 border border-amber-500/20 px-2 py-0.5 rounded">
                {placedOrder.orderStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/orders" className="gradient-btn px-6 py-2.5 rounded-full text-xs font-semibold w-full sm:w-auto justify-center flex">
              View Order History
            </Link>
            <Link to="/" className="text-slate-400 hover:text-white text-xs font-semibold hover:underline">
              Return to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout Billing</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Complete your shipping credentials and simulated card payment.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-4 text-xs max-w-4xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping + Payment Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Credentials */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-3">
              1. Shipping Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Street Address</label>
                <input
                  type="text"
                  placeholder="123 Developer Lane"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</label>
                <input
                  type="text"
                  placeholder="San Francisco"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State / Region</label>
                <input
                  type="text"
                  placeholder="California"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="94107"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Card Simulation */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center space-x-2">
              <CreditCard className="h-4.5 w-4.5 text-brand-400" />
              <span>2. Simulated Card Payment</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444 (Simulated)"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Ada Lovelace"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all font-mono text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    required
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none transition-all font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Submit */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-900 pb-3">Line Items</h2>

          {/* Cart items review */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 divide-y divide-slate-900">
            {cartItems.map((item) => (
              <div key={item.product} className="flex justify-between items-center text-xs py-2.5">
                <div className="flex items-center space-x-2 truncate">
                  <img src={item.image} alt={item.title} className="w-8 h-8 object-cover rounded-md" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-200 truncate max-w-[120px]">{item.title}</p>
                    <span className="text-[9px] text-slate-500 font-bold">Qty: {item.qty}</span>
                  </div>
                </div>
                <span className="font-bold text-white shrink-0">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals Box */}
          <div className="border-t border-slate-900 pt-4 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-900 pt-3 flex justify-between text-slate-200 font-bold text-base">
              <span>Total Cost</span>
              <span className="text-white font-black">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 text-center font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-450 shrink-0" />
            <span>Simulated SSL Encrypted Transaction</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
