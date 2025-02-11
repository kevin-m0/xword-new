function VolumeDropdownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={21}
      height={21}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={1.125}
        d="M16.332 4.917s1.667 1.755 1.667 5.833c0 4.079-1.667 5.834-1.667 5.834M14.668 6.933s.833 1.56.833 3.817c0 2.31-.833 3.818-.833 3.818"
      />
      <path
        stroke="#fff"
        strokeLinejoin="round"
        strokeWidth={1.125}
        d="m5.5 7.417 6.667-4.167v15L5.5 14.083V7.417Z"
        clipRule="evenodd"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={1.125}
        d="M3 7.417v6.666"
      />
    </svg>
  );
}

export default VolumeDropdownIcon;
