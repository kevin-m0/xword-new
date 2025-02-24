// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import React from "react";
// import AiContainer from "./AiContainer";
// import { Editor } from "@tiptap/react";
// import { Document } from "@prisma/client";
// import Threads from "./Threads";

// export default function RightSidebar({
//   editor,
//   document,
//   provider,
//   hasWriteAccess,
// }: {
//   editor: Editor;
//   document: Document;
//   provider: any;
//   hasWriteAccess: boolean;
// }) {
//   return (
//     <>
//       {hasWriteAccess ? (
//         <Tabs defaultValue="ai">
//           <div className="w-full flex items-center justify-center">
//             <TabsList>
//               <TabsTrigger value="ai" className="w-[100px] ">
//                 AI Section
//               </TabsTrigger>
//               <TabsTrigger value="comments" className="w-[100px]">
//                 Comments
//               </TabsTrigger>
//             </TabsList>
//           </div>
//           <TabsContent value="ai">
//             <AiContainer editor={editor} document={document} />
//           </TabsContent>
//           <TabsContent value="comments">
//             <Threads provider={provider} />
//           </TabsContent>
//         </Tabs>
//       ) : (
//         <Tabs defaultValue="comments" className="">
//           <div className="w-full flex items-center justify-center">
//             <TabsList>
//               <TabsTrigger value="comments" className="w-[100px]">
//                 Comments
//               </TabsTrigger>
//             </TabsList>
//           </div>
//           <TabsContent value="comments">
//             <Threads provider={provider} />
//           </TabsContent>
//         </Tabs>
//       )}
//     </>
//   );
// }
