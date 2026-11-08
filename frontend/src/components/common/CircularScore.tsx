import React from 'react';

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtext?: string;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 90,
  strokeWidth = 7,
  label = "Score",
  subtext
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (clampedScore / 100) * circumference;

  // Color dynamics: neon green for high, amber for medium, rose for low
  let strokeColor = "#10b981"; // neon green
  let glowColor = "rgba(16, 185, 129, 0.4)";
  if (score < 60) {
    strokeColor = "#f43f5e"; // rose
    glowColor = "rgba(244, 63, 94, 0.3)";
  } else if (score < 75) {
    strokeColor = "#f59e0b"; // amber
    glowColor = "rgba(245, 158, 11, 0.3)";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1d2432"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle with glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.8s ease-in-out",
              filter: `drop-shadow(0 0 6px ${glowColor})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold tracking-tight text-white font-mono leading-none">
            {score.toFixed(0)}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">/ 100</span>
        </div>
      </div>
      {label && (
        <span className="mt-1 text-xs font-medium text-zinc-400 tracking-wider uppercase text-center">
          {label}
        </span>
      )}
      {subtext && (
        <span className="text-[10px] text-zinc-500 text-center">{subtext}</span>
      )}
    </div>
  );
};

