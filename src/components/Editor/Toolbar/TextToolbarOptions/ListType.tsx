// import { Editor } from "@tiptap/react";
// import { useEffect, useState } from "react";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { BulletList, ChevronDown, NumberList } from "@/icons/Figma";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/utils/utils";

// export default function ListType({ editor }: { editor: Editor }) {
// 	const [open, setOpen] = useState(false);
// 	const [listType, setListType] = useState("");

// 	useEffect(() => {
// 		if (editor) {
// 			editor.isActive("bulletList")
// 				? setListType("bulletList")
// 				: editor.isActive("orderedList")
// 					? setListType("orderedList")
// 					: "";
// 		}
// 	}, [editor, editor?.isActive("bulletList"), editor?.isActive("orderedList")]);

// 	const handleSelect = (val: string) => {
// 		if (editor) {
// 			if (editor.isActive("bulletList")) {
// 				if (val === "bulletList") {
// 					editor.chain().focus().toggleBulletList().run();
// 					setListType("");
// 				} else {
// 					editor.chain().focus().toggleOrderedList().run();
// 					setListType("orderedList");
// 				}
// 			} else if (editor.isActive("orderedList")) {
// 				if (val === "orderedList") {
// 					editor.chain().focus().toggleOrderedList().run();
// 					setListType("");
// 				} else {
// 					editor.chain().focus().toggleBulletList().run();
// 					setListType("bulletList");
// 				}
// 			} else {
// 				if (val === "bulletList") {
// 					editor.chain().focus().toggleBulletList().run();
// 					setListType("bulletList");
// 				} else {
// 					editor.chain().focus().toggleOrderedList().run();
// 					setListType("orderedList");
// 				}
// 			}
// 		}
// 	};

// 	return (
// 		<DropdownMenu
// 			open={open}
// 			onOpenChange={(val) => setOpen(val)}
// 		>
// 			<DropdownMenuTrigger asChild>
// 				<Button
// 					variant="transparent"
// 					className="flex items-center justify-between gap-1"
// 				>
// 					List
// 					<ChevronDown />
// 				</Button>
// 			</DropdownMenuTrigger>

// 			<DropdownMenuContent className="min-w-[140px]">
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect("bulletList")}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": listType === "bulletList",
// 					})}
// 				>
// 					<BulletList />
// 					Bulleted List
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect("orderedList")}
// 					className={cn(
// 						"mb-[3px] flex flex-row justify-start items-center gap-1",
// 						{
// 							"selected-item": listType === "orderedList",
// 						}
// 					)}
// 				>
// 					<NumberList />
// 					Numbered List
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }
