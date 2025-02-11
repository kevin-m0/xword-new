import React from "react";

const MovieIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 11V13V15" stroke="white" strokeWidth="1.5" />
      <path d="M12 11V15" stroke="white" strokeWidth="1.5" />
      <path d="M18 11V15" stroke="white" strokeWidth="1.5" />
      <path
        d="M2 11H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V11Z"
        stroke="white"
        strokeWidth="1.5"
      />
      <path d="M2 15H22" stroke="white" strokeWidth="1.5" />
      <path
        d="M2 8.36865C2 7.90221 2.32247 7.49772 2.77718 7.39379L20.7772 3.2795C21.4033 3.1364 22 3.61213 22 4.25436V6.5L2 11V8.36865Z"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default MovieIcon;
