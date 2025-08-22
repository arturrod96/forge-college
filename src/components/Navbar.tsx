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
          <div className="hidden md:flex items-center bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
            {navItems.map((item, index) => (
              <div key={item.path} className="flex items-center">
                <Link
                  to={item.path}
                  className={`px-6 py-3 text-sm font-semibold transition-all duration-300 relative ${
                    location.pathname === item.path
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <div className="h-6 w-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/login"
                className="bg-black text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg border border-black"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black transition-colors p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 bg-white/90 backdrop-blur-sm rounded-2xl mx-4 mt-4 border border-gray-200/50 shadow-lg overflow-hidden">
            {navItems.map((item, index) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 px-6 text-base font-semibold transition-colors ${
                    location.pathname === item.path
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <div className="h-px bg-gray-200 mx-6"></div>
                )}
              </div>
            ))}
            {user ? (
              <div className="pt-4 mt-4">
                <ProfileDropdown />
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center py-4 px-6 mt-4 text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors border-t border-gray-200"
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
