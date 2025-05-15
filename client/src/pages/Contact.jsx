"use client"
import { motion } from "framer-motion"

const Contact = () => {
  const formControls = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-6 bg-black text-white min-h-screen"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent"
        >
          Contact Us
        </motion.h1>
        <motion.div className="rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-gray-900/80 border border-blue-900/30 shadow-blue-900/20 transform transition-all duration-500 hover:translate-y-[-5px] perspective-1000">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h2>
              <form className="space-y-4">
                <motion.div variants={formControls} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                  />
                </motion.div>
                <motion.div variants={formControls} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                  />
                </motion.div>
                <motion.div variants={formControls} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                  <textarea className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"></textarea>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-900/50"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-black rounded-xl p-6 border border-gray-800 transform transition-all duration-500 hover:translate-y-[-5px] hover:rotate-1 perspective-1000"
            >
              <h3 className="text-xl font-semibold mb-6 text-white">Our Location</h3>
              <div className="h-48 mb-6 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 z-10" />
                <img src="https://cache.careers360.mobi/media/schools/staticmap/2024/2/24/3866.png" alt="Location map" className="w-full h-full object-cover" />
              </div>
              <p className="mb-6 text-gray-300">
                570, Phantom Rides
                <br />
                Anand Vihar, Mohali Chandigarh
              </p>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center">
                  <span className="mr-2">📞</span> +91 91669-38016
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✉️</span> ms8031139@gmail.com
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Contact
