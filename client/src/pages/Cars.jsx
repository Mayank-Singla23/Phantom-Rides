import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Heart, Edit, Trash2, X, ChevronLeft, ChevronRight, Maximize, Calendar } from "lucide-react"
import Card3D from "./3d-card-effect"

const Cars = () => {
  const [cars, setCars] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    year: "",
    price: "",
    image: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    year: "",
    model: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [fullscreenView, setFullscreenView] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isTestRideModalOpen, setIsTestRideModalOpen] = useState(false)
  const [testRideFormData, setTestRideFormData] = useState({
    preferredDate: "",
    preferredTime: "",
    notes: ""
  })
  const currentUser = JSON.parse(localStorage.getItem("user"))
  const isAdmin = currentUser?.isAdmin || false

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars/cars`)
      setCars(response.data)
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAdmin) {
      toast.error("Admin access required")
      setIsModalOpen(false)
      return
    }
    
    try {
      const config = {
        headers: { userid: currentUser._id }  // Fix to lowercase userid
      }
      
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/cars/cars/${editingId}`, formData, config)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/cars/cars`, formData, config)
      }
      setIsModalOpen(false)
      setFormData({ name: "", model: "", year: "", price: "", image: "" })
      setEditingId(null)
      fetchCars()
    } catch (error) {
      console.error("Error saving car:", error)
      toast.error(error.response?.data?.message || "Error saving car")
    }
  }

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Admin access required")
      return
    }
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cars/cars/${id}`, {
        headers: { userid: currentUser._id }  // Fix to lowercase userid
      })
      fetchCars()
    } catch (error) {
      console.error("Error deleting car:", error)
      toast.error(error.response?.data?.message || "Error deleting car")
    }
  }

  const handleLike = async (carId) => {
    if (!currentUser) {
      toast.error("Please login first")
      return
    }

    try {
      // Find if car is already liked by this user
      const car = cars.find(c => c._id === carId)
      const alreadyLiked = car && car.likes.includes(currentUser._id)
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cars/cars/${carId}/like`, {
        userId: currentUser._id,
      })
      
      // Update cars immediately
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars/cars`)
      setCars(response.data)
      
      // If in fullscreen view, update the fullscreen car data too
      if (fullscreenView && fullscreenView._id === carId) {
        const updatedCar = response.data.find(c => c._id === carId)
        if (updatedCar) {
          setFullscreenView(updatedCar)
        }
      }
      
      // Show appropriate notification based on the action
      if (alreadyLiked) {
        toast.success("Car unliked successfully!")
      } else {
        toast.success("Car liked successfully!")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating like status")
    }
  }

  const handleTestRideSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/test-rides/request`, {
        userId: currentUser._id,
        carId: fullscreenView._id,
        preferredDate: testRideFormData.preferredDate,
        preferredTime: testRideFormData.preferredTime,
        notes: testRideFormData.notes
      });
      
      setIsTestRideModalOpen(false);
      setTestRideFormData({
        preferredDate: "",
        preferredTime: "",
        notes: ""
      });
      
      toast.success("Test ride requested successfully! Awaiting approval.");
    } catch (error) {
      console.error("Error booking test ride:", error);
      toast.error(error.response?.data?.message || "Failed to book test ride");
    }
  };

  const openFullscreenView = (car, index) => {
    setIsAnimating(true)
    setFullscreenView(car)
    setCurrentImageIndex(index || 0)
    document.body.style.overflow = "hidden"
    setTimeout(() => setIsAnimating(false), 500)
  }

  const closeFullscreenView = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setFullscreenView(null)
      document.body.style.overflow = "auto"
      setIsAnimating(false)
    }, 300)
  }

  const navigateImages = (direction) => {
    if (!fullscreenView || isAnimating) return

    setIsAnimating(true)
    setCurrentImageIndex((prev) => {
      if (direction === "next") {
        return prev === 0 ? 0 : prev
      } else {
        return prev === 0 ? 0 : prev - 1
      }
    })
    setTimeout(() => setIsAnimating(false), 300)
  }

  const filteredCars = cars.filter((car) => {
    return (
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filters.minPrice || car.price >= filters.minPrice) &&
      (!filters.maxPrice || car.price <= filters.maxPrice) &&
      (!filters.year || car.year === filters.year) &&
      (!filters.model || car.model === filters.model)
    )
  })

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
            Luxury Cars Collection
          </h1>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-blue-900/30 flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Add New Car</span>
            </motion.button>
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-800 bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Filter />
              <span>Filters</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4"
              >
                <input
                  type="number"
                  placeholder="Min Price"
                  className="p-3 rounded-lg border border-gray-800 bg-gray-900 text-white"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="p-3 rounded-lg border border-gray-800 bg-gray-900 text-white"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Year"
                  className="p-3 rounded-lg border border-gray-800 bg-gray-900 text-white"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Model"
                  className="p-3 rounded-lg border border-gray-800 bg-gray-900 text-white"
                  value={filters.model}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card3D key={car._id} className="group">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-blue-900/20 group"
              >
                <div className="relative cursor-pointer overflow-hidden" onClick={() => openFullscreenView(car)}>
                  <img
                    src={car.image || "/placeholder.svg?height=300&width=500&query=luxury car in dark showroom"}
                    alt={car.name}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-blue-600/80 p-3 rounded-full"
                    >
                      <Maximize className="text-white w-6 h-6" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-white">{car.name}</h2>
                  <p className="text-gray-400 mb-4">
                    {car.model} - {car.year}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                      ${car.price}
                    </span>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(car._id)}
                        className="flex items-center gap-1"
                      >
                        <Heart
                          size={18}
                          className={
                            currentUser && car.likes.includes(currentUser._id)
                              ? "fill-current text-cyan-500"
                              : "text-cyan-500"
                          }
                        />
                        <span>{car.likes?.length || 0}</span>
                      </motion.button>
                      {isAdmin && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setFormData(car)
                              setEditingId(car._id)
                              setIsModalOpen(true)
                            }}
                            className="p-1 text-yellow-500"
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(car._id)
                            }}
                            className="p-1 text-red-500"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card3D>
          ))}
        </motion.div>

        {/* Form Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-blue-900/30 shadow-2xl shadow-blue-900/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{editingId ? "Edit Car" : "Add New Car"}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsModalOpen(false)
                      setFormData({ name: "", model: "", year: "", price: "", image: "" })
                      setEditingId(null)
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {["name", "model", "year", "price", "image"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{field}</label>
                      <input
                        type={field === "year" || field === "price" ? "number" : "text"}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 justify-end mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false)
                        setFormData({ name: "", model: "", year: "", price: "", image: "" })
                        setEditingId(null)
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-colors"
                    >
                      {editingId ? "Update" : "Add"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen View Modal */}
        <AnimatePresence>
          {fullscreenView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-50 flex flex-col"
            >
              <div className="absolute top-4 right-4 flex gap-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeFullscreenView}
                  className="p-3 bg-gray-900/80 rounded-full text-white hover:bg-gray-800/80 border border-blue-900/30"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="flex items-center justify-between px-4 absolute top-1/2 left-0 right-0 z-10 transform -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateImages("prev")}
                  className="p-3 bg-gray-900/80 rounded-full text-white hover:bg-gray-800/80 border border-blue-900/30"
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateImages("next")}
                  className="p-3 bg-gray-900/80 rounded-full text-white hover:bg-gray-800/80 border border-blue-900/30"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              <motion.div
                className="flex-1 flex items-center justify-center p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={
                    fullscreenView.image || "/placeholder.svg?height=600&width=800&query=luxury car in dark showroom"
                  }
                  alt={fullscreenView.name}
                  className="max-h-[70vh] max-w-[90%] w-auto object-contain rounded-lg shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 p-6 border-t border-blue-900/30"
              >
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent mb-4">
                    {fullscreenView.name}
                  </h2>
                  <div className="flex flex-wrap gap-6 text-gray-300">
                    <div className="bg-black/50 px-4 py-2 rounded-lg">
                      <span className="text-gray-500 mr-2">Model:</span> {fullscreenView.model}
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-lg">
                      <span className="text-gray-500 mr-2">Year:</span> {fullscreenView.year}
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-lg">
                      <span className="text-gray-500 mr-2">Price:</span>{" "}
                      <span className="text-blue-400 font-bold">${fullscreenView.price}</span>
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Heart
                        className={
                          currentUser && fullscreenView.likes.includes(currentUser._id)
                            ? "fill-current text-cyan-500"
                            : "text-cyan-500"
                        }
                        size={18}
                      />
                      <span>{fullscreenView.likes?.length || 0} likes</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-lg text-white shadow-lg shadow-blue-900/30 ${
                        currentUser && fullscreenView.likes.includes(currentUser._id)
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "bg-gradient-to-r from-blue-600 to-cyan-600"
                      }`}
                      onClick={() => handleLike(fullscreenView._id)}
                    >
                      {currentUser && fullscreenView.likes.includes(currentUser._id) ? "Unlike This Car" : "Like This Car"}
                    </motion.button>
                    
                    {currentUser && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/30 flex items-center gap-2"
                        onClick={() => setIsTestRideModalOpen(true)}
                      >
                        <Calendar size={18} />
                        Book Test Ride
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gray-800 rounded-lg text-white"
                      onClick={closeFullscreenView}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Ride Modal */}
        <AnimatePresence>
          {isTestRideModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-blue-900/30 shadow-2xl shadow-blue-900/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Book Test Ride</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsTestRideModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg text-white">{fullscreenView?.name} {fullscreenView?.model}</h3>
                  <p className="text-gray-400">Year: {fullscreenView?.year}</p>
                </div>
                <form onSubmit={handleTestRideSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={testRideFormData.preferredDate}
                      onChange={(e) => setTestRideFormData({ ...testRideFormData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Time</label>
                    <select
                      value={testRideFormData.preferredTime}
                      onChange={(e) => setTestRideFormData({ ...testRideFormData, preferredTime: e.target.value })}
                      className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes (Optional)</label>
                    <textarea
                      value={testRideFormData.notes}
                      onChange={(e) => setTestRideFormData({ ...testRideFormData, notes: e.target.value })}
                      className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                      placeholder="Any special requests or questions?"
                    />
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>* Test rides are subject to approval by our team.</p>
                    <p>* You will be notified once your request is processed.</p>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsTestRideModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Request Test Ride
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Cars
