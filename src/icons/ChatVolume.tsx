function ChatVolume(props: React.ComponentProps<"svg">) {
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
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M5.001 6.667H1.668v6.666h3.333l5 4.167v-15l-5 4.167ZM13.332 16.459a6.672 6.672 0 0 0 0-12.917"
      />
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M13.332 12.883c1-.575 1.667-1.65 1.667-2.883a3.317 3.317 0 0 0-1.667-2.884"
      />
    </svg>
  );
}

export default ChatVolume;
