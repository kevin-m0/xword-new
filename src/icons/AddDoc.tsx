function AddDoc(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      height={15}
      fill="none"
      {...props}
    >
      <g
        stroke="#fff"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.125}
        clipPath="url(#a)"
      >
        <path
          strokeLinecap="round"
          d="M12.166 7.834a2.918 2.918 0 0 0-4.083 4.083H2.249a.585.585 0 0 1-.583-.583V2c0-.32.263-.583.583-.583h7.345c.151 0 .303.064.408.17l1.995 1.994c.105.105.169.257.169.408v3.845ZM7.558 9.583H4M4 6.667h5.833M4 3.75h2.917"
        />
        <path
          strokeLinecap="round"
          d="M9.25 1.417v2.917h2.917v-.345a.588.588 0 0 0-.17-.408l-1.995-1.995a.588.588 0 0 0-.408-.169H9.25ZM10.417 13.083a2.917 2.917 0 1 0 0-5.833 2.917 2.917 0 0 0 0 5.833Z"
        />
        <path d="M10.418 8.416v3.5M12.166 10.166h-3.5" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M.5.25h14v14H.5z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default AddDoc;
