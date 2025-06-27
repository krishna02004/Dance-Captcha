"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface DancePose {
  name: string
  description: string
}

interface UseDanceChallengeProps {
  onComplete: () => void
}

interface UseDanceChallengeReturn {
  currentPose: DancePose
  currentPoseNumber: number
  totalPoses: number
  progress: number
  handlePoseMatch: (isMatching: boolean) => void
  holdTimer: number
}

const DANCE_POSES: DancePose[] = [
  {
    name: "Saturday Night Fever",
    description: "Point to the sky like John Travolta!",
  },
  {
    name: "Crossed Arms",
    description: "Cross your arms in front of your chest",
  },
  {
    name: "Single Ladies",
    description: "Put your hand on your hip",
  },
]

export function useDanceChallenge({ onComplete }: UseDanceChallengeProps): UseDanceChallengeReturn {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0)
  const [holdTimer, setHoldTimer] = useState(3)
  const [isHolding, setIsHolding] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentPose = DANCE_POSES[currentPoseIndex]
  const currentPoseNumber = currentPoseIndex + 1
  const totalPoses = DANCE_POSES.length

  // Calculate progress: (completed poses + current pose progress) / total poses * 100
  const currentPoseProgress = isHolding ? (3 - holdTimer) / 3 : 0
  const progress = ((currentPoseIndex + currentPoseProgress) / totalPoses) * 100

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Handle pose matching
  const handlePoseMatch = useCallback(
    (isMatching: boolean) => {
      if (isMatching) {
        if (!isHolding) {
          // Start holding
          setIsHolding(true)
          setHoldTimer(3) // Reset timer to 3 when holding starts

          // Start countdown timer
          timerRef.current = setInterval(() => {
            setHoldTimer((prev) => {
              if (prev <= 1) {
                // Timer completed - advance to next pose or complete
                clearInterval(timerRef.current!)
                timerRef.current = null
                setIsHolding(false)

                if (currentPoseIndex < DANCE_POSES.length - 1) {
                  // Move to next pose
                  setCurrentPoseIndex((prevIndex) => prevIndex + 1)
                  setHoldTimer(3) // Reset for next pose
                } else {
                  // All poses completed
                  onComplete()
                }
                return 3 // Reset for next cycle or completion
              }
              return prev - 1
            })
          }, 1000)
        }
      } else {
        // Pose not matching - reset timer
        if (isHolding) {
          clearTimer()
          setIsHolding(false)
          setHoldTimer(3) // Reset to 3 when not holding
        }
      }
    },
    [isHolding, currentPoseIndex, onComplete, clearTimer],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    currentPose,
    currentPoseNumber,
    totalPoses,
    progress,
    handlePoseMatch,
    holdTimer,
  }
}
