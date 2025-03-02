import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
              <span className="font-semibold text-xl">Practical AIML</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900">Home</Link>
            <Link to="/services" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900">Services</Link>
            <Link to="/projects" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900">Projects</Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900">About</Link>
            <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900">Contact</Link>
            
            {isAdmin && (
              <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900 font-medium">Admin</Link>
            )}
            
            {user ? (
              <div className="flex items-center ml-4 space-x-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => signOut().then(() => navigate('/'))}
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default" 
                size="sm"
                className="ml-4"
                onClick={() => navigate('/auth')}
              >
                <User className="h-4 w-4 mr-1" /> Login
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b shadow-md">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900" onClick={closeMobileMenu}>Home</Link>
            <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900" onClick={closeMobileMenu}>Services</Link>
            <Link to="/projects" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900" onClick={closeMobileMenu}>Projects</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900" onClick={closeMobileMenu}>Contact</Link>
            
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-900 font-medium" onClick={closeMobileMenu}>Admin</Link>
            )}
            
            {user ? (
              <Button
                variant="ghost" 
                size="sm"
                className="w-full justify-start px-3 py-2"
                onClick={() => {
                  signOut().then(() => navigate('/'));
                  closeMobileMenu();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            ) : (
              <Button
                variant="default" 
                size="sm"
                className="w-full justify-start px-3 py-2"
                onClick={() => {
                  navigate('/auth');
                  closeMobileMenu();
                }}
              >
                <User className="h-4 w-4 mr-2" /> Employee Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
