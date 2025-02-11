import { ComponentProps } from "react";

const IdeaIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.0007 12.5V15.8333"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.038 19C14.1577 19 12.1947 14.7664 13.434 13.2795C14.8435 11.5883 16 10.193 16 8.04152C16 4.6511 13.4679 2 10.038 2C6.60809 2 4 4.69074 4 8.08115C4 10.2699 5.30836 11.5776 6.73065 13.3358C7.89517 14.7753 5.91829 19 10.038 19Z"
        stroke="white"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 16.5C6 16.2239 6.22386 16 6.5 16H13.5C13.7761 16 14 16.2239 14 16.5V16.5C14 16.7761 13.7761 17 13.5 17H6.5C6.22386 17 6 16.7761 6 16.5V16.5Z"
        stroke="white"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6C9.44773 6 9.00001 6.44772 9.00001 7C9.00001 7.55228 9.44773 8 10 8Z"
        stroke="white"
        strokeWidth="0.8"
      />
      <path
        d="M10 5.85714V5M9.17411 6.19196L8.49802 5.50229M8.85714 7H8M9.17411 7.82589L8.57143 8.42857M10 8.14286V9M10.8259 7.82589L11.4911 8.49107M11.1429 7H12M10.8259 6.19196L11.4223 5.58353"
        stroke="white"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IdeaIcon;
