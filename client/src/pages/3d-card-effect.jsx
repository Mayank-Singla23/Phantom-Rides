"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

export const Card3D = ({ children, className = "", intensity = 10, border = true, shine = true }) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = (e.clientX - rect.left) / width - 0.5
    const mouseY = (e.clientY - rect.top) / height - 0.5

    setRotateY(mouseX * intensity)
    setRotateX(-mouseY * intensity)
    setMouseX(e.clientX - rect.left)
    setMouseY(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        style={{
          transform: "translateZ(0)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>

      {shine && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.15), transparent 80%)`,
          }}
        />
      )}

      {border && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            borderRadius: "inherit",
            boxShadow: "inset 0 0 0 1px rgba(152, 223, 255, 0.1)",
          }}
        />
      )}
    </motion.div>
  )
}

export default Card3D
