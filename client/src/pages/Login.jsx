"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/user/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        // Update the auth context (this will also update localStorage)
        login(data)
        
        toast.success("Login successful!")
        navigate("/cars")
      } else {
        toast.error(data.message || "Login failed")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl border border-blue-900/30 shadow-2xl shadow-blue-900/20 bg-gray-900 transform transition-all duration-500 hover:translate-y-[-5px] perspective-1000"
      >
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg shadow-lg hover:shadow-blue-900/50 font-medium"
          >
            Login
          </motion.button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:text-cyan-500">
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
