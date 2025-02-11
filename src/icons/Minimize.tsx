function Minimize(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M2.666 8a.33.33 0 0 1 .333-.333h10a.33.33 0 0 1 .334.333.33.33 0 0 1-.334.333H3A.33.33 0 0 1 2.666 8Z"
      />
    </svg>
  );
}

export default Minimize;
