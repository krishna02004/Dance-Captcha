"use client"

import { useState } from "react"
import SynthwaveBackground from "@/components/synthwave-background"
import CameraFeed from "@/components/camera-feed"
import PoseDisplay from "@/components/pose-display"
import CompletionScreen from "@/components/completion-screen"
import { useCaptchaFlow } from "@/hooks/use-captcha-flow"
import { useDanceChallenge } from "@/hooks/use-dance-challenge"

interface DanceChallengeScreenProps {
  onComplete: () => void
}

export default function DanceChallengeScreen({ onComplete }: DanceChallengeScreenProps) {
  const [showCompletion, setShowCompletion] = useState(false)

  // 🎯 Hook 1: Camera & Permission Flow
  const { phase, videoStream, startPermissionFlow, completeChallenge, resetFlow, error } = useCaptchaFlow()

  // 🎯 Hook 2: Dance Challenge Logic
  const { currentPose, currentPoseNumber, totalPoses, progress, handlePoseMatch, holdTimer } = useDanceChallenge({
    onComplete: () => {
      setShowCompletion(true)
    },
  })

  // Handle pose detection from CameraFeed
  const handlePoseDetection = (detected: boolean) => {
    handlePoseMatch(detected)
  }

  // Skip challenge for testing/fallback
  const skipChallenge = () => {
    setShowCompletion(true)
  }

  // Show completion screen
  if (showCompletion) {
    return <CompletionScreen onContinue={onComplete} />
  }

  // 🎯 Phase 1: Initial - Ask for camera permission
  if (phase === "initial") {
    return (
      <div className="min-h-screen relative">
        <SynthwaveBackground />
        <div className="vignette" />

        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 text-white text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tighter">Dance Challenge</h1>
            <p className="text-white/70 mb-8">Ready to prove you're human through dance?</p>

            <div className="mb-8">
              <div className="text-6xl mb-4">🕺</div>
              <div className="text-lg font-semibold mb-2">3 Dance Poses</div>
              <div className="text-white/60 text-sm">Hold each pose for 3 seconds</div>
            </div>

            <button
              onClick={startPermissionFlow}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 shadow-lg hover:shadow-violet-500/20"
            >
              🎯 Start Dance Challenge
            </button>

            {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
          </div>
        </div>
      </div>
    )
  }

  // 🎯 Phase 2: Permission - Requesting camera access
  if (phase === "permission") {
    return (
      <div className="min-h-screen relative">
        <SynthwaveBackground />
        <div className="vignette" />

        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 text-white text-center">
            <div className="text-6xl mb-6">📹</div>
            <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
            <p className="text-white/70 mb-6">We need your camera to detect your dance poses</p>

            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-full h-full border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-white/50 text-sm mb-4">Please allow camera access in your browser</p>

            <button
              onClick={resetFlow}
              className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 🎯 Phase 3: Preparation - Loading AI model
  if (phase === "preparation") {
    return (
      <div className="min-h-screen relative">
        <SynthwaveBackground />
        <div className="vignette" />

        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 text-white text-center">
            <h2 className="text-2xl font-bold mb-6">Preparing AI...</h2>

            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-full h-full border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-white/70 mb-4">Loading pose detection model</p>
            <p className="text-white/50 text-sm">This may take a few seconds...</p>
          </div>
        </div>
      </div>
    )
  }

  // 🎯 Phase 4: Challenge - Main dance challenge screen
  if (phase === "challenge") {
    return (
      <div className="min-h-screen relative">
        <SynthwaveBackground />
        <div className="vignette" />

        <div className="min-h-screen flex flex-col relative z-10">
          {/* Header with Progress */}
          <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">Dance Challenge</h1>
                <p className="text-white/60 text-sm">Hold each pose for 3 seconds</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Overall Progress */}
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{Math.round(progress)}%</div>
                  <div className="text-xs text-white/60">Progress</div>
                </div>

                {/* Current Pose */}
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {currentPoseNumber}/{totalPoses}
                  </div>
                  <div className="text-xs text-white/60">Pose</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Content - Camera + Pose Display */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Camera Feed - Left Side */}
            <div className="flex-1 p-4">
              <div className="h-full bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <CameraFeed
                  videoStream={videoStream}
                  onPoseDetection={handlePoseDetection}
                  targetPose={currentPose.name}
                  poseDetected={holdTimer < 3}
                  countdown={holdTimer}
                />
              </div>
            </div>

            {/* Pose Display - Right Side */}
            <div className="flex-1 p-4">
              <div className="h-full bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <PoseDisplay pose={{ ...currentPose, difficulty: "Easy" }} holdTimer={holdTimer} />
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-white/50"
                  viewBox="0 0 16 16"
                >
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
                <span className="text-sm text-white/70">
                  {holdTimer < 3 ? `Hold "${currentPose.name}" for ${holdTimer}s...` : `Match "${currentPose.name}"`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={skipChallenge} className="text-white/50 hover:text-white text-xs transition-colors">
                  Skip Challenge
                </button>
                <button onClick={resetFlow} className="text-white/50 hover:text-white text-xs transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 🎯 Phase 5: Complete - Success screen
  if (phase === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <SynthwaveBackground />
        <div className="vignette" />
        <div className="text-center relative z-10">
          <div className="text-white text-5xl font-bold animate-pulse tracking-tighter mb-8">Challenge Complete!</div>
          <button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 mr-4"
          >
            Continue
          </button>
          <button
            onClick={resetFlow}
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
}
