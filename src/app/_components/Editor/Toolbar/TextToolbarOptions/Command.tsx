// "use client";
// import { toast } from "sonner";
// import { useAtom } from "jotai";
// import { Editor } from "@tiptap/react";
// import React, { useRef, useEffect, useState } from "react";
// import { SHORTCUT_ACTIONS } from "@/lib/constants";
// import RenderShortCut from "./RenderShortCut";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandShortcut,
// } from "@/components/ui/command";
// import { refetchTrigger } from "@/atoms";
// import { createTokens } from "@/services/openmeter";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useSeoOptimise } from "@/hooks/llm/useSeoOptimise";
// import PlagiarismDetection from "./PlagiarismDetection";
// import { useUser } from "@/hooks/useUser";
// import { useGetActiveSpace } from "@/hooks/space/useGetActiveSpace";
// import { useOrganization } from "@clerk/nextjs";
// import { ErrorToast } from "@/components/ui/custom-toast";
// import { MODEL_TYPE, modelTypeAtom } from "@/atoms";
// interface TextCommandProps {
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   editor: Editor;
//   selectedText: string;
// }

// export default function CommandsAI({
//   setIsOpen,
//   editor,
//   selectedText,
// }: TextCommandProps) {
//   const { data: user } = useUser();
//   const [isPlagiarismDetectionDialogOpen, setIsPlagiraismDetectionDialogOpen] =
//     useState(false);
//   const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
//   const { data: activeWorkspace } = useGetActiveSpace();
//   const [modelType, setModelType] = useAtom<MODEL_TYPE>(modelTypeAtom);

//   const { mutate: seoOptimise, isLoading } = useSeoOptimise({
//     onSuccess: ({ response }) => {
//       editor.commands.insertContent(response);
//       setRefetchTokenUsage((prev) => !prev);
//     },
//   });

//   const textCommandRef = useRef<HTMLDivElement>(null);

//   const { organization } = useOrganization();

//   const handleCreateTokens = () => {
//     if (!organization) return;
//     const text = selectedText;

//     let tokens = 0;

//     // Calculate tokens based on the model type
//     if (modelType === MODEL_TYPE.CHAT_GPT) {
//       tokens = text.length / 2;
//     } else if (modelType === MODEL_TYPE.WIZARD) {
//       tokens = text.length / 4;
//     }

//     console.log("created tokens", tokens);


//     createTokens(tokens, organization.id).catch(() => {
//       toast.custom((t) => (
//         <ErrorToast
//           t={t}
//           title="Error"
//           description="Something went wrong. Please refresh your page."
//         />
//       ));
//     });
//     setTimeout(() => {
//       setRefetchTokenUsage((prev) => !prev);
//     }, 10_000);
//   };

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setIsOpen((open) => !open);
//       }
//     };

//     const outsideClick = (e: MouseEvent) => {
//       if (shouldCloseTextCommand(textCommandRef.current, e.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("keydown", down);
//     document.addEventListener("click", outsideClick);

//     return () => {
//       document.removeEventListener("keydown", down);
//       document.removeEventListener("click", outsideClick);
//     };
//   }, [setIsOpen, textCommandRef]);

//   const shouldCloseTextCommand = (
//     textCommandRef: HTMLDivElement | null,
//     target: EventTarget | null
//   ) => {
//     return (
//       textCommandRef &&
//       !textCommandRef.contains(target as Node) &&
//       target instanceof HTMLElement &&
//       !target.classList.contains("commandInput")
//     );
//   };

//   const commands = [
//     {
//       label: "Grammar Check",
//       execute: () => {
//         editor.chain().focus().aiFixSpellingAndGrammar({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.GRAMMER_CHECK,
//     },
//     {
//       label: "Spell Check",
//       execute: () => {
//         editor.chain().focus().aiFixSpellingAndGrammar({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.SPELL_CHECK,
//     },
//     {
//       // TODO
//       label: "Learn from writing",
//       execute: () => {
//         editor.chain().focus().aiFixSpellingAndGrammar({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.LEARN_FROM_WRITING,
//     },
//     {
//       label: "Expand",
//       execute: () => {
//         editor.chain().focus().aiExtend({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.EXPAND,
//     },
//     {
//       label: "Shorten",
//       execute: () => {
//         editor.chain().focus().aiShorten({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.SHORTEN,
//     },
//     {
//       label: "Auto-complete",
//       execute: () => {
//         editor.chain().focus().aiComplete({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.AUTO_COMPLETE,
//     },
//     {
//       label: "Summarize",
//       execute: () => {
//         editor.chain().focus().aiSummarize({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.SUMMARIZE,
//     },
//     {
//       label: "Rephrase",
//       execute: () => {
//         editor.chain().focus().aiRephrase({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.REPHRASE,
//     },
//     {
//       label: "Add Emoji",
//       execute: () => {
//         editor.chain().focus().aiEmojify({ stream: true }).run();
//       },
//       shortcut: SHORTCUT_ACTIONS.ADD_EMOJI,
//     },
//     {
//       label: "Generate Image",
//       execute: () => {
//         editor
//           .chain()
//           .focus()
//           .aiImagePrompt({
//             modelName: "dall-e-3",
//             style: "photorealistic",
//             size: "256x256",
//             text: selectedText,
//           })
//           .run();
//       },
//       shortcut: SHORTCUT_ACTIONS.GENERATE_IMAGE,
//     },
//     {
//       label: "SEO Optimise",
//       execute: () => {
//         user?.id &&
//           activeWorkspace?.id &&
//           seoOptimise({
//             userId: `${activeWorkspace?.id}:${user?.id}`,
//             text: selectedText,
//           });
//       },
//       isLoading,
//       shortcut: SHORTCUT_ACTIONS.SEO_OPTIMISE,
//     },
//   ];

//   return (
//     <>
//       <Command
//         className="rounded-lg border shadow-md absolute w-72 h-fit top-[57px] right-8 z-20 bg-black"
//         ref={textCommandRef}
//       >
//         <CommandInput
//           placeholder="Type a command or search..."
//           className="commandInput"
//         />
//         <CommandList>
//           <CommandEmpty>No results found.</CommandEmpty>
//           <CommandGroup>
//             <ScrollArea className="h-[250px]">
//               <>
//                 {commands.map((command, index) => (
//                   <CommandItem
//                     key={index}
//                     className=""
//                     onSelect={() => {
//                       if (selectedText) {
//                         handleCreateTokens();
//                         command.execute();
//                       } else {
//                         return toast.custom((t) => (
//                           <ErrorToast
//                             t={t}
//                             title=""
//                             description="Please select some text to use this command"
//                           />
//                         ));
//                       }
//                     }}
//                   >
//                     {command.label}
//                     <CommandShortcut>
//                       <RenderShortCut shortCut={command.shortcut} />
//                     </CommandShortcut>
//                   </CommandItem>
//                 ))}
//                 <CommandItem
//                   onSelect={() => {
//                     handleCreateTokens();
//                     setIsPlagiraismDetectionDialogOpen(true);
//                   }}
//                 >
//                   Plagiarism Detection
//                   <CommandShortcut>
//                     <RenderShortCut
//                       shortCut={SHORTCUT_ACTIONS.PLAGIARISM_DETECTION}
//                     />
//                   </CommandShortcut>
//                 </CommandItem>
//               </>
//             </ScrollArea>
//           </CommandGroup>
//         </CommandList>
//       </Command>
//       {isPlagiarismDetectionDialogOpen && (
//         <PlagiarismDetection
//           isOpen={isPlagiarismDetectionDialogOpen}
//           setOpen={setIsPlagiraismDetectionDialogOpen}
//           editor={editor}
//         />
//       )}
//     </>
//   );
// }
