function MessageIcon({ featuredIcon, ...props }: React.ComponentProps<"svg"> & { featuredIcon?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
      {...props}
    >
      <circle cx={16} cy={16} r={16} fill={featuredIcon ? "#000" : "#fff"} fillOpacity={0.07} />
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
        stroke={featuredIcon ? "#000" : "#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M19.333 13.5h-3.667c-.275 0-.5.225-.5.5v3.667h-1.667L10.166 21v-3.333H8.333A.669.669 0 0 1 7.666 17v-7c0-.367.3-.666.667-.666h10.333c.367 0 .667.3.667.666v3.5Z"
      />
      <path
        stroke={featuredIcon ? "#000" : "#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M24.333 14v5.667c0 .275-.225.5-.5.5h-2v2.5l-2.5-2.5h-3.667a.501.501 0 0 1-.5-.5V14c0-.275.225-.5.5-.5h8.167c.275 0 .5.225.5.5Z"
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
          <stop stopColor={featuredIcon ? "#000" : "#fff"} stopOpacity={0} />
          <stop offset={1} stopColor={featuredIcon ? "#000" : "#fff"} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default MessageIcon;
