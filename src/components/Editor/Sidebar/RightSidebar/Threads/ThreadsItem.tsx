// import { useCallback } from "react";
// import { useThreadsState } from "./context";
// import { ThreadCard } from "./ThreadCard";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@/hooks/useUser";
// import { ChevronDown } from "@/icons/Figma";
// import Image from "next/image";
// import ThreadDropDown from "./ThreadDropDown";
// import { CommentItem } from "./CommentItem";
// import CommentInputDialog from "./CommentInputDialog";

// interface ThreadsItemProps {
// 	thread: any;
// 	provider: any;
// 	active: boolean;
// 	open: boolean;
// }

// export const ThreadsItem = ({
// 	thread,
// 	provider,
// 	active,
// 	open,
// }: ThreadsItemProps) => {
// 	const {
// 		onClickThread,
// 		deleteThread,
// 		onHoverThread,
// 		onLeaveThread,
// 		resolveThread,
// 		unresolveThread,
// 	} = useThreadsState();
// 	const classNames = ["threadsList--item"];
// 	if (active || open) {
// 		classNames.push("threadsList--item--active");
// 	}
// 	const firstComment = thread.comments && thread.comments[0];

// 	const { data: user } = useUser();
// 	const handleDeleteClick = useCallback(() => {
// 		deleteThread(thread.id);
// 	}, [thread.id, deleteThread]);

// 	const handleResolveClick = useCallback(() => {
// 		resolveThread(thread.id);
// 	}, [thread.id, resolveThread]);

// 	const handleUnresolveClick = useCallback(() => {
// 		unresolveThread(thread.id);
// 	}, [thread.id, unresolveThread]);

// 	const editComment = useCallback(
// 		(commentId: string, val: string) => {
// 			provider.updateComment(thread.id, commentId, { content: val });
// 		},
// 		[provider, thread.id]
// 	);

// 	const deleteComment = useCallback(
// 		(commentId: string) => {
// 			provider.deleteComment(thread.id, commentId);
// 		},
// 		[provider, thread.id]
// 	);
// 	if (!user) return;

// 	return (
// 		<div
// 			onMouseEnter={() => onHoverThread(thread.id)}
// 			onMouseLeave={() => onLeaveThread(thread.id)}
// 		>
// 			<ThreadCard
// 				id={thread.id}
// 				active={active || open}
// 				onClick={!open ? onClickThread : null}
// 			>
// 				<div className="flex items-center gap-3">
// 					<Image
// 						src={firstComment.data.userAvatar}
// 						alt="avatar"
// 						width={32}
// 						height={32}
// 						className="h-8 w-8 rounded-full flex-none"
// 					/>
// 					<div className="flex-1">
// 						<div className="text-[14px] leading-[20px]">
// 							{firstComment.data.userName}
// 						</div>
// 						<div className="text-[12px] leading-[20px]">
// 							{new Date(firstComment.createdAt).toLocaleTimeString()}
// 						</div>
// 					</div>
// 					{firstComment.data.userId === user?.id && (
// 						<ThreadDropDown
// 							deleteThread={handleDeleteClick}
// 							resolveThread={handleResolveClick}
// 							unresolveThread={handleUnresolveClick}
// 							isResolved={!!thread.resolvedAt}
// 							editThread={(val: string) => editComment(firstComment.id, val)}
// 							content={firstComment.content}
// 						/>
// 					)}
// 				</div>

// 				{firstComment && firstComment.data ? (
// 					<CommentItem
// 						key={firstComment.id}
// 						commentId={firstComment.id}
// 						content={firstComment.content}
// 					/>
// 				) : null}
// 				{open ? (
// 					<>
// 						{thread.comments.slice(1).map((comment: any) => (
// 							<CommentItem
// 								key={comment.id}
// 								commentId={comment.id}
// 								userName={comment.data.userName}
// 								createdAt={comment.createdAt}
// 								content={comment.content}
// 								editComment={(val: string) => editComment(comment.id, val)}
// 								deleteComment={deleteComment}
// 							/>
// 						))}

// 						<CommentInputDialog
// 							strategy="comment"
// 							user={user}
// 							threadId={thread.id}
// 							provider={provider}
// 						>
// 							<Button
// 								variant="transparent"
// 								className="h-8 flex items-center justify-between"
// 							>
// 								Reply to comment
// 								<div className="-rotate-90">
// 									<ChevronDown />
// 								</div>
// 							</Button>
// 						</CommentInputDialog>
// 					</>
// 				) : null}
// 			</ThreadCard>
// 		</div>
// 	);
// };
