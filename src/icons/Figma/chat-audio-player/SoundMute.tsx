function SoundMute(props: React.ComponentProps<"svg">) {
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
        d="M6 8H2v8h4l6 5V3L6 8ZM16 9l6 6M22 9l-6 6"
      />
    </svg>
  );
}

export default SoundMute;
