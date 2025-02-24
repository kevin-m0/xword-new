import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Download as DownloadIcon } from "~/icons/Figma";
import { Editor } from "@tiptap/react";
import { pdf } from "@react-pdf/renderer";
import PDF from "~/lib/Pdf";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { htmlToDocMaker } from "~/lib/htmlToDocMaker";

export default function NewEditorExportContent({
    editor,
    title,
}: {
    editor: Editor;
    title: string;
}) {
    function removePTagsAroundImages(html: string): string {
        // Use a regular expression to replace <p>, <pre>, <code>, <input>, <image>, <ol>, <ul>, <h> tags with any attributes that surround <img> tags
        return html.replace(/<(p|pre|code|input|image|ol|ul|h[1-6])[^>]*>(\s*<img[^>]*>\s*)<\/\1>/g, '$2');
    }

    const generatePdfDocument = async () => {

        // Example usage
        const htmlData = editor.getHTML();

        const updatedHtmlData = removePTagsAroundImages(htmlData);
        console.log("HTML DATA", updatedHtmlData);

        const blob = await pdf(
            <PDF
                title={title}
                HTML={updatedHtmlData}
            />
        ).toBlob();
        if (!blob) {
            return;
        }
        console.log("blob", blob);
        saveAs(blob, `${title}.pdf`);
    };
    const Export2Word = async () => {
        try {
            const htmlData = editor.getHTML();
            const updatedHtmlData = removePTagsAroundImages(htmlData);
            const doc = await htmlToDocMaker(updatedHtmlData, title);
            Packer.toBlob(doc).then((blob: Blob) => {
                saveAs(blob, title + ".docx");
            });
        } catch (error) {
            console.log("error in docx generation", error);
        }
    };

    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu
            open={open}
            onOpenChange={(val) => setOpen(val)}
        >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <DownloadIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-transparent p-0 border-none ring-0">
                <div className="h-fit w-52 flex flex-col gap-1 rounded-lg bg-xw-card border border-xw-border p-1">
                    <Button
                        variant={"ghost"}
                        className="w-full"
                        onClick={generatePdfDocument}
                    >
                        Download as PDF
                    </Button>
                    <Button
                        variant={"ghost"}
                        className="w-full"
                        onClick={Export2Word}
                    >
                        Download as Word file
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
