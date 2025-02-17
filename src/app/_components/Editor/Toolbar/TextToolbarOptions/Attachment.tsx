// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Editor } from "@tiptap/react";
// import React, { useRef, useState } from "react";
// import {
//   Attachment as AttachmentIcon,
//   ImageIcon,
//   Profile,
//   Scrape,
// } from "@/icons/Figma";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import ScrapeDialog from "./Scrape Text/ScrapeDialog";
// import { ErrorToast } from "@/components/ui/custom-toast";

// export default function Attachment({ editor }: { editor: Editor }) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFileInputClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleImageInsert = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       Array.from(files).forEach((file) => {
//         if (!file.type.startsWith("image/")) {
//           toast.custom((t) => (
//             <ErrorToast
//               t={t}
//               title=""
//               description="Invalid file type. Please select an image."
//             />
//           ));
//           return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//           toast.custom((t) => (
//             <ErrorToast
//               t={t}
//               title="File Size Exceeds"
//               description="File size exceeds the limit (5MB). Please choose a smaller image."
//             />
//           ));
//           return;
//         }
//         const fileReader = new FileReader();
//         fileReader.readAsDataURL(file);

//         fileReader.onload = () => {
//           editor.chain().focus().setRootBlock().run();
//           editor
//             .chain()
//             .focus()
//             .insertContentAt(editor.state.selection.anchor, {
//               type: "image",
//               attrs: {
//                 src: fileReader.result as string,
//                 alt: "Image Insert",
//               },
//             })
//             .run();
//             editor.chain().focus().setRootBlock().run();
           
//         };

//         fileReader.onerror = () => {
//           toast.custom((t) => (
//             <ErrorToast t={t} title="" description="Error reading the file." />
//           ));
//         };
//       });
//     }
//   };

//   const [open, setOpen] = useState(false);
//   const [isScrapeDialogOpen, setIsScrapeDialogOpen] = useState(false);
//   return (
//     <>
//       <DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="transparent">
//             <AttachmentIcon />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent className="min-w-[140px]">
//           <DropdownMenuItem
//             onSelect={handleFileInputClick}
//             className="mb-[3px] flex items-center gap-1"
//           >
//             <ImageIcon />
//             Add Image
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onSelect={() => setIsScrapeDialogOpen(true)}
//             className="mb-[3px] flex items-center gap-1"
//           >
//             <Scrape /> Scrape Text
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <Input
//         type="file"
//         className="hidden"
//         ref={fileInputRef}
//         multiple
//         onChange={handleImageInsert}
//         accept="image/*"
//       />
//       {isScrapeDialogOpen && (
//         <ScrapeDialog
//           isOpen={isScrapeDialogOpen}
//           setIsOpen={setIsScrapeDialogOpen}
//           editor={editor}
//         />
//       )}
//     </>
//   );
// }
