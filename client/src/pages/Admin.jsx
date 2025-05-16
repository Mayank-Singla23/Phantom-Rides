import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Users, Car, X, Edit, Trash2, Plus, Save, LogOut, Calendar } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [testRides, setTestRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [carFormData, setCarFormData] = useState({
    name: "",
    model: "",
    year: "",
    price: "",
    image: "",
  });
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideUpdateData, setRideUpdateData] = useState({
    status: "",
    adminMessage: ""
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!currentUser || !currentUser.isAdmin) {
      toast.error("Admin access required");
      navigate("/");
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch users - Fix the header name to lowercase userid
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/users`,
        { headers: { userid: currentUser._id } }
      );
      setUsers(usersResponse.data);

      // Fetch cars
      const carsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars/cars`);
      setCars(carsResponse.data);

      // Fetch test rides
      const testRidesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/test-rides/all`,
        { headers: { userid: currentUser._id } }
      );
      setTestRides(testRidesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cars/cars/${editingId}`,
          carFormData,
          { headers: { userid: currentUser._id } } // Fix to lowercase userid
        );
        toast.success("Car updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cars/cars`,
          carFormData,
          { headers: { userid: currentUser._id } } // Fix to lowercase userid
        );
        toast.success("New car added successfully");
      }
      setIsModalOpen(false);
      setCarFormData({ name: "", model: "", year: "", price: "", image: "" });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save car");
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/cars/cars/${id}`,
          { headers: { userid: currentUser._id } } // Fix to lowercase userid
        );
        toast.success("Car deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete car");
      }
    }
  };

  const handleEditUser = (user) => {
    setUserFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
    });
    setEditingId(user._id);
    setIsEditingUser(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/users/${editingId}`,
        userFormData,
        { headers: { userid: currentUser._id } } // Fix to lowercase userid
      );
      toast.success("User updated successfully");
      setIsEditingUser(false);
      setUserFormData({ name: "", email: "", isAdmin: false });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === currentUser._id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/users/${id}`,
          { headers: { userid: currentUser._id } } // Fix to lowercase userid
        );
        toast.success("User deleted successfully");
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-xs">
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded text-xs">
            Pending
          </span>
        );
    }
  };

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
    setRideUpdateData({
      status: ride.status,
      adminMessage: ride.adminMessage || ""
    });
  };

  const handleRideUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/test-rides/${selectedRide._id}`,
        rideUpdateData,
        { headers: { userid: currentUser._id } }
      );

      // Update the ride in the local state
      setTestRides(prevRides => 
        prevRides.map(ride => 
          ride._id === selectedRide._id ? response.data : ride
        )
      );

      setSelectedRide(null);
      toast.success("Test ride status updated successfully");
    } catch (error) {
      console.error("Error updating test ride:", error);
      toast.error(error.response?.data?.message || "Failed to update test ride");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === "users" 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600" 
                  : "bg-gray-800"
              }`}
              onClick={() => setActiveTab("users")}
            >
              <Users size={18} />
              <span>Users</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === "cars" 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600" 
                  : "bg-gray-800"
              }`}
              onClick={() => setActiveTab("cars")}
            >
              <Car size={18} />
              <span>Cars</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === "test-rides" 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600" 
                  : "bg-gray-800"
              }`}
              onClick={() => setActiveTab("test-rides")}
            >
              <Calendar size={18} />
              <span>Test Rides</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-red-900 text-white flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Users Management */}
            {activeTab === "users" && (
              <div className="bg-gray-900 rounded-xl border border-blue-900/20 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-blue-900/20">
                  <h2 className="text-xl font-semibold text-white">Users Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs ${user.isAdmin ? "bg-cyan-800 text-cyan-200" : "bg-gray-700 text-gray-300"}`}>
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditUser(user)}
                              className="p-1 text-yellow-500"
                            >
                              <Edit size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-1 text-red-500"
                              disabled={user._id === currentUser._id}
                            >
                              <Trash2 size={18} className={user._id === currentUser._id ? "opacity-50" : ""} />
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Cars Management */}
            {activeTab === "cars" && (
              <div className="bg-gray-900 rounded-xl border border-blue-900/20 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-blue-900/20 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Cars Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={() => {
                      setCarFormData({ name: "", model: "", year: "", price: "", image: "" });
                      setEditingId(null);
                      setIsModalOpen(true);
                    }}
                  >
                    <Plus size={18} />
                    <span>Add New Car</span>
                  </motion.button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Model
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {cars.map((car) => (
                        <tr key={car._id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="h-12 w-20 object-cover rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${car.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{car.likes?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setCarFormData(car);
                                setEditingId(car._id);
                                setIsModalOpen(true);
                              }}
                              className="p-1 text-yellow-500"
                            >
                              <Edit size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCar(car._id)}
                              className="p-1 text-red-500"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Test Rides Management */}
            {activeTab === "test-rides" && (
              <div className="bg-gray-900 rounded-xl border border-blue-900/20 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-blue-900/20">
                  <h2 className="text-xl font-semibold text-white">Test Ride Requests</h2>
                </div>
                {testRides.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No test ride requests found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Car
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Preferred Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Preferred Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {testRides.map((ride) => (
                          <tr key={ride._id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                {ride.userId ? (
                                  <>
                                    <div className="font-medium text-white">{ride.userId.name}</div>
                                    <div className="text-sm text-gray-400">{ride.userId.email}</div>
                                  </>
                                ) : (
                                  <div className="text-gray-500 italic">User not available</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {ride.carId ? (
                                  <>
                                    <img 
                                      src={ride.carId.image} 
                                      alt={ride.carId.name}
                                      className="h-10 w-16 rounded object-cover mr-3"
                                    />
                                    <div>
                                      <div className="font-medium text-white">{ride.carId.name}</div>
                                      <div className="text-sm text-gray-400">{ride.carId.model} ({ride.carId.year})</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-gray-500 italic">Car not available</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(ride.preferredDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {ride.preferredTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(ride.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRideSelect(ride)}
                                className="px-3 py-1 bg-blue-600 rounded-lg text-white text-sm"
                              >
                                Update Status
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Car Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-blue-900/30 shadow-2xl shadow-blue-900/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? "Edit Car" : "Add New Car"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={handleCarSubmit} className="space-y-4">
                {["name", "model", "year", "price", "image"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "year" || field === "price" ? "number" : "text"}
                      value={carFormData[field]}
                      onChange={(e) =>
                        setCarFormData({ ...carFormData, [field]: e.target.value })
                      }
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
                    onClick={() => setIsModalOpen(false)}
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
            </div>
          </div>
        )}

        {/* User Edit Modal */}
        {isEditingUser && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-blue-900/30 shadow-2xl shadow-blue-900/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit User</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingUser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userFormData.name}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={userFormData.isAdmin}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, isAdmin: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-300">
                    Admin privileges
                  </label>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Test Ride Update Modal */}
        {selectedRide && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-blue-900/30 shadow-2xl shadow-blue-900/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Update Test Ride Status</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRide(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  {selectedRide.carId ? (
                    <>
                      <img
                        src={selectedRide.carId.image}
                        alt={selectedRide.carId.name}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-white">{selectedRide.carId.name} {selectedRide.carId.model}</h3>
                        {selectedRide.userId ? (
                          <p className="text-gray-400 text-sm">Requested by: {selectedRide.userId.name}</p>
                        ) : (
                          <p className="text-gray-400 text-sm">Requested by: Unknown user</p>
                        )}
                        <p className="text-gray-400 text-sm">
                          For: {formatDate(selectedRide.preferredDate)}, {selectedRide.preferredTime}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="font-medium text-white">Car details not available</h3>
                      {selectedRide.userId ? (
                        <p className="text-gray-400 text-sm">Requested by: {selectedRide.userId.name}</p>
                      ) : (
                        <p className="text-gray-400 text-sm">Requested by: Unknown user</p>
                      )}
                      <p className="text-gray-400 text-sm">
                        For: {formatDate(selectedRide.preferredDate)}, {selectedRide.preferredTime}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={rideUpdateData.status}
                    onChange={(e) => setRideUpdateData({ ...rideUpdateData, status: e.target.value })}
                    className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Admin Message (optional)
                  </label>
                  <textarea
                    value={rideUpdateData.adminMessage}
                    onChange={(e) => setRideUpdateData({ ...rideUpdateData, adminMessage: e.target.value })}
                    className="w-full p-3 border border-gray-800 rounded-lg bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    placeholder="Add a message to the user about their test ride request"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRide(null)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRideUpdate}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-colors"
                >
                  Update Status
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
