"use client"

import { useEffect, useState } from "react"

interface Pose {
  name: string
  description: string
  icon: string
}

interface PoseTargetProps {
  pose: Pose
}

export default function PoseTarget({ pose }: PoseTargetProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [pose])

  const renderPoseVisual = () => {
    const baseStickFigure = "relative w-32 h-40 mx-auto"

    switch (pose.name) {
      case "Arms Up":
        return (
          <div className={baseStickFigure}>
            {/* Head */}
            <div className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2"></div>
            {/* Body */}
            <div className="absolute top-8 left-1/2 w-1 h-16 bg-white transform -translate-x-1/2"></div>
            {/* Arms Up */}
            <div className="absolute top-10 left-1/2 w-12 h-1 bg-white transform -translate-x-1/2 -rotate-45 origin-left"></div>
            <div className="absolute top-10 left-1/2 w-12 h-1 bg-white transform -translate-x-1/2 rotate-45 origin-right"></div>
            {/* Legs */}
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 rotate-12 origin-left"></div>
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 -rotate-12 origin-right"></div>
          </div>
        )

      case "T-Pose":
        return (
          <div className={baseStickFigure}>
            {/* Head */}
            <div className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2"></div>
            {/* Body */}
            <div className="absolute top-8 left-1/2 w-1 h-16 bg-white transform -translate-x-1/2"></div>
            {/* Arms Horizontal */}
            <div className="absolute top-12 left-1/2 w-24 h-1 bg-white transform -translate-x-1/2"></div>
            {/* Legs */}
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 rotate-12 origin-left"></div>
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 -rotate-12 origin-right"></div>
          </div>
        )

      case "Victory":
        return (
          <div className={baseStickFigure}>
            {/* Head */}
            <div className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2"></div>
            {/* Body */}
            <div className="absolute top-8 left-1/2 w-1 h-16 bg-white transform -translate-x-1/2"></div>
            {/* Victory Arms */}
            <div className="absolute top-8 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 -rotate-45 origin-left"></div>
            <div className="absolute top-8 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 rotate-45 origin-right"></div>
            {/* V fingers */}
            <div className="absolute top-4 left-8 text-white text-xl">✌️</div>
            <div className="absolute top-4 right-8 text-white text-xl">✌️</div>
            {/* Legs */}
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 rotate-12 origin-left"></div>
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 -rotate-12 origin-right"></div>
          </div>
        )

      case "Wave":
        return (
          <div className={baseStickFigure}>
            {/* Head */}
            <div className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2"></div>
            {/* Body */}
            <div className="absolute top-8 left-1/2 w-1 h-16 bg-white transform -translate-x-1/2"></div>
            {/* Left arm down */}
            <div className="absolute top-12 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 rotate-45 origin-left"></div>
            {/* Right arm waving */}
            <div className="absolute top-10 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 -rotate-12 origin-right"></div>
            <div className="absolute top-6 right-6 text-white text-2xl animate-bounce">👋</div>
            {/* Legs */}
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 rotate-12 origin-left"></div>
            <div className="absolute top-24 left-1/2 w-10 h-1 bg-white transform -translate-x-1/2 -rotate-12 origin-right"></div>
          </div>
        )

      default:
        return <div className="text-6xl">{pose.icon}</div>
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <div className={`transition-all duration-500 ${animate ? "scale-110" : "scale-100"}`}>{renderPoseVisual()}</div>

      <div className="mt-6 text-center">
        <div className="text-white text-2xl font-bold mb-2">{pose.name}</div>
        <div className="text-white/70 text-sm max-w-xs">{pose.description}</div>
      </div>

      {/* Animated guide */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-white/60 text-xs mb-1">Match this pose exactly</div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
