function AttachIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M18.538 7.925 7.925 18.538c-1.95 1.95-1.95 5.112 0 7.075a5.01 5.01 0 0 0 7.075 0L25.613 15"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m11.462 22.075 10.612-10.612c1.95-1.95 1.95-5.113 0-7.075a5.01 5.01 0 0 0-7.075 0L4.387 15"
      />
    </svg>
  );
}

export default AttachIcon;
