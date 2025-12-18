import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";

import {
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiPackage,
  FiHome,
  FiGrid,
  FiHeart,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const wishlistItems = useCartStore((state) => state.wishlistItems);
  const loading = useCartStore((state) => state.loading);

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const wishlistCount = wishlistItems.length;

  const cartBadge =
    !loading && Number.isFinite(cartCount) && cartCount > 0 ? cartCount : 0;

  const wishlistBadge =
    !loading && Number.isFinite(wishlistCount) && wishlistCount > 0
      ? wishlistCount
      : 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    setMenuOpen(false);
    setTimeout(() => setDropdownOpen(false), 50);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".dropdown-menu")) setDropdownOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  if (user?.is_staff) return null;

  const navLinks = [
    { to: "/", icon: <FiHome />, label: "Home" },
    { to: "/products", icon: <FiGrid />, label: "Products" },
  ];

  const userLinks = [
    { to: "/cart", icon: <FiShoppingCart />, label: "Cart", badge: cartBadge },
    {
      to: "/wishlist",
      icon: <FiHeart />,
      label: "Wishlist",
      badge: wishlistBadge,
    },
    { to: "/orders", icon: <FiPackage />, label: "Orders" },
  ];

  const authLinks = [
    { to: "/login", icon: <FiLogIn />, label: "Login" },
    { to: "/register", icon: <FiUserPlus />, label: "Register" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 shadow">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">
        {/* Desktop Left */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`p-2 rounded-md text-white hover:bg-slate-700 transition ${
                isActive(link.to) ? "bg-slate-800" : ""
              }`}
            >
              {link.icon}
            </Link>
          ))}
        </div>

        {/* Logo Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
          <Link to="/">
            <img
              src="https://tss-static-images.gumlet.io/non-member-logo2.gif"
              alt="Logo"
              className="h-12"
              loading="eager"
            />
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center space-x-4 border-l border-slate-600 pl-6">
          {user ? (
            <>
              {userLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative p-2 text-white hover:bg-slate-700 rounded-full transition ${
                    isActive(link.to) ? "bg-slate-800" : ""
                  }`}
                >
                  {link.icon}
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm border border-slate-900">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* User Dropdown */}
              <div className="relative dropdown-menu">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="p-2 text-white hover:bg-slate-700 rounded-full transition"
                >
                  <FiUser />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-slate-800 text-white rounded-md shadow-lg py-1 border border-slate-700">
                    <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
                      Hi, {user.first_name || "User"}
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-slate-700"
                    >
                      <FiUser className="inline-block mr-2" />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700"
                    >
                      <FiLogOut className="inline-block mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`p-2 rounded-md text-white hover:bg-slate-700 transition ${
                  isActive(link.to) ? "bg-slate-800" : ""
                }`}
              >
                {link.icon}
              </Link>
            ))
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center w-full justify-between">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 text-white hover:bg-slate-700"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link
            to="/cart"
            className="relative p-2 text-white hover:bg-slate-700"
          >
            <FiShoppingCart size={22} />
            {cartBadge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm border border-slate-900">
                {cartBadge}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 p-4 border-t border-slate-700 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 p-2 rounded-md ${
                isActive(link.to)
                  ? "bg-slate-800"
                  : "text-white hover:bg-slate-700"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          {user ? (
            <>
              {userLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    isActive(link.to)
                      ? "bg-slate-800"
                      : "text-white hover:bg-slate-700"
                  }`}
                >
                  {link.icon} {link.label}
                  {link.badge > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-white hover:bg-slate-700 rounded-md"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 p-2 rounded-md ${
                  isActive(link.to)
                    ? "bg-slate-800"
                    : "text-white hover:bg-slate-700"
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
