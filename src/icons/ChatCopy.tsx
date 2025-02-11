function ChatCopy(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={20}
      fill="none"
      {...props}
    >
      <path
        stroke="#DFE2E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5.926 5V2.5c0-.458.333-.833.74-.833h8.149c.407 0 .74.375.74.833v11.667c0 .458-.333.833-.74.833h-2.963V5.833c0-.458-.334-.833-.741-.833H5.926Z"
        clipRule="evenodd"
      />
      <path
        stroke="#DFE2E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.111 18.333H2.963c-.407 0-.74-.375-.74-.833V5.833c0-.458.333-.833.74-.833h8.148c.408 0 .741.375.741.833V17.5c0 .458-.333.833-.74.833Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default ChatCopy;
