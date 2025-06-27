"use client"

import { useState, useEffect } from "react"
import SynthwaveBackground from "@/components/synthwave-background"

interface CompletionScreenProps {
  onContinue: () => void
}

interface Confetti {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rotation: number
  rotationSpeed: number
  size: number
}

export default function CompletionScreen({ onContinue }: CompletionScreenProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [discoBallVisible, setDiscoBallVisible] = useState(false)
  const [discoBallY, setDiscoBallY] = useState(-100)
  const [discoBallRotation, setDiscoBallRotation] = useState(0)

  const confettiColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
  ]

  const createConfettiBurst = (side: "left" | "right" | "both") => {
    const newConfetti: Confetti[] = []
    const burstCount = 25

    const createBurst = (startX: number, startY: number) => {
      for (let i = 0; i < burstCount; i++) {
        newConfetti.push({
          id: Math.random(),
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 8 + (startX < window.innerWidth / 2 ? 3 : -3), // Spread outward
          vy: Math.random() * -8 - 4, // Upward burst
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          size: Math.random() * 6 + 3,
        })
      }
    }

    // Bottom corner bursts
    if (side === "left" || side === "both") {
      createBurst(80, window.innerHeight - 80)
    }
    if (side === "right" || side === "both") {
      createBurst(window.innerWidth - 80, window.innerHeight - 80)
    }

    setConfetti((prev) => [...prev, ...newConfetti])

    // Animate confetti with smooth physics
    const animateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vx: piece.vx * 0.99, // Air resistance
            vy: piece.vy + 0.3, // Gravity
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter((piece) => piece.y < window.innerHeight + 100 && piece.x > -50 && piece.x < window.innerWidth + 50),
      )
    }

    const interval = setInterval(animateConfetti, 16)
    setTimeout(() => clearInterval(interval), 8000)
  }

  const createRainConfetti = () => {
    const rainConfetti: Confetti[] = []
    const rainCount = 40

    for (let i = 0; i < rainCount; i++) {
      rainConfetti.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100, // Start above screen
        vx: (Math.random() - 0.5) * 2, // Slight horizontal drift
        vy: Math.random() * 3 + 2, // Gentle fall
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        size: Math.random() * 5 + 2,
      })
    }

    setConfetti((prev) => [...prev, ...rainConfetti])

    const animateRain = () => {
      setConfetti((prev) =>
        prev
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter((piece) => piece.y < window.innerHeight + 50),
      )
    }

    const interval = setInterval(animateRain, 16)
    setTimeout(() => clearInterval(interval), 6000)
  }

  useEffect(() => {
    // Start disco ball animation
    setTimeout(() => {
      setDiscoBallVisible(true)
      animateDiscoBall()
    }, 500)

    // Initial burst from corners
    setTimeout(() => {
      createConfettiBurst("both")
    }, 1200)

    // Start raining confetti
    setTimeout(() => {
      createRainConfetti()
    }, 2500)

    // Additional rain bursts
    setTimeout(() => createRainConfetti(), 4000)
    setTimeout(() => createRainConfetti(), 5500)

    // Auto-continue after celebration
    setTimeout(() => {
      onContinue()
    }, 7000)
  }, [onContinue])

  const animateDiscoBall = () => {
    let y = -200
    let rotation = 0
    const animate = () => {
      y += 2
      rotation += 1
      setDiscoBallY(y)
      setDiscoBallRotation(rotation)
      if (y < 50) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SynthwaveBackground />
      <div className="vignette" />

      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute pointer-events-none"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}

      {discoBallVisible && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 ease-out"
          style={{ top: discoBallY }}
        >
          <div className="w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-600 mx-auto mb-1 shadow-lg"></div>
          <div className="relative w-24 h-24 mx-auto perspective-1000">
            <div
              className="w-full h-full rounded-full relative preserve-3d shadow-2xl"
              style={{
                transform: `rotateY(${discoBallRotation}deg) rotateX(${discoBallRotation * 0.3}deg)`,
                background: "radial-gradient(circle at 30% 30%, #ffffff, #c0c0c0, #808080)",
                boxShadow: "0 0 30px rgba(255,255,255,0.3), inset -10px -10px 20px rgba(0,0,0,0.3)",
              }}
            >
              {Array.from({ length: 100 }).map((_, i) => {
                const row = Math.floor(i / 10)
                const col = i % 10
                const angle = (col / 10) * 360
                const tilt = (row / 10) * 180 - 90

                return (
                  <div
                    key={i}
                    className="absolute border border-gray-400"
                    style={{
                      width: "8%",
                      height: "8%",
                      left: `${45 + Math.cos((angle * Math.PI) / 180) * 20}%`,
                      top: `${45 + Math.sin((tilt * Math.PI) / 180) * 20}%`,
                      background:
                        Math.random() > 0.5
                          ? "linear-gradient(45deg, #ffffff 0%, #f0f0f0 50%, #d0d0d0 100%)"
                          : "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 50%, #a0a0a0 100%)",
                      transform: `rotate(${angle}deg)`,
                      borderRadius: "1px",
                      opacity: 0.9,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 text-white text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 tracking-tighter">Are you human?</h1>
            <p className="text-white/50 text-lg">Or are you dancer?</p>
          </div>

          <div className="mb-12">
            <div className="mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-green-400 mb-3 tracking-tight">
                Verification
                <br />
                Completed!
              </h2>
            </div>
            <p className="text-lg text-white/80 font-light">You passed—you're a human dancer!</p>
          </div>

          <div className="flex justify-between items-center text-white/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="hover:text-white transition-all duration-300 cursor-pointer hover:animate-spin-reverse"
              viewBox="0 0 16 16"
            >
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>

            <span className="text-sm">Dance CAPTCHA</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="url(#completion-shield-gradient)"
              viewBox="0 0 16 16"
            >
              <defs>
                <linearGradient id="completion-shield-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
              </defs>
              <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.5.5 0 0 0 .101.025.6.6 0 0 0 .1-.025c.076-.023.174-.06.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328.39c-.95-1.73-2.6-2.956-4.123-3.299A61 61 0 0 0 8 1a61 61 0 0 0-2.662.59" />
              <path
                fill="white"
                d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
