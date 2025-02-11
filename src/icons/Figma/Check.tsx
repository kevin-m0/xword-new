import React from "react";

export default function Check(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={8}
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M5.47 4.238a1.946 1.946 0 0 1-2.68.021l-.744-.696A.903.903 0 0 0 .8 4.872l1.386 1.343a2.825 2.825 0 0 0 3.963-.031l4.277-4.276A.88.88 0 0 0 9.192.65L5.47 4.238Z"
      />
    </svg>
  );
}
