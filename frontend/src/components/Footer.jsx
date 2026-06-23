import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-tr from-brand-600 to-violet-600 rounded-lg">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                HorizonTech<span className="text-brand-400">X</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Curating premium, high-performance tech accessories, laptops, and wearables for professionals and developers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-brand-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-brand-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-brand-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Categories Col */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=Laptops" className="text-slate-400 hover:text-brand-400 transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Audio" className="text-slate-400 hover:text-brand-400 transition-colors">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="text-slate-400 hover:text-brand-400 transition-colors">
                  Accessories & Keyboards
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wearables" className="text-slate-400 hover:text-brand-400 transition-colors">
                  Wearable Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Col */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Track Orders</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Secure Checkouts</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Subscribe to get exclusive first-looks at new developer desk setups and product launches.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-slate-900 border border-slate-800 rounded-l-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 text-slate-200"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm px-4 py-2 rounded-r-lg transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HorizonTechX. All rights reserved.</p>
          <p className="flex items-center mt-4 sm:mt-0">
            Crafted for developers with <Heart className="h-3 w-3 text-red-500 mx-1 fill-red-500" /> globally.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
