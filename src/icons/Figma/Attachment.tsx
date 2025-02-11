import React from "react";

export default function Attachment(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.122 4.75488L4.75445 11.1224C3.58445 12.2924 3.58445 14.1899 4.75445 15.3674C5.92445 16.5374 7.82195 16.5374 8.99945 15.3674L15.367 8.99988"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.87781 13.2449L13.2453 6.87738C14.4153 5.70738 14.4153 3.80988 13.2453 2.63238C12.0753 1.46238 10.1778 1.46238 9.00031 2.63238L2.63281 8.99988"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
