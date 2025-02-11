import React from "react";

export default function Preview(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6886 18.3332H4.61463C3.183 18.3332 2.02734 17.2165 2.02734 15.8332V4.1665C2.02734 2.78317 3.183 1.6665 4.61463 1.6665H16.6886C18.1202 1.6665 19.2759 2.78317 19.2759 4.1665V15.8332C19.2759 17.2165 18.1202 18.3332 16.6886 18.3332Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0986 6.6665L7.19922 13.3332"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0986 13.3332V6.6665H7.19922"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
