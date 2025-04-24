// import { Editor } from "@tiptap/react";
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { usePlagiarismDetection } from "@/hooks/editor/usePlagiarismDetection";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { Search } from "@/icons/Figma";
// import { ErrorToast } from "@/components/ui/custom-toast";

// type PlagiarismDetectionDialogProps = {
//   isOpen: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   editor: Editor;
// };
// export default function PlagiarismDetection({
//   isOpen,
//   setOpen,
//   editor,
// }: PlagiarismDetectionDialogProps) {
//   const [plagiarismScore, setPlagiarismScore] = useState("");
//   const [plagiarismSource, setPlagiarismSource] = useState("");
//   const { mutate: detectPlagiarism } = usePlagiarismDetection({
//     onSuccess: (data: { score: number; source: string }) => {
//       setPlagiarismScore(data.score.toString());
//       setPlagiarismSource(data.source);
//     },
//     onError: () => {
//       setOpen(false);
//       toast.custom((t) => (
//         <ErrorToast
//           t={t}
//           title="Unable to dectect Plagiarism"
//           description="We cannot detect Plagiarism right now. Please try after some time"
//         />
//       ));
//     },
//   });
//   const isLoading = false;

//   useEffect(() => {
//     if (editor) {
//       if (editor.getText()) detectPlagiarism(editor.getText());
//       else
//         setPlagiarismSource(
//           "Editor content is empty. Enter some text to detect plagiarism."
//         );
//     }
//   }, [editor, detectPlagiarism]);
//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={() => {
//         setOpen(!isOpen);
//       }}
//     >
//       <DialogTrigger asChild></DialogTrigger>
//       <DialogContent>
//         <DialogHeader className="space-y-4">
//           <DialogTitle className="flex items-center gap-2">
//             <Search />
//             Plagiarism Checker
//           </DialogTitle>
//           <div className="flex flex-col items-center justify-center w-full dark-glass mt-10 p-4 relative z-20">
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//             ) : (
//               plagiarismScore !== "" && (
//                 <div className="text-[18px] leading-5 text-center">
//                   {plagiarismScore}% Plagiarised
//                 </div>
//               )
//             )}
//             {!isLoading && plagiarismScore !== "0" && (
//               <div className="text-white text-opacity-70 text-[14px] leading-5 pt-4 text-center">
//                 {plagiarismSource}
//               </div>
//             )}
//           </div>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// }
