// import useGetEditor from "@/hooks/editor/useGetEditor";
// import { useMemo, useEffect, useState } from "react";
// import "./styles.css";
// import * as Y from "yjs";
// import TextContainer from "./TextContainer";
// import TextToolbar from "./Toolbar/TextToolbar";
// import { useSpacePermissions } from "@/hooks/space/useSpacePermissions";
// import {
//   editorObject,
//   editorState,
//   hasChangesInDocAtom,
//   selectedPromptAtom,
//   selectedToolAtom,
//   selectedToolTitleAtom,
// } from "@/atoms";
// import { useAtom, useSetAtom } from "jotai";
// import { Document } from "@prisma/client";
// import { useUser } from "@/hooks/useUser";
// import { ThreadsProvider } from "./Sidebar/RightSidebar/Threads/context";
// import {
//   useDeleteThread,
//   useOnHoverThread,
//   useOnLeaveThread,
//   useResolveThread,
//   useSelectThreadInEditor,
//   useUnresolveThread,
//   useUpdateComment,
//   useThreads,
// } from "@/hooks/editor/thread";
// import { useEnableAutoVersioning } from "@/hooks/useEnableAutoVersioning";
// import RightSidebar from "./Sidebar/RightSidebar";
// import { useOrganization } from "@clerk/nextjs";
// import { TiptapCollabProvider } from "@hocuspocus/provider";
// // import RegenerateInput from "../ContentGen/RegenerateInput";
// import { socialMediaPostPreviewTitles } from "@/lib/constant/content-gen/social-media-post-preview-titles";
// // import PreviewPost from "../ContentGen/PreviewPost";
// import { trpc } from "@/app/_trpc/client";
// interface TextEditorPageProps {
//   doc: Y.Doc;
//   provider: TiptapCollabProvider;
//   name: string;
//   documentId: string;
//   currentDocument: Document;
//   isForContentGen?: boolean;
// }
// const TextEditorPage = ({
//   doc,
//   provider,
//   name,
//   documentId,
//   currentDocument,
//   isForContentGen,
// }: TextEditorPageProps) => {
//   const { data: user } = useUser();
//   const [selectedTool] = useAtom(selectedToolAtom);
//   const [selectedPrompt] = useAtom(selectedPromptAtom);
//   const [selectedToolTitle, setSelectedToolTitle] = useAtom(
//     selectedToolTitleAtom,
//   );
//   const { organization } = useOrganization();

//   const { data: document } = trpc.document.getDocById.useQuery({
//     id: currentDocument?.id,
//   });

//   const { data: prompt } = trpc.prompt.getPromptById.useQuery({
//     id: document?.promptId!,
//   });

//   const { canWrite } = useSpacePermissions({
//     organizationId: "org_2pxyYU0gpqhfg24cwgXXLo7pGyt",
//   });
//   const hasWriteAccess = useMemo(() => {
//     if (currentDocument?.access === "READ" || !canWrite) return false;
//     return true;
//   }, [currentDocument, canWrite]);
//   const { editor, options, tiptapAIResponseLoading, selectedText } =
//     useGetEditor({
//       provider,
//       doc,
//       documentId,
//       name,
//       hasWriteAccess,
//     });

//   const setEditorReady = useSetAtom(editorState);
//   const setEditor = useSetAtom(editorObject);
//   const setHasChangesInDoc = useSetAtom(hasChangesInDocAtom);
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
//     if (editor && user) {
//       timeoutId = setTimeout(() => {
//         setEditorReady(true);
//         setEditor(editor);
//       }, 2000);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [editor, user, setEditorReady, setEditor]);
//   useEffect(() => {
//     const onUpdate = () => {
//       setHasChangesInDoc(true);
//     };

//     const onSynced = () => {
//       doc.on("update", onUpdate);
//     };

//     provider.on("synced", onSynced);

//     return () => {
//       provider.off("synced", onSynced);
//       doc.off("update", onUpdate);
//     };
//   }, [doc, provider, setHasChangesInDoc]);

//   const { threads } = useThreads(provider, editor);
//   const selectThreadInEditor = useSelectThreadInEditor(editor);
//   const deleteThread = useDeleteThread(provider, editor);
//   const resolveThread = useResolveThread(editor);
//   const unresolveThread = useUnresolveThread(editor);
//   const updateComment = useUpdateComment(editor);
//   const onHoverThread = useOnHoverThread(editor);
//   const onLeaveThread = useOnLeaveThread(editor);
//   const selectedThreads = editor?.storage.comments.focusedThreads;
//   useEnableAutoVersioning(documentId, editor);

//   const [isSocialMediaPostPreview, setIsSocialMediaPostPreview] =
//     useState(true);

//   return (
//     <ThreadsProvider
//       threads={threads}
//       selectedThreads={selectedThreads}
//       onClickThread={selectThreadInEditor}
//       onDeleteThread={deleteThread}
//       onResolveThread={resolveThread}
//       onUnresolveThread={unresolveThread}
//       onUpdateComment={updateComment}
//       onHoverThread={onHoverThread}
//       onLeaveThread={onLeaveThread}
//     >
//       <div className={`grid grid-cols-5 gap-5 h-full `}>
//         <div
//           className={`${isForContentGen && !isSocialMediaPostPreview ? "col-span-5" : "col-span-3"} relative overflow-hidden editorContentScreen `}
//         >
//           <div className=" border border-white border-opacity-20 rounded-[16px] h-[95vh] mb-40">
//             <div className="absolute top-4  h-[90vh]  right-4 left-4 p-4 rounded-[10px] border border-white border-opacity-20 editorContent z-10  ">
//               {hasWriteAccess && (
//                 <TextToolbar
//                   editor={editor}
//                   selectedText={selectedText}
//                   currentDocument={currentDocument}
//                 />
//               )}
//               <TextContainer
//                 isLoading={tiptapAIResponseLoading}
//                 editor={editor}
//                 selectedText={selectedText}
//                 options={options}
//                 isEditable={editor?.isEditable}
//               />
//             </div>
//           </div>
//         </div>
//         {isForContentGen && (
//           <div className="fixed bottom-4 w-[50%] mx-auto z-50">
//             {/* <RegenerateInput
//               promptId={selectedTool}
//               doc={doc}
//               provider={provider}
//               name={name}
//               documentId={documentId}
//               currentDocument={currentDocument}
//             /> */}
//           </div>
//         )}
//         {socialMediaPostPreviewTitles.includes(prompt?.promptTitle!) ? (
//           <div className="col-span-2 mb-8">
//             {/* <PreviewPost
//               editor={editor}
//               documentId={documentId}
//               postImages={[
//                 "https://images.unsplash.com/photo-1719937206491-ed673f64be1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D",
//                 "https://images.unsplash.com/photo-1720048169707-a32d6dfca0b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//               ]}
//               postDescription="Nature has a way of speaking to our souls, reminding us to slow down and appreciate the beauty that surrounds us. From towering trees to calming rivers, every moment in the wilderness feels like a gentle reminder to stay grounded. 🌿🍃 Embrace the serenity and find peace in the wild. 🌍 #NatureLovers"
//             /> */}
//           </div>
//         ) : (
//           <div className="col-span-2 mb-8">
//             <RightSidebar
//               editor={editor}
//               document={currentDocument}
//               provider={provider}
//               hasWriteAccess={hasWriteAccess}
//             />
//           </div>
//         )}
//       </div>
//     </ThreadsProvider>
//   );
// };

// export default TextEditorPage;
