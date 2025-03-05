// import React from "react";

// const RenderShortCut = ({ shortCut }: { shortCut: Set<string> }) => {
// 	const getkeys = () => {
// 		const keys: string[] = Array.from(shortCut);
// 		return keys;
// 	};

// 	return (
// 		<div className="flex gap-1 justify-end items-center">
// 			{getkeys().map((key, index, array) => (
// 				<React.Fragment key={index}>
// 					<span className="text-xs text-white capitalize p-[1px]">
// 						{key === " " ? "Space" : key}
// 					</span>
// 					{index < array.length - 1 && (
// 						<span className="text-sm text-white font-medium"> + </span>
// 					)}
// 				</React.Fragment>
// 			))}
// 		</div>
// 	);
// };

// export default RenderShortCut;
