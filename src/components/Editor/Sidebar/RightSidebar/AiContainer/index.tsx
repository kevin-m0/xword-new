// import React from "react";
// import { Editor } from "@tiptap/react";

// import AiChatContainer from "./ai-chat/AiChatContainer";
// import AiIdeasContainer from "./ai-ideas/AiIdeasContainer";
// import { Document, User } from "@prisma/client";
// import { useUser } from "@/hooks/useUser";

// const AiContainer = ({
//   editor,
//   document,
// }: {
//   editor: Editor;
//   document: Document | undefined;
// }) => {
// 	const dropToKeyboard = (content: string) => {
// 		editor
// 			.chain()
// 			.focus()
// 			.insertContentAt(editor.state.selection.anchor, content)
// 			.run();
// 	};
// 	const { data: user } = useUser();
// 	return (
// 		<div className="flex flex-col h-[calc(100vh-188px)]">
// 			<AiIdeasContainer
// 				editor={editor}
// 				document={document}
// 				user={user}
// 			/>
// 			<AiChatContainer editor={editor} />
// 		</div>
// 	);
// };

// export default AiContainer;
