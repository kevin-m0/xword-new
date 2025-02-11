import React, { ComponentProps } from "react";

const InviteIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1202_21751)">
        <path
          d="M13.334 14.0001C10.974 14.5334 8.90065 14.6667 7.33398 14.6667C4.90065 14.6667 2.85398 14.3401 1.33398 14.0001C1.33398 11.0534 4.02065 8.66675 7.33398 8.66675C10.6473 8.66675 13.334 11.0534 13.334 14.0001Z"
          stroke="white"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.33268 6.66658C8.80544 6.66658 9.99935 5.47268 9.99935 3.99992C9.99935 2.52716 8.80544 1.33325 7.33268 1.33325C5.85992 1.33325 4.66602 2.52716 4.66602 3.99992C4.66602 5.47268 5.85992 6.66658 7.33268 6.66658Z"
          stroke="white"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.334 2.66675H15.334"
          stroke="white"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.334 0.666748V4.66675"
          stroke="white"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1202_21751">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InviteIcon;
