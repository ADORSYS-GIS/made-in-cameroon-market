// components/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartIcon } from './Cart/CartIcon';
import { SearchBar } from './SearchBar';
import { FiMenu, FiX } from 'react-icons/fi';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src="../public/cmlogo.png"
              alt="Cameroon Marketplace Logo"
              className="h-10 w-auto" // Adjust size as needed
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={console.log} />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-600 hover:text-green-600 transition-colors px-3 py-2 rounded-md"
            >
              Products
            </Link>
            <CartIcon />
          </div>

          {/* Mobile Cart Icon */}
          <div className="md:hidden ml-auto">
            <CartIcon />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={console.log} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/products"
              className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};