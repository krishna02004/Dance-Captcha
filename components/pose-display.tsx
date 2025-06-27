"use client"

interface Pose {
  name: string
  description: string
  difficulty: string
}

interface PoseDisplayProps {
  pose: Pose
  holdTimer?: number
}

export default function PoseDisplay({ pose, holdTimer = 3 }: PoseDisplayProps) {
  const renderPoseIllustration = () => {
    const svgProps = {
      className: "w-24 h-32",
      viewBox: "0 0 50 75",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round" as const,
      fill: "none",
    }

    switch (pose.name) {
      case "Saturday Night Fever":
        return (
          <svg {...svgProps}>
            <circle cx="25" cy="15" r="7" />
            <line x1="25" y1="22" x2="25" y2="45" />
            <line x1="25" y1="45" x2="15" y2="65" />
            <line x1="25" y1="45" x2="35" y2="65" />
            <line x1="25" y1="30" x2="45" y2="10" />
            <line x1="25" y1="30" x2="10" y2="40" />
          </svg>
        )

      case "Single Ladies":
        return (
          <svg {...svgProps}>
            <circle cx="25" cy="15" r="7" />
            <line x1="25" y1="22" x2="25" y2="45" />
            <line x1="25" y1="45" x2="15" y2="65" />
            <line x1="25" y1="45" x2="35" y2="65" />
            <polyline points="25,30 40,35 35,45" />
            <line x1="25" y1="30" x2="25" y2="10" />
            <circle cx="25" cy="10" r="3" fill="currentColor" />
          </svg>
        )

      case "Crossed Arms":
        return (
          <svg {...svgProps}>
            <circle cx="25" cy="15" r="7" />
            <line x1="25" y1="22" x2="25" y2="45" />
            <line x1="25" y1="45" x2="15" y2="65" />
            <line x1="25" y1="45" x2="35" y2="65" />
            <line x1="15" y1="35" x2="35" y2="35" />
          </svg>
        )

      default:
        return <div className="text-6xl text-green-400">🕺</div>
    }
  }

  const isHolding = holdTimer < 3

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-green-400">
      <div className="text-center mb-8">
        <div className="text-white/60 text-sm mb-2">Target Pose:</div>
        <h2 className="text-2xl font-bold text-white mb-2">{pose.name}</h2>
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            pose.difficulty === "Easy"
              ? "bg-green-500/20 text-green-400"
              : pose.difficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
          }`}
        >
          {pose.difficulty}
        </div>
      </div>

      <div className={`mb-8 transition-all duration-300 ${isHolding ? "scale-110" : "scale-100"}`}>
        {renderPoseIllustration()}
      </div>

      <div className="text-center">
        <p className="text-white/70 text-sm max-w-xs">{pose.description}</p>
      </div>

      <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="text-white/60 text-xs mb-2">
          {isHolding ? `Hold for ${holdTimer} more seconds` : "Match the pose to start timer"}
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${
              isHolding
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-gray-500 to-gray-600"
            }`}
            style={{ width: isHolding ? `${((3 - holdTimer) / 3) * 100}%` : "0%" }}
          ></div>
        </div>
      </div>
    </div>
  )
}
