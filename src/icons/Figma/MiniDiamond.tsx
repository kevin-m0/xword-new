function MiniDiamond(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={14}
      fill="none"
      {...props}
    >
      <g
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        clipPath="url(#a)"
      >
        <path d="M3.354 1.167 8 12.833M12.647 1.167 8 12.833M4.746 4.667 8 1.167M11.253 4.667 8 1.167M12.647 1.167H3.354l-2.02 3.5h13.333l-2.02-3.5ZM8 12.833l6.667-8.166H1.334l6.667 8.166Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h16v14H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MiniDiamond;
