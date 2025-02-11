function AttachIconChat(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m14.832 6.34-8.49 8.49a4.008 4.008 0 0 0 0 5.66 4.008 4.008 0 0 0 5.66 0l8.49-8.49"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m9.172 17.66 8.49-8.49a4.008 4.008 0 0 0 0-5.66 4.008 4.008 0 0 0-5.66 0L3.512 12"
      />
    </svg>
  );
}

export default AttachIconChat;
