// import React, { useEffect, useState } from "react";
// import { Editor } from "@tiptap/react";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { ChevronDown } from "@/icons/Figma";
// import { cn } from "@/utils/utils";
// import { Level } from "@tiptap/extension-heading";

// export default function TextSize({ editor }: { editor: Editor }) {
// 	const [open, setOpen] = useState(false);
// 	const [size, setSize] = useState<Level>(6);
// 	useEffect(() => {
// 		const size: Level = ([1, 2, 3, 6].find((size) =>
// 			editor?.isActive({ level: size })
// 		) || 6) as Level;
// 		setSize(size);
// 	}, [
// 		editor?.isActive({ level: 1 }),
// 		editor?.isActive({ level: 2 }),
// 		editor?.isActive({ level: 3 }),
// 		editor?.isActive({ level: 6 }),
// 	]);

// 	const handleSelect = (val: Level) => {
// 		val !== 6
// 			? editor.chain().focus().setHeading({ level: val }).run()
// 			: editor?.isActive("heading")
// 				? editor.chain().focus().toggleHeading({ level: val }).run()
// 				: null;
// 	};
// 	return (
// 		<DropdownMenu
// 			open={open}
// 			onOpenChange={(val) => setOpen(val)}
// 		>
// 			<DropdownMenuTrigger asChild>
// 				<Button
// 					variant="transparent"
// 					className="flex items-center justify-evenly gap-1 text-[16px] w-[56px]"
// 				>
// 					{size === 1 ? "H1" : size === 2 ? "H2" : size === 3 ? "H3" : "T"}
// 					<ChevronDown />
// 				</Button>
// 			</DropdownMenuTrigger>

// 			<DropdownMenuContent className="min-w-[140px]">
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect(6)}
// 					className={cn("mb-[3px] flex items-center gap-1", {
// 						"selected-item": size === 6,
// 					})}
// 				>
// 					Normal Text
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect(1)}
// 					className={cn(
// 						"mb-[3px] flex items-center gap-1 text-[20px] font-bold py-[7px] leading-[18px]",
// 						{
// 							"selected-item": size === 1,
// 						}
// 					)}
// 				>
// 					Heading 1
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect(2)}
// 					className={cn(
// 						"mb-[3px] flex flex-row justify-start items-center gap-1 text-[16px] font-semibold py-[7px] leading-[18px]",
// 						{
// 							"selected-item": size === 2,
// 						}
// 					)}
// 				>
// 					Heading 2
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={() => handleSelect(3)}
// 					className={cn(
// 						"mb-[3px] flex flex-row justify-start items-center gap-1 text-[14px] font-medium py-[7px] leading-[18px]",
// 						{
// 							"selected-item": size === 3,
// 						}
// 					)}
// 				>
// 					Heading 3
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }

// // 		<Select
// // 			disabled={!isEditable}
// // 			value={
// // 				editor?.isActive("heading", { level: 1 })
// // 					? "h1"
// // 					: editor?.isActive("heading", { level: 2 })
// // 						? "h2"
// // 						: editor?.isActive("heading", { level: 3 })
// // 							? "h3"
// // 							: "t"
// // 			}
// // 			onValueChange={(selectedValue) => {
// // 				switch (selectedValue) {
// // 					case "h1":
// // 						editor.chain().focus().toggleHeading({ level: 1 }).run();
// // 						break;
// // 					case "h2":
// // 						editor.chain().focus().toggleHeading({ level: 2 }).run();
// // 						break;
// // 					case "h3":
// // 						editor.chain().focus().toggleHeading({ level: 3 }).run();
// // 						break;
// // 					default:
// // 						editor.isActive("heading") &&
// // 							editor
// // 								.chain()
// // 								.focus()
// // 								.toggleHeading({ level: 6 })
// // 								.toggleHeading({ level: 6 })
// // 								.run();
// // 				}
// // 			}}
// // 		>
// // 			<SelectTrigger className="hover:bg-gray-800 w-16">
// // 				<SelectValue />
// // 			</SelectTrigger>
// // 			<SelectContent>
// // 				<SelectGroup>
// // 					<SelectItem value="t">
// // 						<Type size={20} />
// // 					</SelectItem>
// // 					<SelectItem value="h1">
// // 						<Heading1 size={20} />
// // 					</SelectItem>
// // 					<SelectItem value="h2">
// // 						<Heading2 size={20} />
// // 					</SelectItem>
// // 					<SelectItem value="h3">
// // 						<Heading3 size={20} />
// // 					</SelectItem>
// // 				</SelectGroup>
// // 			</SelectContent>
// // 		</Select>
// // 	);
// // }
