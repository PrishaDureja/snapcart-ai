"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getScoreColor(score: number) {
  if (score >= 70) return "#10B981"; // green
  if (score >= 40) return "#F59E0B"; // amber
  return "#EF4444";                  // red
}

function getScoreLabel(score: number) {
  if (score >= 70) return "Great Deal";
  if (score >= 50) return "Decent";
  if (score >= 30) return "Risky";
  return "Skip It";
}

export default function ScoreRing({ score, size = 160, strokeWidth = 10 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedDash, setAnimatedDash] = useState(0);
  const raf = useRef<number | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(eased * score));
      setAnimatedDash(eased * (score / 100) * circumference);

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };

    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [score, circumference]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - animatedDash}
            filter="url(#glow)"
            style={{ transition: "stroke 0.3s ease" }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: size * 0.25 + "px",
            color,
            lineHeight: 1,
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}>
            {animatedScore}
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
            / 100
          </span>
        </div>
      </div>

      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        color,
      }}>
        {getScoreLabel(score)}
      </span>
    </div>
  );
}
