import React, { ComponentProps } from "react";

const PeoplesIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="24"
      {...props}
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 19C11.9998 17.16 10.9998 15.54 9.50977 14.67C10.7798 13.04 12.7698 12 14.9998 12C18.8698 12 21.9998 15.13 21.9998 19C21.9998 19 16.1398 19 11.9998 19Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12C16.933 12 18.5 10.433 18.5 8.5C18.5 6.567 16.933 5 15 5C13.067 5 11.5 6.567 11.5 8.5C11.5 10.433 13.067 12 15 12Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14C4.24 14 2 16.24 2 19C2.01 19 12 19 12 19C12 16.24 9.76 14 7 14Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14C8.38071 14 9.5 12.8807 9.5 11.5C9.5 10.1193 8.38071 9 7 9C5.61929 9 4.5 10.1193 4.5 11.5C4.5 12.8807 5.61929 14 7 14Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PeoplesIcon;
