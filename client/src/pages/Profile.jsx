import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Car, Clock, Calendar, X, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [testRides, setTestRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("test-rides");
  const [selectedRide, setSelectedRide] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    fetchTestRides();
  }, [navigate]);

  const fetchTestRides = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/test-rides/user/${currentUser._id}`
      );
      setTestRides(response.data);
    } catch (error) {
      console.error("Error fetching test rides:", error);
      toast.error("Failed to load your test rides");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs">
            <CheckCircle size={14} className="mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center text-red-400 bg-red-900/30 px-2 py-1 rounded text-xs">
            <XCircle size={14} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded text-xs">
            <AlertCircle size={14} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const viewRideDetails = (ride) => {
    setSelectedRide(ride);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
            <User size={20} className="text-blue-400" />
            <span>{currentUser.name}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    activeTab === "test-rides"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("test-rides")}
                >
                  <Car size={18} />
                  <span>My Test Rides</span>
                </motion.button>
                
                {/* Additional tabs can be added here */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === "test-rides" && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800">
                      <h2 className="text-xl font-semibold">My Test Ride Bookings</h2>
                    </div>

                    {testRides.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Car size={48} className="mx-auto mb-4 opacity-50" />
                        <p>You haven't booked any test rides yet.</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate("/cars")}
                          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-white inline-block"
                        >
                          Explore Cars
                        </motion.button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-800">
                        {testRides.map((ride) => (
                          <div
                            key={ride._id}
                            className="p-4 hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex gap-4 items-center">
                                <img
                                  src={ride.carId.image}
                                  alt={ride.carId.name}
                                  className="w-20 h-14 object-cover rounded-lg"
                                />
                                <div>
                                  <h3 className="font-medium text-white">
                                    {ride.carId.name} {ride.carId.model}
                                  </h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                    <span className="flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      {formatDate(ride.preferredDate)}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock size={14} className="mr-1" />
                                      {ride.preferredTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {getStatusBadge(ride.status)}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => viewRideDetails(ride)}
                                  className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700"
                                >
                                  Details
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Test Ride Details Modal */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-blue-900/30 shadow-2xl shadow-blue-900/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Test Ride Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedRide(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="flex gap-4 mb-6">
              <img
                src={selectedRide.carId.image}
                alt={selectedRide.carId.name}
                className="w-32 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-medium text-white">
                  {selectedRide.carId.name} {selectedRide.carId.model}
                </h3>
                <p className="text-gray-400">Year: {selectedRide.carId.year}</p>
                <p className="text-blue-400 font-medium">
                  ${selectedRide.carId.price}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Booking Date</p>
                  <p className="text-white">{formatDate(selectedRide.requestDate)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedRide.status)}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Preferred Date</p>
                  <p className="text-white">{formatDate(selectedRide.preferredDate)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Preferred Time</p>
                  <p className="text-white">{selectedRide.preferredTime}</p>
                </div>
              </div>
            </div>

            {selectedRide.notes && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Your Notes</p>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-white">{selectedRide.notes}</p>
                </div>
              </div>
            )}

            {selectedRide.adminMessage && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Admin Message</p>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-white">{selectedRide.adminMessage}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRide(null)}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white"
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
