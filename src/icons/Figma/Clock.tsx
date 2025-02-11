import React from "react";

export default function Clock(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 6C3.66667 3.62667 5.38667 2 8 2C8.96667 2 9.88667 2.23333 10.6933 2.64C12.6533 3.62667 14 5.65333 14 8C14 11.3133 11.3133 14 8 14C5.65333 14 3.62667 12.6533 2.64 10.6933"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33333 6.00008H3.78H2V4.22008V2.66675"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4.66675V8.66675"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.66675H11.3333"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99935 8.99992C8.18344 8.99992 8.33268 8.85068 8.33268 8.66659C8.33268 8.48249 8.18344 8.33325 7.99935 8.33325C7.81525 8.33325 7.66602 8.48249 7.66602 8.66659C7.66602 8.85068 7.81525 8.99992 7.99935 8.99992Z"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
