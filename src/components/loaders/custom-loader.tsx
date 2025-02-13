"use client";

import { Box } from "lucide-react";
import { useEffect, useState } from "react";

const CustomLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500;

    const interval = setInterval(() => {
      setProgress(
        (prevProgress) => (prevProgress + (10 / duration) * 100) % 100
      );
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div className="relative">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="absolute border-[8px] border-solid flex items-center justify-center border-white/10 rounded-full h-28 w-28">
            <svg
              className="absolute w-32 h-32"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {[...Array(60)].map((_, index) => {
                const isVisible = (progress / 100) * 60 >= index;
                const gradientColors = ["#D782FF", "#00A3FF"];
                return (
                  isVisible && (
                    <line
                      key={index}
                      x1={50 + 45 * Math.cos((2 * Math.PI * index) / 60)}
                      y1={50 + 45 * Math.sin((2 * Math.PI * index) / 60)}
                      x2={50 + 50 * Math.cos((2 * Math.PI * index) / 60)}
                      y2={50 + 50 * Math.sin((2 * Math.PI * index) / 60)}
                      stroke={gradientColors[index % gradientColors.length]}
                      strokeLinecap="round"
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                        strokeOpacity: 0.3,
                      }}
                    />
                  )
                );
              })}
              <circle
                className="stroke-current"
                cx="50"
                cy="50"
                r="40"
                strokeWidth="4"
                fill="none"
                strokeDasharray="258"
                strokeDashoffset={(1 - progress / 100) * 258}
                style={{
                  stroke: "url(#CircleGradient)",
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
              <defs>
                <linearGradient
                  id="CircleGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute border-[9px] border-solid border-white/10 rounded-full h-24 w-24"></div>
          <div className="absolute border-[11px] border-solid border-white/20 rounded-full h-20 w-20"></div>
        </div>
        <div className="bg-white/10 flex justify-center w-24 h-24 rounded-full  items-center z-10">
          <Box />
        </div>
      </div>
    </div>
  );
};

export default CustomLoader;
