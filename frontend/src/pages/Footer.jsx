import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm sm:text-lg">
                CM
              </div>
              <span className="text-lg sm:text-xl font-bold">CodeMaster</span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm">
              Empowering developers with intelligent coding solutions and seamless development experiences.
            </p>
            <div className="flex space-x-3">
              <SocialLink icon={<Github />} href="#" />
              <SocialLink icon={<Twitter />} href="#" />
              <SocialLink icon={<Linkedin />} href="#" />
              <SocialLink icon={<Mail />} href="#" />
            </div>
          </div>

          {/* Product Links */}
          <div className="mt-4 sm:mt-0">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="mt-4 sm:mt-0">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              &copy; 2024 CodeMaster. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a
    href={href}
    className="p-2 sm:p-3 bg-gray-800 rounded-md sm:rounded-lg hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 sm:hover:scale-110"
  >
    {React.cloneElement(icon, { size: window.innerWidth < 640 ? 16 : 20 })}
  </a>
);

export default Footer; 