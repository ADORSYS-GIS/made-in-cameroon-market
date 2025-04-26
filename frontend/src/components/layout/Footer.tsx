
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-cameroon-blue mb-4">Made in Cameroon</h3>
            <p className="text-gray-600 text-sm">
              A platform dedicated to locally made products, 
              where artisans, farmers, and small businesses 
              can sell their goods without competing with big foreign brands.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cameroon-blue mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-cameroon-blue">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-cameroon-blue">About Us</Link></li>
              <li><Link to="/vendor/register" className="text-gray-600 hover:text-cameroon-blue">Become a Vendor</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-cameroon-blue">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cameroon-blue mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@madeincameroon.com</li>
              <li>Phone: +237 6XX XXX XXX</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} Made in Cameroon Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
