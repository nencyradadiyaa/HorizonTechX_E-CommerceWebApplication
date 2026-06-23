import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to details page when clicking button
    addToCart(product, 1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full group relative">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block relative aspect-video overflow-hidden bg-slate-900 shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <span className="p-2.5 bg-slate-900/90 text-white rounded-full border border-slate-700/50 hover:bg-brand-600 hover:border-brand-500 transition-all shadow-lg">
            <Eye className="h-5 w-5" />
          </span>
        </div>
        
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-brand-300 px-2.5 py-1 rounded-full border border-slate-800">
          {product.category}
        </span>
      </Link>

      {/* Info Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="font-semibold text-slate-100 group-hover:text-brand-400 transition-colors text-base line-clamp-1">
              {product.title}
            </h3>
          </Link>
          {/* Description Snippet */}
          <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Purchase Action Row */}
        <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Price</span>
            <span className="text-lg font-extrabold text-white">${product.price.toFixed(2)}</span>
          </div>

          {isOutOfStock ? (
            <span className="text-xs font-semibold text-red-400 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-lg">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-brand-600/10 active:scale-95"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
