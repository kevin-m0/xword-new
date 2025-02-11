import React from "react";

const FolderOpenIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      width="26"
      height="27"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5807 11.3335H5.41406L2.16406 22.1668V7.00016V4.8335H10.8307L12.9974 7.00016H20.5807V11.3335Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.41406 11.3335H23.8307L20.5807 22.1668H2.16406L5.41406 11.3335Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FolderOpenIcon;
