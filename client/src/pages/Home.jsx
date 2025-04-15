"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

const Home = () => {
  // Luxury car products for the parallax effect
  const products = [
    {
      title: "Mercedes AMG GT",
      thumbnail: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Aston Martin DB11",
      thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Bentley Continental GT",
      thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Porsche 911 Turbo S",
      thumbnail: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Ferrari Roma",
      thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Lamborghini Huracan",
      thumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "McLaren 720S",
      thumbnail: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Rolls Royce Ghost",
      thumbnail: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "BMW M8 Competition",
      thumbnail: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Audi R8",
      thumbnail: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Maserati MC20",
      thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Lexus LC 500",
      thumbnail: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Jaguar F-Type",
      thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Bugatti Chiron",
      thumbnail: "https://images.unsplash.com/photo-1594502184342-2efc4aa9ea68?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
    {
      title: "Koenigsegg Jesko",
      thumbnail: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80",
      link: "/cars",
    },
  ]

  // Hero Parallax Implementation
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig)

  // Product Card Component
  const ProductCard = ({ product, translate }) => {
    return (
      <motion.div
        style={{
          x: translate,
        }}
        whileHover={{
          y: -20,
        }}
        key={product.title}
        className="group/product h-96 w-[30rem] relative shrink-0"
      >
        <a href={product.link} className="block group-hover/product:shadow-2xl">
          <img
            src={product.thumbnail || "/placeholder.svg"}
            className="object-cover object-center absolute h-full w-full inset-0 rounded-xl"
            alt={product.title}
          />
        </a>
        <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none rounded-xl"></div>
        <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white text-xl font-bold">
          {product.title}
        </h2>
      </motion.div>
    )
  }

  // Header Component
  const Header = () => {
    return (
      <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
        <h1 className="text-2xl md:text-7xl font-bold text-white">
          Experience{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">Luxury</span>{" "}
          <br /> Like Never Before
        </h1>
        <p className="max-w-2xl text-base md:text-xl mt-8 text-gray-300">
          Discover our exclusive collection of premium vehicles crafted for those who demand nothing but the finest. Our
          luxury cars combine performance, elegance, and cutting-edge technology.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 
                    hover:to-cyan-700 px-8 py-4 rounded-full text-white font-semibold 
                    transition-all shadow-lg shadow-blue-900/50 mt-8"
        >
          Explore Collection
        </motion.button>
      </div>
    )
  }

  return (
    <div className="bg-black text-white">
      {/* Hero Parallax Section */}
      <div
        ref={ref}
        className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      >
        <Header />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          className=""
        >
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
            {firstRow.map((product) => (
              <ProductCard product={product} translate={translateX} key={product.title} />
            ))}
          </motion.div>
          <motion.div className="flex flex-row mb-20 space-x-20">
            {secondRow.map((product) => (
              <ProductCard product={product} translate={translateXReverse} key={product.title} />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
            {thirdRow.map((product) => (
              <ProductCard product={product} translate={translateX} key={product.title} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-24 bg-black">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent"
        >
          Our Collections
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Luxury Sedans",
              description: "Experience ultimate comfort with our premium sedan collection",
              icon: "🚗",
            },
            {
              title: "Sport Cars",
              description: "Feel the adrenaline with high-performance sports cars",
              icon: "🏎️",
            },
            {
              title: "Executive SUVs",
              description: "Commanding presence with unmatched versatility",
              icon: "🚙",
            },
          ].map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -15, scale: 1.03, rotateY: 5 }}
              className="bg-gray-900 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 border border-blue-900/30 shadow-blue-900/20 perspective-1000"
            >
              <div className="p-8">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{category.title}</h3>
                <p className="text-gray-400 mb-6">{category.description}</p>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-blue-400 font-semibold hover:text-cyan-500 
                            transition-colors flex items-center"
                >
                  View Collection
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Visit Our Showroom</h3>
              <address className="not-italic">
                <p className="mb-2">Sector 17,</p>
                <p className="mb-2">Chandigarh, India</p>
                <p className="mb-2">160017</p>
              </address>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-white mb-4">Contact</h3>
              <p className="mb-2">Email: info@luxurycars.com</p>
              <p className="mb-2">Phone: +91 1234567890</p>
            </div>
          </div>
          <div className="border-t border-blue-900/20 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Luxury Cars. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
