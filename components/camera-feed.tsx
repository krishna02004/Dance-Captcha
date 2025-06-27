"use client"

import { useState } from "react"
import PoseAnalyzer from "@/components/pose-analyzer"

interface CameraFeedProps {
  videoStream: MediaStream | null
  onPoseDetection: (detected: boolean) => void
  targetPose: string
  poseDetected: boolean
  countdown: number
}

export default function CameraFeed({
  videoStream,
  onPoseDetection,
  targetPose,
  poseDetected,
  countdown,
}: CameraFeedProps) {
  const [lastAccuracy, setLastAccuracy] = useState(0)

  const handlePoseMatch = (isMatch: boolean, accuracy: number) => {
    setLastAccuracy(accuracy)
    // Consider it a match if accuracy > 70%
    onPoseDetection(isMatch && accuracy > 70)
  }

  return (
    <div className="relative w-full h-full">
      <PoseAnalyzer videoStream={videoStream} targetPose={targetPose} onPoseMatch={handlePoseMatch} />

      {poseDetected && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse shadow-lg">
          🎯 Pose Detected! {countdown > 0 && `${countdown}s`}
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-white text-sm font-semibold mb-2">AI Analysis: "{targetPose}"</div>
          <div className="flex items-center gap-2">
            <div className="text-white/70 text-xs">Accuracy:</div>
            <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  lastAccuracy > 70
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : lastAccuracy > 40
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                }`}
                style={{ width: `${Math.min(lastAccuracy, 100)}%` }}
              ></div>
            </div>
            <div className="text-white text-xs font-mono min-w-[3rem]">{lastAccuracy.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
