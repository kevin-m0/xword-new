// import { Button } from "@/components/ui/button";
// import { Delete, Pencil } from "@/icons/Figma";
// import React from "react";
// import CommentInputDialog from "./CommentInputDialog";
// interface CommentItemProps {
// 	commentId: string;
// 	userName?: string;
// 	createdAt?: any;
// 	content: string;
// 	editComment?: (val: string) => void;
// 	deleteComment?: (commentId: string) => void;
// }
// export const CommentItem = ({
// 	commentId,
// 	userName,
// 	createdAt,
// 	content,
// 	editComment,
// 	deleteComment,
// }: CommentItemProps) => {
// 	return (
// 		<div className="p-[10px] bg-black bg-opacity-50 rounded-[10px] border border-white border-opacity-10 font-light text-[14px] leading-5">
// 			{userName ? (
// 				<div className="flex mb-3 items-center justify-between">
// 					<div className="flex flex-col">
// 						<div className="font-medium">{userName}</div>
// 						<div className="text-[14px] leading-[20px]">
// 							{new Date(createdAt).toLocaleTimeString()}
// 						</div>
// 					</div>
// 					<div className="flex items-center gap-1">
// 						<CommentInputDialog
// 							strategy="Cedit"
// 							editComment={editComment}
// 							content={content}
// 						>
// 							<Button variant="transparent">
// 								<Pencil />
// 							</Button>
// 						</CommentInputDialog>

// 						{deleteComment && (
// 							<Button
// 								variant="transparent"
// 								onClick={(e) => {
// 									deleteComment(commentId);
// 								}}
// 							>
// 								<Delete />
// 							</Button>
// 						)}
// 					</div>
// 				</div>
// 			) : null}
// 			{content}
// 		</div>
// 	);
// };
