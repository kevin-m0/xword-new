// "use client";
// import { Editor } from "@tiptap/react";
// import { Document } from "@prisma/client";

// import { useSetAtom, useAtom } from "jotai";
// import { useState, useCallback } from "react";

// import { currentDocumentVersionIdAtom, SIDEBARVIEWENUM } from "@/atoms";
// import { Button } from "@/components/ui/button";
// import { Redo, Thunder, Undo } from "@/icons/Figma";
// import { useAiCommandShortCut } from "@/hooks/editor/useAiCommandShortCut";
// import { useOpenCommandPaletteShortcut } from "@/hooks/editor/useOpenCommandPalette";
// import ColorPicker from "./TextToolbarOptions/ColorPicker";
// import TextFormat from "./TextToolbarOptions/TextFormat";
// import ListType from "./TextToolbarOptions/ListType";
// import Download from "./TextToolbarOptions/Download";
// import Attachment from "./TextToolbarOptions/Attachment";
// import TextAlignment from "./TextToolbarOptions/TextAlignment";
// import TextSize from "./TextToolbarOptions/TextSize";
// import ShareDialog from "./TextToolbarOptions/Share/ShareDialog";
// import CommandsAI from "./TextToolbarOptions/Command";
// import VersionDialog from "./TextToolbarOptions/VersionDialog";
// import BrandVoiceDialog from "./TextToolbarOptions/Brand Voice/EditorBrandVoiceDialog";
// import EditorBrandVoiceDropdown from "./TextToolbarOptions/Brand Voice/EditorBrandVoiceDropdown";

// const TextToolbar = ({
//   editor,
//   selectedText,
//   currentDocument,
// }: {
//   editor: Editor;
//   selectedText: string;
//   currentDocument: Document | undefined;
// }) => {
//   const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);

//   const toggleTextCommand = useCallback(() => {}, []);

//   useOpenCommandPaletteShortcut(toggleTextCommand);
//   useAiCommandShortCut(editor);

//   return (
//     <div className="p-2 rounded-[10px] border border-white border-opacity-20 bg-black bg-opacity-50 flex flex-row items-center justify-center gap-2 z-10 flex-wrap">
//       <div className="flex items-center justify-between gap-1">
//         <Button
//           variant="transparent"
//           onClick={() => {
//             editor.commands.undo();
//           }}
//           disabled={!editor?.can().undo()}
//         >
//           <Undo />
//         </Button>
//         <Button
//           variant="transparent"
//           onClick={() => {
//             editor.commands.redo();
//           }}
//           disabled={!editor?.can().redo()}
//         >
//           <Redo />
//         </Button>
//         <TextSize editor={editor} />
//         <TextAlignment editor={editor} />
//         <ColorPicker editor={editor} />
//         <TextFormat editor={editor} />
//         <ListType editor={editor} />
//         <Attachment editor={editor} />
//         <Download
//           editor={editor}
//           title={currentDocument?.title ?? "Untitled Document"}
//         />
//       </div>
//       <div className="flex items-center justify-between gap-1">
//         <Button
//           variant="gradient"
//           onClick={() => setIsCommandDialogOpen((prev) => !prev)}
//           className="flex items-center justify-between gap-1"
//         >
//           <Thunder /> Commands
//         </Button>
//         <ShareDialog currentDocument={currentDocument} />
//         <EditorBrandVoiceDropdown />
//         {editor && <VersionDialog editor={editor} />}
//         {isCommandDialogOpen && (
//           <CommandsAI
//             editor={editor}
//             setIsOpen={setIsCommandDialogOpen}
//             selectedText={selectedText}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TextToolbar;
