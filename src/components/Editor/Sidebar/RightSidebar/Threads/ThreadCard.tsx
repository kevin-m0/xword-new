// import { useCallback, useEffect, useRef } from "react";
// import { clsx } from "clsx";

// interface ThreadCardProps {
// 	id: string;
// 	active: boolean;
// 	children: any;
// 	onClick: ((threadId: string) => void) | null;
// }

// export const ThreadCard = ({
// 	id,
// 	active,
// 	children,
// 	onClick,
// }: ThreadCardProps) => {
// 	const cardRef = useRef<HTMLDivElement>(null);

// 	const handleClick = useCallback(() => {
// 		if (onClick) {
// 			onClick(id);
// 		}
// 	}, [id, onClick]);

// 	const classNames = clsx(
// 		"p-3 transition-all comments-bg rounded-[8px] border border-white border-opacity-10 flex flex-col gap-3",
// 		active
// 			? "cursor-default border-opacity-40"
// 			: "cursor-pointer hover:border-opacity-20"
// 	);

// 	return (
// 		<div
// 			ref={cardRef}
// 			className={classNames}
// 			onClick={handleClick}
// 		>
// 			{children}
// 		</div>
// 	);
// };
