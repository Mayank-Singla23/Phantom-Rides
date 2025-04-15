"use client"
import { motion } from "framer-motion"

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 px-6 bg-black text-white">
      <div className="container mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold mb-12 bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent"
        >
          About Us
        </motion.h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ x: -50 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-lg mb-8 text-gray-300 leading-relaxed">
              With over 20 years of experience in luxury automotive sales, we pride ourselves on delivering exceptional
              service and the finest vehicles to our distinguished clients.
            </p>
            <div className="grid grid-cols-2 gap-6 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/20 transform transition-all duration-300 hover:translate-y-[-10px] hover:rotate-1"
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent"
                >
                  500+
                </motion.h3>
                <p className="text-gray-400 mt-2">Cars Sold</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-blue-900/30 shadow-lg shadow-blue-900/20 transform transition-all duration-300 hover:translate-y-[-10px] hover:rotate-1"
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent"
                >
                  98%
                </motion.h3>
                <p className="text-gray-400 mt-2">Client Satisfaction</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl shadow-blue-900/30 border border-blue-900/20 transform transition-all duration-500 hover:translate-y-[-15px] hover:rotate-2 perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 z-10" />
            <img src="/purple-luxury-showroom.png" alt="Luxury car showroom" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default About
