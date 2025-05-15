"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LogOut, ShieldCheck, UserCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="fixed w-full z-40 bg-black/80 backdrop-blur-md border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                Phantom Rides
              </h1>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/cars"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cars
                </Link>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-cyan-300 hover:text-white hover:bg-cyan-900/50 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                  >
                    <ShieldCheck size={16} />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/profile"
                    className="text-sm text-gray-300 flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <UserCircle size={16} />
                    <span>{user.name}</span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-gray-900 p-2 rounded-md text-gray-300 hover:text-white"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="bg-gray-900 p-2 rounded-md text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-md text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-900 p-2 rounded-md text-gray-400 hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          <Link
            to="/"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/cars"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Cars
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          {user?.isAdmin && (
            <Link
              to="/admin"
              className="text-cyan-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              <ShieldCheck size={16} />
              Admin
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            {user ? (
              <div className="flex flex-col w-full gap-2">
                <Link
                  to="/profile"
                  className="text-base font-medium leading-none text-white flex items-center gap-1"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle size={16} />
                  {user.name}
                </Link>
                <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="mt-3 flex items-center justify-center gap-1 w-full bg-gray-800 p-2 rounded-md text-gray-300 hover:text-white"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <Link
                  to="/login"
                  className="w-full bg-gray-800 p-2 rounded-md text-gray-300 hover:text-white text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-md text-white text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
