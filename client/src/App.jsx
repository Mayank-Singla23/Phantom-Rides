import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import Cars from './pages/Cars'
import Login from './pages/Login'
import Register from './pages/register'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Admin route guard component
const AdminRoute = ({ element }) => {
  const { user } = useAuth();
  return user && user.isAdmin ? element : <Navigate to="/login" />;
};

// User route guard component
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App