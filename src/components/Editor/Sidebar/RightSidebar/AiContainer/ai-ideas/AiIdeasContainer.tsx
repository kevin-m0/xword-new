// import { toast } from "sonner";
// import { useAtom } from "jotai";
// import { Editor } from "@tiptap/react";
// import { useEffect, useState } from "react";
// import { Document, User } from "@prisma/client";
// import { RefreshCw } from "lucide-react";

// import { cn } from "@/utils/utils";
// import SingleIdea from "./SingleIdea";
// import { IdeaIcon, ChevronDown } from "@/icons/Figma";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { editorState, refetchTrigger } from "@/atoms";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useSuggestIdeas } from "@/hooks/llm/useSuggestIdeas";
// import { useGetActiveSpace } from "@/hooks/space/useGetActiveSpace";
// import { ErrorToast } from "@/components/ui/custom-toast";
// import { MODEL_TYPE, modelTypeAtom } from "@/atoms";

// interface AiIdeasContainerProps {
//   editor: Editor;
//   document: Document | undefined;
//   user: User | undefined | null;
// }

// const AiIdeasContainer: React.FC<AiIdeasContainerProps> = ({
//   editor,
//   document,
//   user,
// }) => {
//   const [modelType, setModelType] = useAtom<MODEL_TYPE>(modelTypeAtom);
//   const [isOpenAiIdeasContainer, setIsOpenAiIdeasContainer] = useState(true);
//   const [docTitle, setDocTitle] = useState("");
//   const [editorReady, setEditorReady] = useAtom(editorState);
//   const [ideas, setIdeas] = useState<string[]>([]);
//   const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);

//   const { data: activeWorkspace } = useGetActiveSpace();

//   useEffect(() => {
//     document && setDocTitle(document.title);
//   }, [document]);

//   const { mutate: suggestIdeas, isLoading } = useSuggestIdeas({
//     onSuccess: ({ response }: { response: string[] }) => {
//       setIdeas(response);
//       setRefetchTokenUsage((prev) => !prev);
//       sessionStorage.setItem(document?.id as string, JSON.stringify(response));
//     },
//     onError: () => {
//       toast.custom((t) => (
//         <ErrorToast
//           t={t}
//           title="Error Fetching Ideas"
//           description="We are having trouble fetching ideas. Please try again."
//         />
//       ));
//     },
//   });

//   useEffect(() => {
//     if (document) {
//       const storedIdeas = sessionStorage.getItem(document.id);
//       if (storedIdeas && storedIdeas !== "undefined") {
//         setIdeas(JSON.parse(storedIdeas));
//       } else if (editorReady) {
//         const text = editor?.getText();
//         const query = text !== undefined && text !== "" ? text : docTitle;

//         if (user && activeWorkspace && query) {
//           suggestIdeas({ userId: `${activeWorkspace.id}:${user.id}`, query, model: modelType });
//         }
//       }
//     }
//     return () => setEditorReady(false);
//   }, [
//     editorReady,
//     docTitle,
//     document,
//     user,
//     editor,
//     suggestIdeas,
//     setEditorReady,
//     activeWorkspace,
//   ]);

//   const { mutate: suggestMoreIdeas, isLoading: isMoreIdeasLoading } =
//     useSuggestIdeas({
//       onSuccess: ({ response }: { response: string[] }) => {
//         setIdeas((ideas) => [...ideas, ...response]);
//         setRefetchTokenUsage((prev) => !prev);

//         const storedIdeas = sessionStorage.getItem(document?.id as string);
//         const existingIdeas = storedIdeas ? JSON.parse(storedIdeas) : [];
//         const updatedIdeas = [...existingIdeas, ...response];

//         sessionStorage.setItem(
//           document?.id as string,
//           JSON.stringify(updatedIdeas)
//         );
//       },
//     });

//   const handleDropContent = (content: string) => {
//     if (editor) {
//       editor.chain().focus("end").insertContent(content).run();
//       editor.commands.selectTextblockEnd();
//     }
//   };

