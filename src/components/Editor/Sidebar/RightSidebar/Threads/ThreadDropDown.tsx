// import { Button } from "@/components/ui/button";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Check, Delete, Pencil, Settings } from "@/icons/Figma";
// import React, { useState } from "react";
// import CommentInputDialog from "./CommentInputDialog";

// export default function ThreadDropDown({
// 	deleteThread,
// 	resolveThread,
// 	unresolveThread,
// 	isResolved,
// 	editThread,
// 	content,
// }: {
// 	deleteThread: () => void;
// 	resolveThread: () => void;
// 	unresolveThread: () => void;
// 	isResolved: boolean;
// 	editThread: (val: string) => void;
// 	content: string;
// }) {
// 	const [open, setOpen] = useState(false);
// 	return (
// 		<DropdownMenu
// 			open={open}
// 			onOpenChange={(val) => setOpen(val)}
// 		>
// 			<DropdownMenuTrigger asChild>
// 				<Button variant="transparent">
// 					<Settings />
// 				</Button>
// 			</DropdownMenuTrigger>

// 			<DropdownMenuContent className="min-w-[140px] right-9">
// 				<DropdownMenuItem className="mb-[3px] ">
// 					<CommentInputDialog
// 						strategy="Tedit"
// 						editComment={editThread}
// 						content={content}
// 					>
// 						<div className="flex items-center gap-1">
// 							<Pencil />
// 							Edit Thread
// 						</div>
// 					</CommentInputDialog>
// 				</DropdownMenuItem>
// 				{isResolved ? (
// 					<DropdownMenuItem
// 						onSelect={unresolveThread}
// 						className="mb-[3px] flex items-center gap-1"
// 					>
// 						<Check />
// 						Mark as unresolved
// 					</DropdownMenuItem>
// 				) : (
// 					<DropdownMenuItem
// 						onSelect={resolveThread}
// 						className="mb-[3px] flex items-center gap-1"
// 					>
// 						<Check />
// 						Mark as resolved
// 					</DropdownMenuItem>
// 				)}
// 				<DropdownMenuItem
// 					onSelect={deleteThread}
// 					className="mb-[3px] flex items-center gap-1"
// 				>
// 					<Delete />
// 					Delete Thread
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }
