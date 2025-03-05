// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Message, Profile } from "@/icons/Figma";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { threadInputAtom } from "@/atoms";
// import { useAtom, useSetAtom } from "jotai";
// import { Editor } from "@tiptap/react";
// import { User } from "@prisma/client";
// import { useState } from "react";

// export default function CommentInputDialog({
// 	strategy,
// 	editor,
// 	user,
// 	threadId,
// 	provider,
// 	children,
// 	editComment,
// 	content,
// }: {
// 	strategy: string;
// 	editor?: Editor;
// 	user?: User;
// 	threadId?: string;
// 	provider?: any;
// 	children: React.ReactNode;
// 	editComment?: (val: string) => void;
// 	content?: string;
// }) {
// 	const [threadInput, setThreadInput] = useState(content || "");

// 	const [open, setOpen] = useState(false);
// 	const handleSubmitThread = () => {
// 		if (strategy === "thread") {
// 			if (threadInput && editor && user) {
// 				editor
// 					.chain()
// 					.focus()
// 					.setThread({
// 						content: threadInput,
// 						data: {
// 							userId: user.id,
// 							userName: user.name,
// 							userAvatar: user.image,
// 						},
// 						commentData: {
// 							userId: user.id,
// 							userName: user.name,
// 							userAvatar: user.image,
// 						},
// 					})
// 					.run();
// 			}
// 		} else if (strategy === "comment") {
// 			if (threadInput && threadId && provider) {
// 				provider.addComment(threadId, {
// 					content: threadInput,
// 					createdAt: Date.now(),
// 					updatedAt: Date.now(),
// 					data: {
// 						userId: user?.id,
// 						userName: user?.name,
// 						userAvatar: user?.image,
// 					},
// 				});
// 			}
// 		} else if (strategy === "Cedit") {
// 			editComment && editComment(threadInput);
// 		}
// 		setThreadInput("");
// 		setOpen(false);
// 	};

// 	const cancelThreadInput = () => {
// 		setThreadInput("");
// 		setOpen(false);
// 	};

// 	return (
// 		<Dialog
// 			open={open}
// 			onOpenChange={() => {
// 				setOpen((p) => !p);
// 			}}
// 		>
// 			<DialogTrigger asChild>{children}</DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader>
// 					<DialogTitle className="flex items-center gap-2">
// 						<Message /> Add Comment
// 					</DialogTitle>
// 				</DialogHeader>
// 				<Textarea
// 					className="relative z-50"
// 					placeholder="Type your comment here..."
// 					value={threadInput}
// 					onChange={(e) => setThreadInput(e.target.value)}
// 				/>
// 				<div className="flex justify-center items-center gap-4">
// 					<Button
// 						variant="pw"
// 						onClick={cancelThreadInput}
// 						className="px-4 py-2 rounded-[8px] text-[14px]"
// 					>
// 						Cancel
// 					</Button>
// 					<Button
// 						variant="pw"
// 						onClick={handleSubmitThread}
// 						className="px-4 py-2 rounded-[8px] text-[14px]"
// 					>
// 						Save
// 					</Button>
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
