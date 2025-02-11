import React from "react";

const DocumentIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      width="12"
      height="3"
      viewBox="0 0 12 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.59375 1.5H10.4173"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DocumentIcon;
