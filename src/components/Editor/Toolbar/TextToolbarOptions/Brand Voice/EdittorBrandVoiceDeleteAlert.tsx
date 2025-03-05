// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { useDeleteEditorBrandVoice } from "@/hooks/editor/useDeleteEditorBrandVoice";

// interface EditorBrandVoiceDeleteProps {
//   setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   alertOpen: boolean;
//   editorBrandVoiceId: string;
// }

// const EditorBrandVoiceDeleteAlert = ({
//   alertOpen,
//   setAlertOpen,
//   editorBrandVoiceId,
// }: EditorBrandVoiceDeleteProps) => {
//   const { mutate: deleteEditorBrandVoice } = useDeleteEditorBrandVoice();

//   return (
//     <AlertDialog open={alertOpen} onOpenChange={(val) => setAlertOpen(val)}>
//       <AlertDialogTrigger asChild>
//         <></>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your
//             brand voice.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel asChild>
//             <Button variant="gradient">Cancel</Button>
//           </AlertDialogCancel>
//           <AlertDialogAction asChild className="pt-2">
//             <Button
//               variant="gradient"
//               onClick={() => deleteEditorBrandVoice({ editorBrandVoiceId })}
//             >
//               Delete
//             </Button>
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default EditorBrandVoiceDeleteAlert;