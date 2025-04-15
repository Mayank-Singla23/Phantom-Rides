"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }

    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`${scrolled ? "bg-black/90" : "bg-black/70"} backdrop-blur-md text-white py-4 px-6 fixed w-full top-0 z-50 shadow-lg transition-all duration-300 border-b ${scrolled ? "border-blue-900/30" : "border-transparent"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold">
          <Link to="/" className="bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
            Phantom Rides
          </Link>
        </motion.div>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </motion.button>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`lg:flex gap-8 items-center ${isOpen ? "flex flex-col absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md p-6 border-b border-blue-900/30" : "hidden"}`}
          >
            {["Home", "Cars", "About", "Contact"].map((item, i) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            
            {!user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2 rounded-lg hover:shadow-lg transition-all shadow-blue-900/30"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/register"
                    className="bg-gray-900 border border-blue-900/30 px-5 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </motion.div>
                
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-blue-900/30 rounded-lg overflow-hidden shadow-lg z-50"
                  >
                    <div className="p-3 border-b border-blue-900/30">
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-white hover:bg-blue-900/30 transition-colors">
                      Profile
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-white hover:bg-blue-900/30 transition-colors">
                      Wishlist
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-blue-900/30 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
