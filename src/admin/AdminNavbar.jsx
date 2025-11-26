import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // Wait for auth to load
  if (loading) return null;

  // Protect admin navbar
  if (!user || !user.is_staff) return null;

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Products", path: "/admin/products" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Reports", path: "/admin/reports" },
  ];

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout(); // logout already handles navigation
  };

  return (
    <header className="bg-slate-900 shadow-lg sticky top-0 z-50 border-b border-slate-700 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-widest uppercase">
          Souled Admin
        </h1>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-slate-300 focus:outline-none text-xl"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold uppercase tracking-wide px-3 py-1.5 rounded-md transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-yellow-400 text-black shadow-md"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Logout */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 text-sm text-slate-300 border border-slate-600 px-4 py-1.5 rounded-md hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-md group"
        >
          <FiLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-yellow-400 text-black shadow"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-slate-300 border border-slate-600 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-all duration-300 group"
          >
            <FiLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;

