// import { Button } from "@/components/ui/button";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
// 	Bold,
// 	ChevronDown,
// 	CodeBlock,
// 	Highlight,
// 	Italic,
// 	StrikeThrough,
// 	SubScript,
// 	SuperScript,
// 	Quote,
// 	Underline,
// } from "@/icons/Figma";
// import { cn } from "@/utils/utils";
// import { Editor } from "@tiptap/react";
// import React, { useState } from "react";

// export default function TextFormat({ editor }: { editor: Editor }) {
// 	const [open, setOpen] = useState(false);
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
// 					Format <ChevronDown />
// 				</Button>
// 			</DropdownMenuTrigger>

// 			<DropdownMenuContent className="min-w-[140px]">
// 				<DropdownMenuItem
// 					onSelect={() => editor?.chain().focus().toggleBold().run()}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("bold"),
// 					})}
// 				>
// 					<Bold />
// 					Bold
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => editor?.chain().focus().toggleItalic().run()}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("italic"),
// 					})}
// 				>
// 					<Italic />
// 					Italic
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => editor?.chain().focus().toggleUnderline().run()}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("underline"),
// 					})}
// 				>
// 					<Underline />
// 					Underline
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() =>
// 						editor?.chain().focus().toggleHighlight({ color: "#FFE066" }).run()
// 					}
// 					className={cn("mb-[3px] flex items-center gap-1 ", {
// 						"selected-item": editor?.isActive("highlight"),
// 					})}
// 				>
// 					<Highlight />
// 					Highlight
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => editor?.chain().focus().toggleStrike().run()}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("strike"),
// 					})}
// 				>
// 					<StrikeThrough />
// 					Strikethrough
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() =>
// 						editor?.isActive("subscript")
// 							? editor?.chain().focus().unsetSubscript().setSuperscript().run()
// 							: editor?.chain().focus().toggleSuperscript().run()
// 					}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("superscript"),
// 					})}
// 				>
// 					<SuperScript />
// 					Superscript
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() =>
// 						editor?.isActive("superscript")
// 							? editor?.chain().focus().unsetSuperscript().setSubscript().run()
// 							: editor?.chain().focus().toggleSubscript().run()
// 					}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("subscript"),
// 					})}
// 				>
// 					<SubScript />
// 					Subscript
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => editor?.chain().focus().toggleBlockquote().run()}
// 					className={cn("mb-[3px] flex items-center gap-1 ", {
// 						"selected-item": editor?.isActive("blockquote"),
// 					})}
// 				>
// 					<Quote />
// 					Add Quote
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => editor.chain().focus().toggleCodeBlock().run()}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": editor?.isActive("codeBlock"),
// 					})}
// 				>
// 					<CodeBlock />
// 					Code block
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }
