function AudioAttachIcon({ featuredIcon, ...props }: React.ComponentProps<"svg"> & { featuredIcon?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
      {...props}
    >
      <circle cx={16} cy={16} r={16} fill={featuredIcon ? "black" : "white"} fillOpacity={0.07} />
      <circle
        cx={16}
        cy={16}
        r={16}
        fill="url(#a)"
        style={{
          mixBlendMode: "overlay",
        }}
      />
      <path
        stroke={featuredIcon ? "#000" : "fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M14.333 10.834V22.75c0 .834-.666 1.584-1.583 1.584-1 0-1.75-.75-1.75-1.75v-10.75"
      />
      <path
        stroke={featuredIcon ? "#000" : "fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.2}
        d="M7.666 21.833V11c0-1.834 1.5-3.333 3.333-3.333 1.75 0 3.334 1.5 3.334 3.25v10.916M24.333 11h-6.667M21.833 14.334h-4.167M23.5 21h-5.834M21 17.666h-3.334"
      />
      <defs>
        <linearGradient
          id="a"
          x1={12.1}
          x2={26.398}
          y1={22.196}
          y2={1.945}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor="#000" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default AudioAttachIcon;
