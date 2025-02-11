function ChatPromptIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.168 18.334V1.666M12.5 13.334V6.667M8.332 15.834V4.167M16.668 11.666V8.333"
      />
    </svg>
  );
}

export default ChatPromptIcon;
