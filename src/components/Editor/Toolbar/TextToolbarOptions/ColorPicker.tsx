// import { Editor } from "@tiptap/react";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { Check, ChevronDown } from "@/icons/Figma";

// export default function ColorPicker({ editor }: { editor: Editor }) {
// 	const colors = [
// 		"#000000",
// 		"#845EF7",
// 		"#339AF0",
// 		"#22B8CF",
// 		"#51CF66",
// 		"#FCC419",
// 		"#FF6B6B",
// 		"#F06595",
// 		"#FFFFFF",
// 		"#5F3DC4",
// 		"#1864AB",
// 		"#0B7285",
// 		"#2B8A3E",
// 		"#E67700",
// 		"#C92A2A",
// 		"#C2255C",
// 	];
// 	const [colorSelected, setColorSelected] = useState<string>(
// 		editor?.getAttributes("textStyle").color || "#FFFFFF"
// 	);

// 	useEffect(() => {
// 		editor &&
// 			setColorSelected(
// 				(editor.getAttributes("textStyle").color as string) || "#FFFFFF"
// 			);
// 	}, [editor?.getAttributes("textStyle").color]);
// 	const [open, setOpen] = useState(false);
// 	const handleColorChange = (color: string) => {
// 		setColorSelected(color);
// 		editor.chain().focus().setColor(color).run();
// 		setOpen(false);
// 	};

// 	if (!editor) return;
// 	return (
// 		<Popover
// 			open={open}
// 			onOpenChange={(val) => setOpen(val)}
// 		>
// 			<PopoverTrigger asChild>
// 				<Button
// 					variant="transparent"
// 					className="flex items-center justify-between"
// 					onClick={() => setOpen((prev) => !prev)}
// 				>
// 					<div
// 						className="h-5 w-5 rounded-[4px] mr-1"
// 						style={{ backgroundColor: colorSelected }}
// 					/>
// 					<ChevronDown />
// 				</Button>
// 			</PopoverTrigger>
// 			<PopoverContent className="grid grid-cols-8 gap-[6px] p-[6px]">
// 				{colors.map((color, index) => (
// 					<div
// 						key={index}
// 						className="h-6 w-6 rounded-[4px] cursor-pointer flex items-center justify-center"
// 						style={{ backgroundColor: color }}
// 						onClick={() => handleColorChange(color)}
// 					>
// 						{colorSelected === color && <Check />}
// 					</div>
// 				))}
// 			</PopoverContent>
// 		</Popover>
// 	);
// }
