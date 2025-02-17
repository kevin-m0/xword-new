// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Download as DownloadIcon } from "@/icons/Figma";
// import { Editor } from "@tiptap/react";
// import { pdf } from "@react-pdf/renderer";
// import PDF from "@/lib/Pdf";
// import { saveAs } from "file-saver";
// import { Packer } from "docx";
// import { htmlToDocMaker } from "@/lib/htmlToDocMaker";

// export default function Download({
// 	editor,
// 	title,
// }: {
// 	editor: Editor;
// 	title: string;
// }) {
// 	function removePTagsAroundImages(html: string): string {
// 		// Use a regular expression to replace <p> tags with any attributes that surround <img> tags
// 		return html.replace(/<p[^>]*>(\s*<img[^>]*>\s*)<\/p>/g, '$1');
// 	  }
// 	const generatePdfDocument = async () => {

// 		// Example usage
// 		const htmlData = editor.getHTML();
// 		const updatedHtmlData = removePTagsAroundImages(htmlData);
// 		console.log("HTML DATA", updatedHtmlData);

// 		const blob = await pdf(
// 			<PDF
// 				title={title}
// 				HTML={updatedHtmlData}
// 			/>
// 		).toBlob();
// 		if (!blob) {
// 			return;
// 		}
// 		console.log("blob", blob);
// 		saveAs(blob, `${title}.pdf`);
// 	};
// 	const Export2Word = async () => {
// 		try {
// 			const htmlData = editor.getHTML();
// 			const updatedHtmlData = removePTagsAroundImages(htmlData);
// 			const doc = await htmlToDocMaker(updatedHtmlData, title);
// 			Packer.toBlob(doc).then((blob: Blob) => {
// 				saveAs(blob, title + ".docx");
// 			});
// 		} catch (error) {
// 			console.log("error in docx generation", error);
// 		}
// 	};

// 	const [open, setOpen] = useState(false);
// 	return (
// 		<DropdownMenu
// 			open={open}
// 			onOpenChange={(val) => setOpen(val)}
// 		>
// 			<DropdownMenuTrigger asChild>
// 				<Button variant="transparent">
// 					<DownloadIcon />
// 				</Button>
// 			</DropdownMenuTrigger>

// 			<DropdownMenuContent className="min-w-[140px]">
// 				<DropdownMenuItem
// 					onSelect={generatePdfDocument}
// 					className="mb-[3px]"
// 				>
// 					Download as PDF
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onSelect={Export2Word}
// 					className="mb-[3px]"
// 				>
// 					Download as Word file
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }
