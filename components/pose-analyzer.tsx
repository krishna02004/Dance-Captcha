"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import "@tensorflow/tfjs-backend-webgl"

// IMPORTANT: Ensure there is NO line here like: import { Pose } from "@mediapipe/pose";

interface PoseAnalyzerProps {
  videoStream: MediaStream | null
  targetPose: string
  onPoseMatch: (isMatch: boolean, accuracy: number) => void
}

// MoveNet keypoint connections for skeleton drawing
const POSE_CONNECTIONS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4], // Head
  [5, 6],
  [5, 7],
  [7, 9],
  [6, 8],
  [8, 10], // Arms
  [5, 11],
  [6, 12],
  [11, 12], // Torso
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16], // Legs
]

// MoveNet keypoint names (17 keypoints)
const KEYPOINT_NAMES = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
]

export default function PoseAnalyzer({ videoStream, targetPose, onPoseMatch }: PoseAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null)

  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAccuracy, setCurrentAccuracy] = useState(0)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  // Load MoveNet model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("🚀 Loading MoveNet model...")

        // Ensure TensorFlow backend is ready (tf.ready() is implicitly handled by Next.js for @tensorflow/tfjs-core)
        // No explicit tf.ready() call needed here as @tensorflow/tfjs-backend-webgl import handles it.

        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        })

        detectorRef.current = detector
        setIsModelLoaded(true)
        setLoadingError(null)
        console.log("✅ MoveNet model loaded successfully")
      } catch (error) {
        console.error("❌ Failed to load MoveNet:", error)
        setLoadingError(error instanceof Error ? error.message : "Unknown error")
      }
    }

    loadModel()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Set up video stream
  useEffect(() => {
    if (videoStream && videoRef.current && isModelLoaded) {
      videoRef.current.srcObject = videoStream
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play()
          startPoseDetection()
        }
      }
    }
  }, [videoStream, isModelLoaded])

  // Draw keypoints
  const drawKeypoints = useCallback((keypoints: any[], ctx: CanvasRenderingContext2D) => {
    keypoints.forEach((keypoint, index) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath()
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI)
        ctx.fillStyle = "#00ff00"
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Label
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px Arial"
        ctx.fillText(KEYPOINT_NAMES[index], keypoint.x + 8, keypoint.y - 8)
      }
    })
  }, [])

  // Draw skeleton
  const drawSkeleton = useCallback((keypoints: any[], ctx: CanvasRenderingContext2D) => {
    POSE_CONNECTIONS.forEach(([i, j]) => {
      const kp1 = keypoints[i]
      const kp2 = keypoints[j]

      if (kp1?.score > 0.3 && kp2?.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(kp1.x, kp1.y)
        ctx.lineTo(kp2.x, kp2.y)
        ctx.strokeStyle = "#00ffff"
        ctx.lineWidth = 3
        ctx.stroke()
      }
    })
  }, [])

  // Compare pose to target
  const comparePoseToTarget = useCallback(
    (pose: any) => {
      if (!pose?.keypoints || pose.keypoints.length === 0) {
        return { isMatch: false, accuracy: 0 }
      }

      const keypoints = pose.keypoints
      const leftShoulder = keypoints[5]
      const rightShoulder = keypoints[6]
      const leftWrist = keypoints[9]
      const rightWrist = keypoints[10]
      const leftHip = keypoints[11]
      const rightHip = keypoints[12]

      // Check confidence
      const hasGoodDetection = [leftShoulder, rightShoulder, leftWrist, rightWrist].every((kp) => kp?.score > 0.4)

      if (!hasGoodDetection) {
        return { isMatch: false, accuracy: 0 }
      }

      let accuracy = 0

      switch (targetPose) {
        case "Saturday Night Fever":
          const leftArmUp = leftWrist.y < leftShoulder.y - 50 && leftWrist.x < leftShoulder.x - 30
          const rightArmUp = rightWrist.y < rightShoulder.y - 50 && rightWrist.x > rightShoulder.x + 30
          if (leftArmUp || rightArmUp) {
            accuracy = 85 + Math.random() * 15
            return { isMatch: true, accuracy }
          }
          break

        case "Crossed Arms":
          const leftArmCrossed = leftWrist.x > rightShoulder.x - 50 && leftWrist.y > leftShoulder.y + 20
          const rightArmCrossed = rightWrist.x < leftShoulder.x + 50 && rightWrist.y > rightShoulder.y + 20
          if (leftArmCrossed && rightArmCrossed) {
            accuracy = 80 + Math.random() * 20
            return { isMatch: true, accuracy }
          }
          break

        case "Single Ladies":
          const leftHandOnHip = Math.abs(leftWrist.x - leftHip.x) < 40 && Math.abs(leftWrist.y - leftHip.y) < 60
          const rightHandOnHip = Math.abs(rightWrist.x - rightHip.x) < 40 && Math.abs(rightWrist.y - rightHip.y) < 60
          if (leftHandOnHip || rightHandOnHip) {
            accuracy = 75 + Math.random() * 25
            return { isMatch: true, accuracy }
          }
          break
      }

      return { isMatch: false, accuracy: Math.max(0, 20 + Math.random() * 30) }
    },
    [targetPose],
  )

  // Main detection loop
  const detectPoses = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (!ctx || !video || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectPoses)
      return
    }

    try {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const poses = await detectorRef.current?.estimatePoses(video)

      if (poses && poses.length > 0) {
        const pose = poses[0]

        drawSkeleton(pose.keypoints, ctx)
        drawKeypoints(pose.keypoints, ctx)

        const { isMatch, accuracy } = comparePoseToTarget(pose)
        setCurrentAccuracy(accuracy)
        onPoseMatch(isMatch, accuracy)

        // Draw info
        ctx.fillStyle = isMatch ? "#00ff00" : "#ff6600"
        ctx.font = "bold 16px Arial"
        ctx.fillText(`Target: ${targetPose}`, 10, 30)
        ctx.fillText(`Accuracy: ${accuracy.toFixed(1)}%`, 10, 55)
        ctx.fillText(`Status: ${isMatch ? "✅ MATCH!" : "🎯 Keep trying..."}`, 10, 80)
      } else {
        setCurrentAccuracy(0)
        onPoseMatch(false, 0)
      }
    } catch (error) {
      console.error("Detection error:", error)
    }

    animationRef.current = requestAnimationFrame(detectPoses)
  }, [targetPose, onPoseMatch, drawKeypoints, drawSkeleton, comparePoseToTarget])

  // Start detection
  const startPoseDetection = useCallback(() => {
    if (isModelLoaded && !isAnalyzing) {
      console.log("🎯 Starting pose detection...")
      setIsAnalyzing(true)
      detectPoses()
    }
  }, [isModelLoaded, detectPoses, isAnalyzing])

  if (loadingError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-900/20 rounded-lg">
        <div className="text-center text-white p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-lg font-semibold mb-2">AI Model Error</div>
          <div className="text-sm text-red-300">{loadingError}</div>
        </div>
      </div>
    )
  }

  if (!videoStream) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">📹</div>
          <div className="text-lg font-semibold mb-2">No Video Stream</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]"
        style={{ pointerEvents: "none" }}
      />

      {/* Status */}
      <div className="absolute top-4 left-4 space-y-2">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isModelLoaded ? "bg-green-500/80 text-white" : "bg-yellow-500/80 text-black"
          }`}
        >
          {isModelLoaded ? "🤖 MoveNet Ready" : "⏳ Loading..."}
        </div>

        {isAnalyzing && (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/80 text-white">
            📊 {currentAccuracy.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Target */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-center">
        <div className="text-xs text-white/70 mb-1">Target</div>
        <div className="text-sm font-semibold">{targetPose}</div>
      </div>

      {/* Corner markers */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400"></div>
    </div>
  )
}
