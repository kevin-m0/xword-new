import React from "react";

export default function BulletList(props: React.ComponentProps<"svg">) {
	return (
		<svg
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.875 8C5.91053 8 6.75 7.16053 6.75 6.125C6.75 5.08947 5.91053 4.25 4.875 4.25C3.83947 4.25 3 5.08947 3 6.125C3 7.16053 3.83947 8 4.875 8Z"
				fill="white"
			/>
			<path
				d="M4.875 16.75C5.91053 16.75 6.75 15.9105 6.75 14.875C6.75 13.8395 5.91053 13 4.875 13C3.83947 13 3 13.8395 3 14.875C3 15.9105 3.83947 16.75 4.875 16.75Z"
				fill="white"
			/>
			<path
				d="M10.5 14.25H19.25V15.5H10.5V14.25ZM10.5 5.5H19.25V6.75H10.5V5.5Z"
				fill="white"
			/>
		</svg>
	);
}
