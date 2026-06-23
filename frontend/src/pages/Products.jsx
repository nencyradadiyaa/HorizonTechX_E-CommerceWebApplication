import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { Filter, SlidersHorizontal, Trash2 } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  
  // Extract query parameters from URL
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products', {
          params: {
            keyword: searchParam,
            category: categoryParam,
          },
        });
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParam, categoryParam]);

  // Handle category selector
  const handleCategorySelect = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setSearchParams({});
    setSortBy('latest');
  };

  // Handle client-side sorting of products list
  const getSortedProducts = () => {
    const productsCopy = [...products];
    if (sortBy === 'price-low') {
      return productsCopy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return productsCopy.sort((a, b) => b.price - a.price);
    }
    // Default: latest (backend already sorts by latest, but we can verify)
    return productsCopy;
  };

  const categories = ['All', 'Laptops', 'Audio', 'Accessories', 'Wearables'];

  const sortedProducts = getSortedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Product Catalog</h1>
          {searchParam && (
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Search results for "<span className="text-brand-300 font-semibold">{searchParam}</span>"
            </p>
          )}
        </div>

        {/* Filters and Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active filter count indicator */}
          {(searchParam || categoryParam !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/10 text-xs font-semibold transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-slate-350 focus:outline-none cursor-pointer"
            >
              <option value="latest" className="bg-slate-950 text-slate-350">Sort By: Latest</option>
              <option value="price-low" className="bg-slate-950 text-slate-350">Price: Low to High</option>
              <option value="price-high" className="bg-slate-950 text-slate-350">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Categories (Desktop) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold border-b border-slate-900 pb-3">
              <Filter className="h-4 w-4 text-brand-400" />
              <span>Categories</span>
            </div>
            <div className="flex flex-row lg:flex-col flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = categoryParam === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-fit lg:w-full text-left px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-650 text-white shadow-md shadow-brand-600/10'
                        : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl space-y-4">
              <p className="text-slate-400 text-base font-medium">No products match your search criteria.</p>
              <button
                onClick={handleClearFilters}
                className="gradient-btn px-6 py-2 rounded-full text-xs font-semibold"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
