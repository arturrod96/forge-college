import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "For Professionals" },
    { path: "/companies", label: "For Companies" },
    { path: "/investors", label: "For Investors" },
  ];

  return (
    <nav className="bg-forge-cream/90 backdrop-blur-xl border-b border-forge-cream sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/lovable-uploads/Forge College Logo.png"
              alt="Forge College"
              className="h-12 w-auto max-h-16"
              style={{
                minWidth: "90px",
                mixBlendMode: "multiply",
                filter: "contrast(1.2) brightness(1.1)",
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-forge-dark text-white shadow-sm"
                    : "text-forge-dark hover:bg-forge-orange hover:text-white"
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
                className={`block py-3 px-4 mx-2 mb-2 rounded-full text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-forge-dark text-white shadow-sm"
                    : "text-forge-dark hover:bg-forge-orange hover:text-white"
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
