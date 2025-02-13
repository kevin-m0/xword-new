import React from "react";

const EditFilterIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g>
      <g>
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M9.057 17.24c0 .399.311.723.695.723.383 0 .694-.324.694-.722v-3.586a.738.738 0 00-.188-.494L4.532 6.793a.561.561 0 01-.142-.374V4.995c0-.3.236-.547.526-.547h2.78c.383 0 .695-.324.695-.724 0-.399-.312-.724-.695-.724h-2.78C3.86 3 3 3.895 3 4.995v1.424c0 .51.184.993.517 1.365l5.54 6.157v3.3zm.143 3.347c.118.26.37.413.631.413a.674.674 0 00.293-.067l3.888-1.863a.717.717 0 00.402-.648v-4.58l6.01-6.081c.366-.368.576-.882.576-1.409V4.974C21 3.886 20.14 3 19.083 3h-8.009a.706.706 0 00-.695.716c0 .396.312.716.695.716h8.009c.29 0 .527.244.527.542v1.378a.55.55 0 01-.158.386l-6.22 6.293a.727.727 0 00-.208.51v4.424l-3.486 1.67a.727.727 0 00-.338.951z"
          clipRule="evenodd"
        ></path>
      </g>
    </g>
  </svg>
  );
};

export default EditFilterIcon;
