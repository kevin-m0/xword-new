function AIIcon(props: React.ComponentProps<"svg">) {
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
        d="M13.75 2.5c-2.925 0-6.612 2.15-6.55 7.7l-4.65 6.025c-.137.175.025.4.275.4l3.1 1.538c.163 1.15.763 4.5 1.088 6.174.112.526 5.237.125 5.237.125l1.5 3.038M19.1 2.5l-1.276 3.563M27.113 5.925l-4.275 3.2M27.5 15.137l-4.088-.3"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M16.863 19.025c1.475-.75 5.15-4.55 2.937-7.463-1.8-2.362-5.212-2.362-7.012 0-2.213 2.913 1.475 6.7 2.937 7.463.363.175.775.175 1.138 0ZM16.3 14.725v4.438M14.65 22.387h3.288M14.65 19.162h3.288"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M16.25 14.725a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Z"
      />
    </svg>
  );
}

export default AIIcon;
