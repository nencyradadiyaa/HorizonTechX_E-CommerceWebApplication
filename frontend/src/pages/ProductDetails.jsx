import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import Spinner from '../components/Spinner';
import { ArrowLeft, ShoppingCart, ShieldCheck, Check, Info } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load product details or invalid ID.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex justify-center flex-grow">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
          <Info className="h-12 w-12 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Product Not Found</h2>
          <p className="text-slate-400 text-sm">{error || 'The requested product does not exist.'}</p>
          <Link to="/products" className="inline-flex items-center space-x-1.5 gradient-btn px-6 py-2 rounded-full text-xs font-semibold">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
        <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-400 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-brand-300 truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main Grid: Details & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Image Panel */}
        <div className="glass-panel p-4 rounded-3xl aspect-[4/3] overflow-hidden bg-slate-900/40 relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-2xl"
          />
          {product.stock > 0 && (
            <span className="absolute top-8 left-8 bg-slate-900/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-brand-300 px-3 py-1.5 rounded-full border border-slate-800">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Details Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Stock Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {isOutOfStock ? (
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-950/40 border border-red-500/25 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/25 px-2.5 py-1 rounded-full">
                  Low Stock - Only {product.stock} Left!
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-450 bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="border-t border-b border-slate-900 py-4 flex items-center justify-between">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Price</span>
              <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
            </div>
            
            {/* Trust badge */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-400" />
              <span>Horizon Secure Checkout</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-350">Product Overview</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector & Add To Cart CTA */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quantity:</span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    disabled={qty === 1}
                    className="px-3.5 py-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold text-white">{qty}</span>
                  <button
                    onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                    disabled={qty >= product.stock}
                    className="px-3.5 py-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="gradient-btn flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl text-sm font-bold shrink-0 min-w-[200px]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add To Cart</span>
                </button>

                {addedMessage && (
                  <span className="flex items-center space-x-1 px-3.5 py-2.5 bg-emerald-950/40 text-emerald-450 border border-emerald-500/20 text-xs font-semibold rounded-xl">
                    <Check className="h-4 w-4" />
                    <span>Added to Cart!</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
