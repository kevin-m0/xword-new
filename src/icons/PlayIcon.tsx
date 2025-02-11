import React, { ComponentProps } from "react";

const PlayIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="17"
      height="19"
      {...props}
      viewBox="0 0 17 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.67578 18.4241C2.09766 18.4241 2.46931 18.2734 2.93136 18.0022L14.7941 11.1417C15.6579 10.6395 16.0195 10.2478 16.0195 9.61494C16.0195 8.98213 15.6579 8.60043 14.7941 8.08815L2.93136 1.22766C2.46931 0.956456 2.09766 0.805786 1.67578 0.805786C0.852121 0.805786 0.269531 1.4386 0.269531 2.43302V16.7969C0.269531 17.8013 0.852121 18.4241 1.67578 18.4241Z"
        fill="white"
      />
    </svg>
  );
};

export default PlayIcon;
