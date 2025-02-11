function History(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={18}
      fill="none"
      {...props}
    >
      <g
        stroke="#22C55E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        clipPath="url(#a)"
      >
        <path d="M12.667 1.5H3.334c-1.133 0-2 .975-2 2.25v10.5c0 1.275.867 2.25 2 2.25h9.333c1.134 0 2-.975 2-2.25V3.75c0-1.275-.866-2.25-2-2.25Z" />
        <path d="M6.667 4.5H4v9h2.667v-9ZM9.334 13.5h1.333M9.334 10.5h2.667M9.334 7.5h1.333M9.334 4.5h2.667"  />
      </g>
      <defs>
        <clipPath id="a">
          <path d="M0 0h16v18H0z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default History;