//   return (
//     <div
//       className={cn(
//         "border border-white border-opacity-10 bg-black bg-opacity-50  mb-5 rounded-[12px] relative overflow-hidden",
//         isOpenAiIdeasContainer ? "flex-1" : "h-max"
//       )}
//     >
//       {/* <div className="absolute ai-container-bg" />
//       <div className="absolute ai-container-bgb" /> */}
//       <div className="flex items-center justify-between p-3 relative z-10">
//         <div className="flex items-center gap-2">
//           <div
//             className={cn(
//               "cursor-pointer transition",
//               !isOpenAiIdeasContainer && "rotate-180"
//             )}
//             onClick={() => setIsOpenAiIdeasContainer((p) => !p)}
//           >
//             <ChevronDown />
//           </div>
//           <span className="text-sm lg:text-md flex items-center">
//             <IdeaIcon />
//             &nbsp;Idea Corner:
//           </span>
//         </div>
//         <div className="pr-1.5">
//           <RefreshCw
//             className={cn(
//               "text-white h-3.5 w-3.5 cursor-pointer",
//               isLoading && "animate-spin"
//             )}
//             onClick={() => {
//               if (user && activeWorkspace) {
//                 editor?.getText()
//                   ? suggestIdeas({
//                     userId: `${activeWorkspace?.id}:${user?.id}`,
//                     query: editor.getText(),
//                     model: modelType

//                   })
//                   : suggestIdeas({
//                     userId: `${activeWorkspace?.id}:${user?.id}`,
//                     query: docTitle,
//                     model: modelType
//                   });
//               } else if (!activeWorkspace) {
//                 toast.custom((t) => (
//                   <ErrorToast
//                     t={t}
//                     title=""
//                     description="Please select a workspace to load ideas"
//                   />
//                 ));
//               }
//             }}
//           />
//         </div>
//       </div>
//       {isOpenAiIdeasContainer && (
//         <>
//           <ScrollArea className="h-[calc(100%-100px)] relative z-10">
//             <div className="flex flex-col gap-2 p-3 relative z-10">
//               {isLoading || (ideas && ideas.length === 0)
//                 ? Array.from({ length: 6 }).map((_, index) => (
//                   <Skeleton key={index} className="dark:bg-gray-200 h-20" />
//                 ))
//                 : ideas &&
//                 ideas.map((content, i) => (
//                   <SingleIdea
//                     key={i}
//                     content={content}
//                     editor={editor}
//                     handleDropContent={handleDropContent}
//                   />
//                 ))}
//               {isMoreIdeasLoading &&
//                 Array.from({ length: 3 }).map((_, index) => (
//                   <Skeleton key={index} className="dark:bg-gray-200 h-20" />
//                 ))}
//             </div>
//           </ScrollArea>

//           <div className="p-3 flex justify-center items-center w-full cursor-pointer absolute left-0 bottom-0">
//             {ideas && ideas.length ? (
//               <Button
//                 className="text-sm w-full h-8 relative z-10 bg-black"
//                 onClick={() => {
//                   if (!activeWorkspace) {
//                     toast.custom((t) => (
//                       <ErrorToast
//                         t={t}
//                         title=""
//                         description="Please select a workspace to load more ideas"
//                       />
//                     ));
//                   }
//                   if (user && activeWorkspace) {
//                     editor?.getText()
//                       ? suggestMoreIdeas({
//                         userId: `${activeWorkspace.id}:${user.id}`,
//                         query: editor.getText(),
//                         model: modelType
//                       })
//                       : suggestMoreIdeas({
//                         userId: `${activeWorkspace.id}:${user.id}`,
//                         query: docTitle,
//                         model: modelType
//                       });
//                   }
//                 }}
//               >
//                 Load More Ideas
//               </Button>
//             ) : (
//               <Button
//                 className="text-sm w-full h-8 relative z-10 bg-black"
//                 onClick={() => {
//                   if (user && activeWorkspace) {
//                     editor?.getText()
//                       ? suggestIdeas({
//                         userId: `${activeWorkspace?.id}:${user?.id}`,
//                         query: editor.getText(),
//                         model: modelType
//                       })
//                       : suggestIdeas({
//                         userId: `${activeWorkspace?.id}:${user?.id}`,
//                         query: docTitle,
//                         model: modelType
//                       });
//                   } else if (!activeWorkspace) {
//                     toast.custom((t) => (
//                       <ErrorToast
//                         t={t}
//                         title=""
//                         description="Please select a workspace to load ideas"
//                       />
//                     ));
//                   }
//                 }}
//               >
//                 Load Ideas
//               </Button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AiIdeasContainer;
