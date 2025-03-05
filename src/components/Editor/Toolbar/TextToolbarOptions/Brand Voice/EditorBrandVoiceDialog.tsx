// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   SelectItem,
//   Select,
//   SelectContent,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// // import { useLanguageModels } from "@/hooks/audiosonic/useLanguageModels";
// import EmotionBulb from "@/icons/EmotionBulb";
// import SaveIcon from "@/icons/SaveIcon";
// import { Loader } from "lucide-react";
// import { emotionOptions, languageOptions, styleOptions } from "./options";
// import { trpc } from "@/app/_trpc/client";
// import { useCreateEditorBrandVoice } from "@/hooks/editor/useCreateEditorBrandVoice";
// import { toast } from "sonner";
// import { ErrorToast, SuccessToast } from "@/components/ui/custom-toast";
// import { useAtom } from "jotai";
// import { modelTypeAtom } from "@/atoms";

// interface EditorBrandVoiceProps {
//   setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   dialogOpen: boolean;
// }

// const EditorBrandVoiceDialog = ({
//   dialogOpen,
//   setDialogOpen,
// }: EditorBrandVoiceProps) => {
//   const {
//     data: user,
//     isLoading: loadingUser,
//     isError,
//   } = trpc.user.getCurrentLoggedInUser.useQuery();

//   // const { data: languages, isLoading } = useLanguageModels();
//   const [voiceName, setVoiceName] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [selectedEmotion, setSelectedEmotion] = useState("");
//   const [selectedStyle, setSelectedStyle] = useState("");
//   const [content, setContent] = useState("");
//   const [isSaving, setIsSaving] = useState(false);
//   const [modelType, setModelType] = useAtom(modelTypeAtom);
//   const handleCreateEditorBrandVoiceCleanups = () => {
//     setVoiceName("");
//     setSelectedLanguage("");
//     setSelectedEmotion("");
//     setSelectedStyle("");
//     setContent("");
//   };

//   const { mutate: createEditorBrandVoice } = useCreateEditorBrandVoice({
//     handleCleanups: handleCreateEditorBrandVoiceCleanups,
//   });

//   const brandVoice = async () => {
//     try {
//       if (!user) {
//         setIsSaving(true);
//         toast.custom((t) => (
//           <ErrorToast
//             t={t}
//             title=""
//             description="User details not available."
//           />
//         ));
//         return;
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/generate-alternative-brand-voice`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
//           },
//           body: JSON.stringify({
//             userId: user.id,
//             name: voiceName,
//             language: selectedLanguage,
//             emotion: selectedEmotion,
//             style: selectedStyle,
//             data: content,
//             model: modelType
//           }),
//         }
//       );

//       if (!response.ok) {
//         toast.custom((t) => (
//           <ErrorToast
//             t={t}
//             title="Error"
//             description="Something went wrong. Please try again later.."
//           />
//         ));
//       }
//       const responseData = await response.json();
//       setIsSaving(false);
//       return responseData;
//     } catch (e) {
//       toast.custom((t) => (
//         <ErrorToast
//           t={t}
//           title="Error"
//           description="Something went wrong. Please try again later.."
//         />
//       ));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       const brandVoiceResponse = await brandVoice();
//       createEditorBrandVoice({
//         name: brandVoiceResponse.name,
//         brandVoice: brandVoiceResponse.brandVoice,
//         specialization: brandVoiceResponse.specialization,
//         audience: brandVoiceResponse.audience,
//         purpose: brandVoiceResponse.purpose,
//         tone: brandVoiceResponse.tone,
//         emotions: brandVoiceResponse.emotions,
//         character: brandVoiceResponse.character,
//         genre: brandVoiceResponse.genre,
//         languageStyle: brandVoiceResponse.languageStyle,
//       });
//       setIsSaving(false);
//       setDialogOpen(false);
//       toast.custom((t) => (
//         <SuccessToast
//           t={t}
//           title=""
//           description="Brand Voice created Successfully!"
//         />
//       ));
//     } catch (error) {
//       toast.custom((t) => (
//         <ErrorToast
//           t={t}
//           title="Error creating brand voice"
//           description={`Error:${error}`}
//         />
//       ));
//     }
//   };

//   if (loadingUser) return <Loader />;
//   if (isError) return <p>Error occurred while fetching user details </p>;

//   return (
//     <>
//       <Dialog open={dialogOpen} onOpenChange={(val) => setDialogOpen(val)}>
//         <DialogTrigger></DialogTrigger>
//         <DialogContent>
//           <DialogHeader className="flex flex-col gap-4 relative z-10">
//             <DialogTitle>
//               <span className="flex items-center gap-2">
//                 <EmotionBulb />
//                 Brand Voice
//               </span>
//             </DialogTitle>
//           </DialogHeader>
//           <div className="grid grid-cols-2 items-center relative z-10">
//             <div className="space-y-2">
//               <p>Voice Name:</p>
//               <p>Brand voice Language:</p>
//               <p>Choose emotion:</p>
//               <p>Choose style:</p>
//             </div>
//             <div className="space-y-2">
//               <Input
//                 placeholder="Enter Vocie Name"
//                 value={voiceName}
//                 onChange={(e) => setVoiceName(e.target.value)}
//               />
//               <Select
//                 value={selectedLanguage}
//                 onValueChange={(val) => setSelectedLanguage(val)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a Language" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <ScrollArea className="h-[250px]">
//                     {languageOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </ScrollArea>
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={selectedEmotion}
//                 onValueChange={(val) => setSelectedEmotion(val)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select an Emotion" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {emotionOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={selectedStyle}
//                 onValueChange={(val) => setSelectedStyle(val)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a Style" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {styleOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="bg-black/50 border rounded-lg px-3 pb-3 relative z-10">
//             <p>Upload content to train AI to your writing style:</p>
//             <Textarea
//               placeholder="Add more than 500 words of your brand text! Add your text here..."
//               className="resize-none overflow-y-auto scrollbar-none h-[200px]"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//             />
//           </div>
//           <div className="flex items-center justify-center py-5 gap-4">
//             <Button
//               variant="gradient"
//               onClick={() => {
//                 setDialogOpen(false);
//               }}
//               disabled={isSaving || loadingUser}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="gradient"
//               onClick={handleSave}
//               disabled={isSaving || loadingUser}
//             >
//               {isSaving ? (
//                 <Loader className="animate-spin" />
//               ) : (
//                 <>
//                   Save&nbsp;&nbsp;
//                   <SaveIcon />
//                 </>
//               )}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default EditorBrandVoiceDialog;
