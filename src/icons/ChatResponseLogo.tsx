function ChatResponseLogo(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      fill="none"
      {...props}
    >
      <rect
        width={35}
        height={35}
        x={0.5}
        y={0.5}
        fill="#fff"
        fillOpacity={0.07}
        rx={17.5}
      />
      <rect
        width={35}
        height={35}
        x={0.5}
        y={0.5}
        fill="url(#a)"
        rx={17.5}
        style={{
          mixBlendMode: "overlay",
        }}
      />
      <rect width={35} height={35} x={0.5} y={0.5} stroke="#fff" rx={17.5} />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M18.667 20.667h-1.333V24h1.333v-3.333ZM14.666 24h6.667"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M24.334 20.667H11.667a.33.33 0 0 1-.333-.334v-8a.33.33 0 0 1 .333-.333h12.667a.33.33 0 0 1 .333.333v8a.33.33 0 0 1-.333.334Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1={13.613}
          x2={29.698}
          y1={24.97}
          y2={2.188}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ChatResponseLogo;
