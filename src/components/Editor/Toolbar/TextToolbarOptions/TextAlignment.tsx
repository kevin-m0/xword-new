// import { Editor } from "@tiptap/react";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
// 	CenterAlign,
// 	ChevronDown,
// 	JustifyAlign,
// 	LeftAlign,
// 	RightAlign,
// } from "@/icons/Figma";
// import { cn } from "@/utils/utils";

// export default function TextAlignment({ editor }: { editor: Editor }) {
// 	const [open, setOpen] = useState(false);
// 	const [currentAlign, setCurrentAlign] = useState("left");

// 	useEffect(() => {
// 		if (editor) {
// 			const alignment = ["left", "center", "right", "justify"].find(
// 				(alignment) => editor?.isActive({ textAlign: alignment })
// 			);
// 			if (alignment) setCurrentAlign(alignment);
// 			else setCurrentAlign("left");
// 		}
// 	}, [
// 		editor,
// 		editor?.isActive({ textAlign: "left" }),
// 		editor?.isActive({ textAlign: "center" }),
// 		editor?.isActive({ textAlign: "right" }),
// 		editor?.isActive({ textAlign: "justify" }),
// 	]);

// 	const handleSelect = (val: string) => {
// 		editor?.chain().focus().setTextAlign(val).run();
// 		setCurrentAlign(val);
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
// 					{currentAlign === "center" ? (
// 						<CenterAlign />
// 					) : currentAlign === "right" ? (
// 						<RightAlign />
// 					) : currentAlign === "justify" ? (
// 						<JustifyAlign />
// 					) : (
// 						<LeftAlign />
// 					)}
// 					<ChevronDown />
// 				</Button>
// 			</DropdownMenuTrigger>

// 			<DropdownMenuContent className="min-w-[140px]">
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect("left")}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": currentAlign === "left",
// 					})}
// 				>
// 					<LeftAlign />
// 					Left
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect("center")}
// 					className={cn(
// 						"mb-[3px] flex flex-row justify-start items-center gap-1",
// 						{
// 							"selected-item": currentAlign === "center",
// 						}
// 					)}
// 				>
// 					<CenterAlign />
// 					Center
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect("right")}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": currentAlign === "right",
// 					})}
// 				>
// 					<RightAlign />
// 					Right
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect("justify")}
// 					className={cn("mb-[3px] flex items-center gap-1 ", {
// 						"selected-item": currentAlign === "justify",
// 					})}
// 				>
// 					<JustifyAlign />
// 					Justify
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }
