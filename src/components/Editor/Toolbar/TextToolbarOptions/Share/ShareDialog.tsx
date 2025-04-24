// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import CollaboratorList from "@/components/Editor/Toolbar/TextToolbarOptions/Share/CollaboratorList";
// import CollaboratorForm from "@/components/Editor/Toolbar/TextToolbarOptions/Share/CollaboratorForm";
// import { Profile } from "@/icons/Figma";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// export default function ShareDialog({
// 	currentDocument,
// }: {
// 	currentDocument: any;
// }) {
// 	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
// 	return (
// 		<Dialog
		
// 			open={isShareDialogOpen}
// 			onOpenChange={() => {
// 				setIsShareDialogOpen(!isShareDialogOpen);
// 			}}
// 		>
// 			<DialogTrigger asChild>
// 				<Button variant="gradient">
// 					<Profile />
// 				</Button>
// 			</DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader className="relative z-50">
// 					<DialogTitle className="flex items-center gap-2">
// 						<Profile /> User Access
// 					</DialogTitle>
// 				</DialogHeader>
// 				<CollaboratorForm
// 					title={currentDocument.title}
// 					redirectId={currentDocument.id}
// 				/>
// 				<CollaboratorList id={currentDocument.id} />
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
