import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ProfileDropdown } from "./ProfileDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  if (user && isDashboardRoute) {
    return null;
  }
  
  const landingPageNavItems = [
    { path: "/", label: "For Professionals" },
    { path: "/companies", label: "For Companies" },
    { path: "/investors", label: "For Investors" },
  ];

  const dashboardNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/my-paths", label: "My Paths" },
    { path: "/dashboard/explore", label: "Explore" },
  ];

  const navItems = user ? dashboardNavItems : landingPageNavItems;

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
              alt="Forge College"
              className="h-8 w-auto"
              style={{ minWidth: "80px" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  location.pathname === item.path
                    ? "bg-forge-orange text-white shadow-lg border-forge-orange"
                    : "text-forge-dark hover:bg-forge-orange hover:text-white border-forge-dark/20 hover:border-forge-orange shadow-sm"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/login"
                className="bg-forge-dark text-forge-cream px-6 py-2.5 rounded-full text-sm font-medium hover:bg-forge-dark/90 transition-colors shadow-lg border border-forge-dark"
              >
                Login
              </Link>
            )}
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
          <div className="md:hidden py-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 mx-2 mb-2 rounded-full text-base font-medium transition-colors border ${
                  location.pathname === item.path
                    ? "bg-forge-orange text-white shadow-lg border-forge-orange"
                    : "text-forge-dark hover:bg-forge-orange hover:text-white border-forge-dark/20 hover:border-forge-orange shadow-sm"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 mt-4">
                <ProfileDropdown />
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-3 px-4 mt-4 rounded-full text-base font-medium bg-forge-dark text-forge-cream hover:bg-forge-dark/90 transition-colors shadow-lg border border-forge-dark"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
