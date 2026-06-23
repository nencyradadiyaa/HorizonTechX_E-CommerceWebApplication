import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { ArrowRight, Laptop, Headphones, Keyboard, Watch, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Grab top 4 products for featured section
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Laptops', icon: Laptop, count: 'Elite Workstations', color: 'from-blue-500/20 to-indigo-500/20' },
    { name: 'Audio', icon: Headphones, count: 'Hi-Fi Soundscapes', color: 'from-violet-500/20 to-purple-500/20' },
    { name: 'Accessories', icon: Keyboard, count: 'Mechanical Gear', color: 'from-pink-500/20 to-rose-500/20' },
    { name: 'Wearables', icon: Watch, count: 'Biometric Tech', color: 'from-cyan-500/20 to-teal-500/20' },
  ];

  return (
    <div className="flex-grow space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full animate-glow -z-10"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full animate-glow -z-10"></div>

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-300">
            <span>✨ Introducing the HorizonTechX Summer Collection</span>
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Equip Your Digital <br />
            <span className="gradient-text">Workspace For The Future</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover a curated collection of ultra-premium mechanical keyboards, laptops, high-fidelity audio equipment, and biometric wear. Designed for professionals who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/products" className="gradient-btn px-8 py-3.5 rounded-full text-sm font-semibold flex items-center space-x-2 w-full sm:w-auto justify-center">
              <span>Browse Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products?category=Laptops"
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 transition-all w-full sm:w-auto text-center"
            >
              Explore Laptops
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Browse by Category</h2>
          <p className="text-slate-500 text-sm">Engineered devices categorized for specific roles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between h-48 group relative overflow-hidden"
              >
                {/* Background color block */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-30 -z-10 group-hover:scale-105 transition-transform duration-550`}></div>
                
                <div className="p-3 bg-slate-900 rounded-xl w-fit border border-slate-800">
                  <Icon className="h-6 w-6 text-brand-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Featured Gear</h2>
            <p className="text-slate-500 text-sm">Top-tier high-demand productivity hardware available today.</p>
          </div>
          <Link to="/products" className="text-brand-400 hover:text-brand-300 text-sm font-semibold flex items-center space-x-1 shrink-0">
            <span>View all products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl">
            <p className="text-slate-400">No products found. Please seed the database first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Features Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left relative overflow-hidden">
          {/* Subtle line background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10"></div>

          <div className="flex flex-col sm:flex-row items-center md:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-brand-400 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">Global Premium Delivery</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Secure, insured, and tracked shipping on all high-value packages worldwide.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-brand-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">2-Year Horizon Warranty</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Full coverage guarantees on parts and hardware engineering defects.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-brand-400 shrink-0">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">30-Day Hassle-Free Returns</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Not matching your desk aesthetic? Return it in original packaging, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
