// import React, { useState } from "react";
// import { Editor } from "@tiptap/react";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Clock, Delete, Preview } from "@/icons/Figma";
// import { Button } from "@/components/ui/button";
// import { useAtom, useAtomValue } from "jotai";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/utils/utils";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { hasChangesInDocAtom, documentVersionsAtom } from "@/atoms";
// import { CollabHistoryVersion } from "@tiptap-pro/extension-collaboration-history";
// import { ErrorToast, SuccessToast } from "@/components/ui/custom-toast";
// type VersionProps = {
//   editor: Editor;
// };

// export default function VersionDialog({ editor }: VersionProps) {
//   const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
//   const [hasChangesIndoc, setHasChangesInDoc] = useAtom(hasChangesInDocAtom);
//   const versions = useAtomValue(documentVersionsAtom);
//   const isVersioningEnabled = editor.storage.collabHistory?.versioningEnabled
//     ? "Enabled"
//     : "Disabled";

//   const toggleAutoVersioning = (val: string) => {
//     if (val === "Enabled") {
//       const res = editor.commands.toggleVersioning();
//       if (res) {
//         toast.custom((t) => (
//           <SuccessToast t={t} title="" description="Auto versioning enabled" />
//         ));
//       }
//     } else {
//       const res = editor.commands.toggleVersioning();
//       if (res) {
//         toast.custom((t) => (
//           <SuccessToast t={t} title="" description="Auto versioning Disabled" />
//         ));
//       }
//     }
//   };
//   const saveVersion = () => {
//     if (!hasChangesIndoc) {
//       toast.custom((t) => (
//         <ErrorToast t={t} title="" description="No changes to save!" />
//       ));
//       return;
//     }
//     const res = editor.commands.saveVersion();
//     if (res) {
//       setHasChangesInDoc(false);
//       toast.custom((t) => (
//         <SuccessToast t={t} title="" description="Version saved" />
//       ));
//     } else {
//       toast.custom((t) => (
//         <ErrorToast t={t} title="" description="version not saved" />
//       ));
//     }
//     setIsVersionDialogOpen(false);
//   };

//   const restoreVersion = (version: CollabHistoryVersion) => {
//     const res = editor.commands.revertToVersion(version.version);
//     if (res) {
//       toast.custom((t) => (
//         <SuccessToast t={t} title="" description="Version restored" />
//       ));
//     }
//     setIsVersionDialogOpen(false);
//   };

//   return (
//     <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
//       <DialogTrigger asChild>
//         <Button variant="gradient">
//           <Clock />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader className="space-y-0 relative z-50">
//           <DialogTitle className="flex items-center gap-2 ">
//             <Clock />
//             Version History
//           </DialogTitle>
//         </DialogHeader>

//         <div className="relative z-50">
//           <div className="w-full flex items-center justify-between">
//             <div className="">Auto Versioning</div>
//             <Select
//               onValueChange={toggleAutoVersioning}
//               value={isVersioningEnabled}
//             >
//               <SelectTrigger className="w-[200px]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem
//                     value="Enabled"
//                     className={cn(
//                       isVersioningEnabled === "Enabled" && "selected-item"
//                     )}
//                   >
//                     Enabled
//                   </SelectItem>
//                   <SelectItem
//                     value="Disabled"
//                     className={cn(
//                       isVersioningEnabled === "Disabled" && "selected-item"
//                     )}
//                   >
//                     Disabled
//                   </SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="w-full flex items-center justify-between dark-glass p-4 my-5 rounded-[12px] relative z-50">
//             <div className="">Create Version</div>
//             <Button
//               variant="transparent"
//               className="bg-black px-6 py-4 hover:hovered-item"
//               onClick={saveVersion}
//             >
//               Save current version
//             </Button>
//           </div>
//         </div>

//         <div className="">Document Versions</div>

//         <ScrollArea className="p-4 rounded-[8px] dark-glass relative z-50 h-[200px]">
//           {versions.length > 0
//             ? [...versions]
//                 .reverse()
//                 .map((version) => (
//                   <SingleVersionHistory
//                     version={version}
//                     key={version.version}
//                     restoreVersion={restoreVersion}
//                   />
//                 ))
//             : null}
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }

// const SingleVersionHistory = ({
//   version,
//   restoreVersion,
// }: {
//   version: CollabHistoryVersion;
//   restoreVersion: (version: CollabHistoryVersion) => void;
// }) => {
//   return (
//     <>
//       <div className="flex border border-transparent items-center justify-between p-2 hover:hovered-item rounded-[8px]">
//         <div className="">Version {version.version}</div>
//         <div className="flex items-center justify-between gap-3">
//           <button onClick={() => restoreVersion(version)}>
//             <Preview />
//           </button>
//         </div>
//       </div>
//       <div className="sidebar-seperator rounded-lg w-full h-[1px]" />
//     </>
//   );
// };
