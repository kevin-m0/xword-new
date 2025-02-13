import React from "react";

export default function ChevronDown(props: React.ComponentProps<"svg">) {
	return (
		<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="none"
		viewBox="0 0 24 24"
		{...props}
	  >
		<path
		  fill="#fff"
		  fillRule="evenodd"
		  d="M4.242 7.744a.814.814 0 011.164.002l7.177 7.326a.846.846 0 01-.003 1.184.811.811 0 01-1.163-.002L4.241 8.926a.847.847 0 010-1.183zm14.35.002a.814.814 0 011.165-.002.847.847 0 01.003 1.184l-4.765 4.865a.813.813 0 01-1.163.002.847.847 0 01-.004-1.183l4.765-4.866z"
		  clipRule="evenodd"
		></path>
	  </svg>
	);
}
