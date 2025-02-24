// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { getEditorBrandVoices } from "@/hooks/editor/useGetEditorBrandVoices";
// import EmotionBulb from "@/icons/EmotionBulb";
// import { AudioLines, Loader, Trash2, Volume2 } from "lucide-react";
// import { useState } from "react";
// import EditorBrandVoiceDialog from "./EditorBrandVoiceDialog";
// import EditorBrandVoiceDeleteAlert from "./EdittorBrandVoiceDeleteAlert";
// import { useAtom } from "jotai";
// import { brandVoiceAtom } from "@/atoms";

// interface EditorBrandVoice {
//   id: string;
//   name: string;
// }
// const EditorBrandVoiceDropdown = () => {
//   const [open, setOpen] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [selectedMenu, setSelectedMenu] = useAtom<Object | null>(
//     brandVoiceAtom
//   );

//   const { data: editorBrandVoices, isLoading } = getEditorBrandVoices();

//   const handleMenuItemClick = (brandVoice: EditorBrandVoice) => {

//     setSelectedMenu(brandVoice); //TODO: do something with the selected brand voice
//     setOpen(false);
//   };

//   return (
//     <>
//       <DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
//         <DropdownMenuTrigger>
//           <Button variant="gradient">
//             <EmotionBulb />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem
//             onClick={() => setSelectedMenu(null)}
//             className={selectedMenu === null ? "selected-brandVoice" : ""}
//           >
//             <div className="flex items-center gap-2">
//               <AudioLines className="h-5 w-5" />
//               Default Voice
//             </div>
//           </DropdownMenuItem>
//           {isLoading ? (
//             <Loader className="animate-spin" />
//           ) : (
//             <>
//               {editorBrandVoices && editorBrandVoices.length > 0 && (
//                 <>
//                   {editorBrandVoices.map((brandVoice: EditorBrandVoice) => (
//                     <DropdownMenuItem
//                       key={brandVoice.id}
//                       onClick={() => handleMenuItemClick(brandVoice)}
//                       className={
//                         selectedMenu === brandVoice ? "selected-brandVoice" : ""
//                       }
//                     >
//                       <div className="flex justify-between items-center gap-2">
//                         <AudioLines className="h-5 w-5" />
//                         {brandVoice.name}
//                         <Trash2
//                           onClick={() => {
//                             setSelectedMenu(brandVoice);
//                             setAlertOpen(true);
//                             setOpen(false);
//                           }}
//                           className="h-5 w-5"
//                         />
//                       </div>
//                     </DropdownMenuItem>
//                   ))}
//                 </>
//               )}
//             </>
//           )}
//           <DropdownMenuItem>
//             <div
//               onClick={() => {
//                 setDialogOpen(true);
//                 setOpen(false);
//               }}
//               className="flex items-center gap-2"
//             >
//               <Volume2 className="h-5 w-5" />
//               Add New Voice
//             </div>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       {dialogOpen && (
//         <EditorBrandVoiceDialog
//           setDialogOpen={setDialogOpen}
//           dialogOpen={dialogOpen}
//         />
//       )}
//       {alertOpen && selectedMenu && (
//         <EditorBrandVoiceDeleteAlert
//           editorBrandVoiceId={selectedMenu.id}
//           setAlertOpen={setAlertOpen}
//           alertOpen={alertOpen}
//         />
//       )}
//     </>
//   );
// };

// export default EditorBrandVoiceDropdown;
