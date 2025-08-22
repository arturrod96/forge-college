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
              className="h-12 w-auto"
              style={{ minWidth: "120px" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-forge-cream/95 backdrop-blur-sm rounded-2xl border border-forge-orange/20 shadow-lg overflow-hidden">
            {navItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                <Link
                  to={item.path}
                  className={`px-6 py-3 text-sm font-semibold transition-all duration-300 relative group ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-forge-gray hover:text-forge-dark"
                  }`}
                >
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-forge-orange rounded-full m-1 -z-10"></div>
                  )}
                  {location.pathname !== item.path && (
                    <div className="absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  {item.label}
                </Link>
                <div className="h-6 w-px bg-forge-gray/30"></div>
              </div>
            ))}

            {user ? (
              <div className="px-6 py-3">
                <ProfileDropdown />
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 text-sm font-semibold transition-all duration-300 relative group text-forge-gray hover:text-forge-dark"
              >
                <div className="absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-forge-dark hover:text-forge-orange transition-colors p-2 bg-forge-cream/95 backdrop-blur-sm rounded-xl border border-forge-orange/20 shadow-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 bg-forge-cream/95 backdrop-blur-sm rounded-2xl mx-4 mt-4 border border-forge-orange/20 shadow-lg overflow-hidden">
            {navItems.map((item, index) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 px-6 text-base font-semibold transition-colors relative group ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-forge-gray hover:text-forge-dark"
                  }`}
                >
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-forge-orange rounded-full m-1 -z-10"></div>
                  )}
                  {location.pathname !== item.path && (
                    <div className="absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  {item.label}
                </Link>
                <div className="h-px bg-forge-gray/30 mx-6"></div>
              </div>
            ))}

            {user ? (
              <div className="py-4 px-6">
                <ProfileDropdown />
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-4 px-6 text-base font-semibold transition-colors relative group text-forge-gray hover:text-forge-dark"
              >
                <div className="absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
