"use client"

import type React from "react"
import { useEffect, useState } from "react"
import SynthwaveBackground from "@/components/synthwave-background"
import DanceChallengeScreen from "@/components/dance-challenge-screen"

export default function Home() {
  const [isChecked, setIsChecked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showDanceChallenge, setShowDanceChallenge] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isChecked) {
      createParticleExplosion(e.clientX, e.clientY)
      setTimeout(() => {
        setShowDanceChallenge(true)
      }, 500)
    }
  }

  const createParticleExplosion = (x: number, y: number) => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = x + "px"
      particle.style.top = y + "px"
      particle.style.width = Math.random() * 8 + 4 + "px"
      particle.style.height = particle.style.width

      document.body.appendChild(particle)

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 800)
    }
  }

  // 🎯 Dance Challenge Screen
  if (showDanceChallenge) {
    return <DanceChallengeScreen onComplete={() => setShowWelcome(true)} />
  }

  // 🎯 Welcome/Success Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <SynthwaveBackground />
        <div className="vignette" />
        <div className="text-center relative z-10">
          <div className="text-white text-5xl font-bold animate-pulse tracking-tighter mb-8">Welcome Human!</div>
          <div className="text-white/70 text-xl mb-8">You've successfully proven you're not a robot 🎉</div>
          <button
            onClick={() => {
              setShowWelcome(false)
              setShowDanceChallenge(false)
              setIsChecked(false)
            }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // 🎯 Initial CAPTCHA Screen
  return (
    <div className="min-h-screen relative">
      <SynthwaveBackground />
      <div className="vignette" />

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div
          className={`w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 text-white text-center transition-all duration-500 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h1 className="text-5xl font-bold mb-2 tracking-tighter">Are you human?</h1>
          <p className="text-white/50 mb-10">Or are you dancer?</p>

          <label className="custom-checkbox flex items-center justify-center gap-4 text-lg cursor-pointer mb-10">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="hidden"
            />
            <span
              className={`checkmark w-[22px] h-[22px] border-2 rounded-md inline-block relative cursor-pointer transition-all duration-300 ${
                isChecked ? "bg-rose-500 border-rose-500 scale-110" : "bg-black/20 border-white/20"
              }`}
            >
              {isChecked && (
                <span className="absolute left-[7px] top-[2px] w-[6px] h-[12px] border-solid border-white border-r-[3px] border-b-[3px] transform rotate-45" />
              )}
            </span>
            <span className="font-light">I am human (and ready to dance)</span>
          </label>

          <button
            onClick={handleButtonClick}
            disabled={!isChecked}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 shadow-lg hover:shadow-violet-500/20 relative overflow-hidden"
          >
            DANCE CAPTCHA
          </button>

          <div className="flex justify-between items-center mt-8 text-white/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="hover:text-white transition-all duration-300 cursor-pointer hover:font-bold hover:animate-spin-reverse"
              viewBox="0 0 16 16"
            >
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              className="hover:text-white transition-colors cursor-pointer shield-icon"
              viewBox="0 0 16 16"
            >
              <defs>
                <linearGradient id="shield-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
              </defs>
              <path
                className="shield-body"
                fill="currentColor"
                d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.5.5 0 0 0 .101.025.6.6 0 0 0 .1-.025c.076-.023.174-.06.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.95-1.73-2.6-2.956-4.123-3.299A61 61 0 0 0 8 1a61 61 0 0 0-2.662.59"
              />
              <path
                className="shield-fill"
                d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.5.5 0 0 0 .101.025.6.6 0 0 0 .1-.025c.076-.023.174-.06.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.95-1.73-2.6-2.956-4.123-3.299A61 61 0 0 0 8 1a61 61 0 0 0-2.662.59"
              />
              <path
                className="shield-tick"
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
