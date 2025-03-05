// import { useAtom } from "jotai";
// import { Ghost, Loader } from "lucide-react";
// import { EditorContent, Editor } from "@tiptap/react";
// import { TextOptions } from "@/lib/extension-ai";

// import { yjsProviderLoading } from "@/atoms";
// import BubbleMenu from "./Toolbar/BubbleMenu";
// import { ScrollArea } from "@/components/ui/scroll-area";

// const TextContainer = ({
//   editor,
//   selectedText,
//   options,
//   isLoading,
//   isEditable,
// }: {
//   editor: Editor;
//   selectedText: string;
//   options: TextOptions;
//   isLoading: boolean;
//   isEditable: boolean;
// }) => {
//   // Getting loading state of Yjs provider from global context.
//   const [yjsLoading] = useAtom(yjsProviderLoading);

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const content = e.dataTransfer.getData("text/plain");
//     const imageUrl = e.dataTransfer.getData("text/uri-list");
//     if (imageUrl) {

//       editor.chain().focus().setImage({ src: imageUrl }).run();
//       return;
//     }
//     if (content) {
//       editor
//         .chain()
//         .focus("end")
//         .insertContentAt(editor.state.selection.anchor, content)

//         .run();
//       editor.commands.selectTextblockEnd();
//     }

//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();

//   };

//   return (
//     <div
//       className="h-[calc(100vh-240px)] mt-4"
//       onClick={() => {
//         isEditable && editor.commands.focus();
//       }}
//       // onDrop={handleDrop}
//       // onDragOver={handleDragOver}
//       style={{
//         overflow: "visible !important",
//       }}
//     >
//       {yjsLoading ? (
//         <div className="items-center justify-center flex h-full w-full pb-5">
//           <div>
//             <div className="flex items-center justify-center ">
//               <Ghost className="h-16 w-16 text-gray-400" />
//             </div>
//             <div className="flex items-center justify-center">
//               <Loader className="h-4 w-4 animate-spin mr-3" />
//               <span>Hold tight, loading your data!</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <ScrollArea
//           className="h-[calc(100vh-254px)]"
//           style={{ position: "static" }}
//         >
//           {editor && (
//             <BubbleMenu
//               editor={editor}
//               selectedText={selectedText}
//               options={options}
//               isLoading={isLoading}
//             />
//           )}
//           <EditorContent editor={editor} onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               editor.chain().setRootBlock().run();
//             }
//           }} />
//         </ScrollArea>
//       )}
//     </div>
//   );
// };

// export default TextContainer;
