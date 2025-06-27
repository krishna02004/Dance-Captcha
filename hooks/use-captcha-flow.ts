"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type CaptchaPhase = "initial" | "permission" | "preparation" | "challenge" | "complete"

interface UseCaptchaFlowReturn {
  phase: CaptchaPhase
  videoStream: MediaStream | null
  startPermissionFlow: () => void
  completeChallenge: () => void
  resetFlow: () => void
  error: string | null
}

export function useCaptchaFlow(): UseCaptchaFlowReturn {
  const [phase, setPhase] = useState<CaptchaPhase>("initial")
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up stream helper
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      console.log("Cleaning up video stream...")
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setVideoStream(null)
    }
  }, [])

  // Handle camera permission request when phase becomes 'permission'
  useEffect(() => {
    if (phase === "permission") {
      const requestCameraAccess = async () => {
        try {
          setError(null)
          console.log("Requesting camera access...")
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user",
            },
          })

          streamRef.current = stream
          setVideoStream(stream)
          setPhase("preparation")
          console.log("✅ Camera access granted.")
        } catch (err) {
          console.error("❌ Camera permission denied:", err)
          setError("Camera access denied. Please allow camera access to continue.")
          setPhase("initial") // Go back to initial on error
        }
      }

      requestCameraAccess()
    }
  }, [phase])

  // Clean up stream when phase changes away from 'challenge' or on unmount
  useEffect(() => {
    if (phase !== "challenge" && phase !== "preparation") {
      cleanupStream()
    }
  }, [phase, cleanupStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupStream()
    }
  }, [cleanupStream])

  // Control methods
  const startPermissionFlow = useCallback(() => {
    setError(null)
    setPhase("permission")
  }, [])

  const completeChallenge = useCallback(() => {
    setPhase("complete")
    cleanupStream() // Ensure stream is stopped on completion
  }, [cleanupStream])

  const resetFlow = useCallback(() => {
    cleanupStream()
    setError(null)
    setPhase("initial")
  }, [cleanupStream])

  // Auto-transition from preparation to challenge after a delay
  useEffect(() => {
    if (phase === "preparation") {
      const timer = setTimeout(() => {
        setPhase("challenge")
        console.log("Transitioning to challenge phase.")
      }, 2000) // 2 second preparation phase

      return () => clearTimeout(timer)
    }
  }, [phase])

  return {
    phase,
    videoStream,
    startPermissionFlow,
    completeChallenge,
    resetFlow,
    error,
  }
}
