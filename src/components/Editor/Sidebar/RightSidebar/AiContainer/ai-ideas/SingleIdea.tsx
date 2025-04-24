// import { MoonEnterLightIcon } from "@/icons";
// import { Editor } from "@tiptap/react";
// import React from "react";

// const SingleIdea = ({
// 	content,
// 	editor,
// 	handleDropContent,
// }: {
// 	content: string;
// 	editor: Editor;
// 	handleDropContent: (content: string) => void;
// }) => {
// 	const handleDragStart = (
// 		event: React.DragEvent<HTMLDivElement>,
// 		content: string
// 	) => {
// 		event.dataTransfer.setData("text/plain", content);
// 	};

// 	const handleButtonClick = () => {
// 		handleDropContent(content);
// 	};

// 	return (
// 		<div
// 			className="border border-border-primary p-1 px-2 rounded-sm cursor-grab relative"
// 			draggable
// 			onDragStart={(e) => {
// 				handleDragStart(e, content);
// 			}}
// 		>
// 			<div className="z-0 bg-black bg-opacity-50 inset-0 absolute"></div>
// 			<button className="absolute right-1 z-10">
// 				<MoonEnterLightIcon onClick={handleButtonClick} />
// 			</button>
// 			<p className="text-sm p-0 pt-2 z-10 relative">{content}</p>
// 		</div>
// 	);
// };

// export default SingleIdea;
