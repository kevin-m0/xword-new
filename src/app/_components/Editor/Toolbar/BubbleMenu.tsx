// import { toast } from "sonner";
// import { useAtom } from "jotai";
// import { Loader2 } from "lucide-react";
// import { TextOptions } from "@/lib/extension-ai";
// import { BubbleMenu as BubbleMenuTipTap, Editor } from "@tiptap/react";
// import { cn } from "@/utils/utils";
// import { refetchTrigger } from "@/atoms";
// import { Button } from "@/components/ui/button";
// import { createTokens } from "@/services/openmeter";
// import useWriteContent from "@/hooks/llm/useWriteContent";
// import CommentInputDialog from "../Sidebar/RightSidebar/Threads/CommentInputDialog";
// import { useUser } from "@/hooks/useUser";
// import { useGetActiveSpace } from "@/hooks/space/useGetActiveSpace";
// import { useOrganization } from "@clerk/nextjs";
// import { ErrorToast } from "@/components/ui/custom-toast";
// import { MODEL_TYPE, modelTypeAtom } from "@/atoms";

// import {
// 	Bold,
// 	ChevronDown,
// 	CodeBlock,
// 	Highlight,
// 	Italic,
// 	StrikeThrough,
// 	SubScript,
// 	SuperScript,
// 	Quote,
// 	Underline,
// } from "@/icons/Figma";
// import clsx from "clsx";
// import { useState } from "react";
// import DownArrowIcon from "@/icons/DownArrowIcon";

// export default function BubbleMenu({
// 	editor,
// 	selectedText,
// 	options,
// 	isLoading,
// }: {
// 	editor: Editor;
// 	selectedText: string;
// 	options: TextOptions;
// 	isLoading: boolean;
// }) {
// 	const [open, setOpen] = useState(false);
// 	const { data: user } = useUser();
// 	const { organization } = useOrganization();
// 	const [modelType, setModelType] = useAtom(modelTypeAtom);
// 	const { data: activeWorkspace } = useGetActiveSpace();
// 	const { mutate: writeContent, isLoading: isWriting } = useWriteContent(
// 		editor,
// 		user?.id || "",
// 		activeWorkspace?.id || ""
// 	);
// 	const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);

// 	const toggleRefetchTokenUsage = () => {
// 		setTimeout(() => {
// 			setRefetchTokenUsage((prev) => !prev);
// 		}, 10_000);
// 	};

// 	const handleGenerateContent = () => {
// 		console.log("calledd!");
// 		writeContent({ prompt: selectedText, model: modelType });

// 		editor.commands.selectTextblockEnd();
// 		toggleRefetchTokenUsage();
// 	};

// 	const handleCreateTokens = () => {
// 		const text = selectedText;

// 		let tokens = 0;

// 		// Calculate tokens based on the model type
// 		if (modelType === MODEL_TYPE.CHAT_GPT) {
// 			tokens = text.length / 2;
// 		} else if (modelType === MODEL_TYPE.WIZARD) {
// 			tokens = text.length / 4;
// 		}

// 		console.log("consumed in the bubblemenu: ", tokens);
// 		if (organization) {
// 			createTokens(tokens, organization.id).catch((err) => {
// 				toast.custom((t) => (
// 					<ErrorToast
// 						t={t}
// 						title=""
// 						description={`Error: ${err}`}
// 					/>
// 				));
// 			});

// 			toggleRefetchTokenUsage();
// 		}
// 	};

// 	if (!user) return;
// 	const commands = [
// 		{
// 			label: "Autopilot",
// 			execute: () => {
// 				editor.chain().focus().aiComplete(options).run();
// 			},
// 		},
// 		{
// 			label: "Summarize",
// 			execute: () => {
// 				editor.chain().focus().aiSummarize({ stream: true }).run();
// 			},
// 		},
// 		{
// 			label: "Grammify",
// 			execute: () => {
// 				editor.chain().focus().aiFixSpellingAndGrammar({ stream: true }).run();
// 			},
// 		},
// 		{
// 			label: "Rephrase",
// 			execute: () => {
// 				editor.chain().focus().aiRephrase({ stream: true }).run();
// 			},
// 		},
// 		{
// 			label: "Emojify",
// 			execute: () => {
// 				editor.chain().focus().aiEmojify({ stream: true }).run();
// 			},
// 		},
// 		{
// 			label: "Generate",
// 			execute: () => handleGenerateContent(),
// 		},
// 	];




