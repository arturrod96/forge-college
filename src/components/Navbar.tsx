import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useOAuth";
import { ProfileDropdown } from "./ProfileDropdown";
import { LogoutButton } from "./auth/LogoutButton";

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  // Don't render navbar while auth is loading
  if (loading) {
    return null;
  }

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/login-oauth";
  const promoOffsetClass = "top-[calc(0.5rem+30px)] sm:top-[calc(1rem+30px)]";

  // For dashboard routes, don't show navbar (sidebar handles navigation)
  if (isDashboardRoute) {
    return null;
  }

  // For login/signup pages, show only the logo
  if (isLoginPage) {
    return (
      <nav className={`fixed left-0 right-0 z-50 ${promoOffsetClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
                alt="Forge College"
                className="h-10 sm:h-12 w-auto"
                style={{ minWidth: "120px" }}
              />
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  
  // Always show landing page navigation items for all users (including logged in users)
  const landingPageNavItems = [
    { path: "/old/hidden/index", label: t('nav.forProfessionals') },
    { path: "/companies", label: t('nav.forCompanies') },
    { path: "/investors", label: t('nav.forInvestors') },
  ];

  return (
    <nav className={`fixed left-0 right-0 z-50 ${promoOffsetClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu button on the left */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-forge-dark hover:text-forge-orange transition-colors p-2 bg-forge-cream/95 backdrop-blur-sm rounded-xl border border-forge-orange/20 shadow-lg"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
                alt="Forge College"
                className="h-10 sm:h-12 w-auto"
                style={{ minWidth: "120px" }}
              />
            </Link>
          </div>

          {/* Desktop Navigation - Always show landing page items */}
          <div className="hidden md:flex items-center bg-forge-cream/95 backdrop-blur-sm rounded-2xl border border-forge-orange/20 shadow-lg overflow-hidden">
            {landingPageNavItems.map((item, index) => (
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
                {index < landingPageNavItems.length - 1 && (
                  <div className="h-6 w-px bg-forge-gray/30"></div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Dashboard button for logged in users */}
                <Link
                  to="/dashboard"
                  className="bg-forge-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-dark/80 transition-colors shadow-lg"
                >
                  {t('nav.dashboard')}
                </Link>
                <ProfileDropdown />
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-forge-orange transition-colors px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-cream/50"
                >
                  {t('common.buttons.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-forge-orange text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-forge-orange-dark transition-colors shadow-lg border border-forge-orange"
                >
                  {t('common.buttons.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Right side empty on mobile */}
          <div className="md:hidden w-6" />
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 bg-forge-cream/95 backdrop-blur-sm rounded-2xl mx-4 mt-4 border border-forge-orange/20 shadow-lg overflow-hidden">
            {landingPageNavItems.map((item, index) => (
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
                {index < landingPageNavItems.length - 1 && (
                  <div className="h-px bg-forge-gray/30 mx-6"></div>
                )}
              </div>
            ))}
            {user ? (
              <div className="pt-4 mt-4 space-y-3 px-4">
                {/* Dashboard button for mobile */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 px-6 rounded-lg text-base font-medium bg-forge-dark text-white hover:bg-forge-dark/80 transition-colors shadow-lg"
                >
                  {t('nav.dashboard')}
                </Link>
                <div>
                  <ProfileDropdown />
                </div>
                <LogoutButton className="w-full py-3 rounded-lg" />
              </div>
            ) : (
              <div className="pt-4 mt-4 space-y-3 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 px-6 rounded-lg text-base font-medium text-forge-orange hover:bg-forge-orange/10 transition-colors"
                >
                  {t('common.buttons.signIn')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 px-6 rounded-full text-base font-semibold bg-forge-orange text-white hover:bg-forge-orange-dark transition-colors shadow-lg border border-forge-orange"
                >
                  {t('common.buttons.signUp')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
