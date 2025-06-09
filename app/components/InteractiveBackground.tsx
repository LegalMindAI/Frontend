"use client"

import type React from "react"
import { useRef } from "react"
import { useParticles } from "./useParticles"

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  useParticles(canvasRef)
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
}

export default InteractiveBackground
