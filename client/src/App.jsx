import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import Cars from './pages/Cars'
import Login from './pages/Login'
import Register from './pages/register'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cars" element={<Cars />} />

          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />

        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App