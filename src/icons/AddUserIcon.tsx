function AddUserIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={19}
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
        <path
          strokeWidth={1.5}
          d="M15 16.25c-2.655.6-4.988.75-6.75.75-2.737 0-5.04-.367-6.75-.75 0-3.315 3.022-6 6.75-6 3.727 0 6.75 2.685 6.75 6ZM8.25 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
        <path d="M12.75 3.5h4.5M15 1.25v4.5" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 .5h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default AddUserIcon;
