import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Sparkles, Zap } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrollY > 50 
        ? 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
        : 'bg-transparent backdrop-blur-sm'
    } ${isScrolling ? 'transform -translate-y-1' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                <Code className="w-6 h-6" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CodeMaster
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                AI-Powered Development
              </span>
            </div>
          </div>

          {/* Enhanced Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/login" >
            <button className="px-5 py-2.5 text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium rounded-lg hover:bg-gray-50 relative group">
               <span>Sign In</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button></Link>
            <Link to="/signup" >
            <button className="relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group overflow-hidden">
              <span className="relative z-10 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Try Free</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            </Link>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              {isMenuOpen ? (
                <X size={24} className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" />
              ) : (
                <Menu size={24} className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl">
            <div className="px-4 py-6 space-y-3">
              <button 
                className="w-full px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 font-medium text-left rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </button>
              <button 
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Zap className="w-4 h-4" />
                <span>Start Coding</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;