// 	const commands2 = [
// 		{
// 			label: (
// 				<>
// 					<Bold />

// 				</>
// 			),
// 			execute: () => editor?.chain().focus().toggleBold().run(),
// 			isActive: () => editor?.isActive("bold"),
// 		},
// 		{
// 			label: (
// 				<>
// 					<Italic />

// 				</>
// 			),
// 			execute: () => editor?.chain().focus().toggleItalic().run(),
// 			isActive: () => editor?.isActive("italic"),
// 		},
// 		{
// 			label: (
// 				<>
// 					<Underline />

// 				</>
// 			),
// 			execute: () => editor?.chain().focus().toggleUnderline().run(),
// 			isActive: () => editor?.isActive("underline"),
// 		},
// 		{
// 			label: (
// 				<>
// 					<Highlight />

// 				</>
// 			),
// 			execute: () => editor?.chain().focus().toggleHighlight({ color: "#FFE066" }).run(),
// 			isActive: () => editor?.isActive("highlight"),
// 		},
// 		{
// 			label: (
// 				<>
// 					<StrikeThrough />

// 				</>
// 			),
// 			execute: () => editor?.chain().focus().toggleStrike().run(),
// 			isActive: () => editor?.isActive("strike"),
// 		},



// 		{
// 			label: (
// 				<>
// 					<CodeBlock />

// 				</>
// 			),
// 			execute: () => editor.chain().focus().toggleCodeBlock().run(),
// 			isActive: () => editor?.isActive("codeBlock"),
// 		},
// 	];




// 	return (
// 		<BubbleMenuTipTap
// 			editor={editor}
// 			tippyOptions={{ duration: 100 }}
// 			className={cn(isWriting ? "hidden z-30" : "z-30")}
// 		>
// 			<div className="p-[2px] flex  items-start w-fit rounded-[8px] shadow-md bg-black border border-black border-opacity-10">
// 				<div>

// 					{/* <Button
// 						onClick={() => setOpen(!open)}
// 						variant={"transparent"}
// 						className={`active:active-bubble-btn transition px-2 py-1 flex gap-2 justify-center items-center w-full`}
// 					>AI <ChevronDown className="w-4 h-4" /></Button> */}
// 					<button className="relative inline-flex h- overflow-hidden w-28  p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 h-10 rounded-l-md" onClick={() => setOpen(!open)}>
// 						<span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
// 						<span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-l-md  bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ">
// 							AI <ChevronDown className="w-4 h-4" />
// 						</span>
// 					</button>
// 					<div className={clsx("flex flex-col absolute top-11 bg-black rounded-md z-50", {
// 						"block": open,
// 						"hidden": !open,

// 					})}>
// 						{commands.map((command, index) => (


// 							<div
// 								key={index}

// 								onClick={() => {
// 									if (options) {
// 										setOpen(false);
// 										handleCreateTokens();
// 										command.execute();
// 									}
// 								}}
// 								className="active:active-bubble-btn  px-2 py-1 cursor-pointer hover:bg-slate-900 transition-all ease-in-out rounded-md text-base"
// 							>
// 								{command.label}
// 							</div>

// 						))}
// 					</div>
// 				</div>





// 				<Button
// 					variant={"transparent"}
// 					className={`active:active-bubble-btn transition px-2 py-1 rounded-none`}
// 				>
// 					<CommentInputDialog
// 						strategy="thread"
// 						user={user}
// 						editor={editor}
// 					>
// 						<span className="mr-1 flex text-nowrap">Create Thread</span>
// 					</CommentInputDialog>
// 				</Button>

// 				{commands2.map((command, index) => (
// 					<Button
// 						key={index}
// 						variant="transparent"
// 						onClick={() => {


// 							command.execute();

// 						}}
// 						className={`active:active-bubble-btn transition px-2 py-1 ${index === commands2.length - 1 ? "rounded-r-md" : "rounded-none"}`}
// 					>
// 						{command.label}
// 					</Button>
// 				))}





// 				{isLoading ? (
// 					<div className="mx-2 items-center justify-center flex mt-3">
// 						<Loader2 className="h-4 w-4 animate-spin" />
// 					</div>
// 				) : null}
// 			</div>
// 		</BubbleMenuTipTap >
// 	);
// }
