function ChatEditPen(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <g
        stroke="#DFE2E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        clipPath="url(#a)"
      >
        <path
          d="m15.141 1.908-12 12.009-1.475 4.416 4.417-1.475 12.008-12a.83.83 0 0 0 0-1.175l-1.775-1.775a.83.83 0 0 0-1.175 0Z"
          clipRule="evenodd"
        />
        <path d="m16.024 6.925-2.95-2.95 2.059-2.058a.83.83 0 0 1 1.175 0l1.775 1.775a.83.83 0 0 1 0 1.175l-2.059 2.058Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ChatEditPen;
