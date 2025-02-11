function ChatRepeat(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        stroke="#DFE2E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.5 7.5c-2.083-2.967-4.233-5-7.5-5a7.48 7.48 0 0 0-3.367.8A7.495 7.495 0 0 0 2.5 10a7.5 7.5 0 0 0 7.5 7.5 7.495 7.495 0 0 0 6.7-4.133"
      />
      <path
        stroke="#DFE2E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.334 7.5h4.167V3.333"
      />
    </svg>
  );
}

export default ChatRepeat;
