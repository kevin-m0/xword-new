import React from "react";

export default function CenterAlign(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_749_8552)">
        <path
          d="M4.5 0H19.5V1.5H4.5V0ZM7.5 4.5H16.5V6H7.5V4.5ZM4.5 9H19.5V10.5H4.5V9ZM7.5 13.5H16.5V15H7.5V13.5Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_749_8552"
          x="0.5"
          y="0"
          width="23"
          height="23"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_749_8552"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_749_8552"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
