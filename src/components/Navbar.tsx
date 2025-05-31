
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'For Professionals' },
    { path: '/companies', label: 'For Companies' },
    { path: '/investors', label: 'For Investors' }
  ];

  return (
    <nav className="bg-forge-cream/90 backdrop-blur-xl border-b border-forge-cream sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/1138977d-21a9-493b-8da2-9ec7f244135f.png" 
              alt="Forge College" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-forge-orange'
                    : 'text-forge-dark hover:text-forge-orange'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-forge-dark hover:text-forge-orange transition-colors p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-forge-cream py-6 bg-forge-cream/95 backdrop-blur-xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-forge-orange'
                    : 'text-forge-dark hover:text-forge-orange'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
