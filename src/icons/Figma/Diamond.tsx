function Diamond(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M5.867 2.333 14 25.667M22.132 2.333 14 25.667M8.307 9.333l5.693-7M19.693 9.333l-5.693-7M22.132 2.333H5.87l-3.535 7h23.333l-3.535-7ZM14 25.667 25.668 9.333H2.334l11.667 16.334Z"
      />
    </svg>
  );
}

export default Diamond;
