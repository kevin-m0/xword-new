// import { Editor } from "@tiptap/react";

// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrapeForm } from "./ScrapeUrlForm";
// import { Scrape } from "@/icons/Figma";

// type ScrapeDialogProps = {
// 	editor: Editor;
// 	isOpen: boolean;
// 	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const ScrapeDialog = ({ editor, isOpen, setIsOpen }: ScrapeDialogProps) => {
// 	return (
// 		<Dialog
// 			open={isOpen}
// 			onOpenChange={setIsOpen}
// 		>
// 			<DialogTrigger asChild></DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader className="space-y-0 relative z-50">
// 					<DialogTitle className="flex items-center gap-2 ">
// 						<Scrape />
// 						Scrape Text
// 					</DialogTitle>
// 					<DialogDescription className="text-center">
// 						Add URL to enable text scrapping from a website
// 					</DialogDescription>
// 				</DialogHeader>
// 				<div className="p-4 rounded-[12px] dark-glass relative z-50">
// 					<div className="w-full mb-5">
// 						<div className="text-[16px] leading-6 text-center pb-2">
// 							Add a URL
// 						</div>
// 						<div className="text-[14px] leading-5 text-center">
// 							WriteX will analyse the data
// 						</div>
// 					</div>
// 					<ScrapeForm
// 						closeModal={() => setIsOpen(false)}
// 						editor={editor}
// 					/>
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };

// export default ScrapeDialog;
