import { useAtom } from "jotai";
import { Bold, ChevronDown, Code, Italic, Loader2, Strikethrough, Underline } from "lucide-react";
import { TextOptions } from "~/lib/extension-ai";
import { BubbleMenu, Editor } from "@tiptap/react";
import { refetchTrigger } from "~/atoms";
import { Button } from "~/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { MODEL_TYPE, modelTypeAtom } from "~/atoms";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import Image from "next/image";
import NewLinkPopoverModel from "./NewLinkPopoverModel";
import NewBubbleTextListPopover from "./NewBubbleTextListPopover";
import useWriteContent from "~/hooks/misc/useWriteContent";
import { useXWAlert } from "~/components/reusable/xw-alert";
// import { createTokens } from "~/services/openMeter";


export default function NewEditorBubbleMenu({
    editor,
    selectedText,
    options,
    isLoading,
}: {
    editor: Editor;
    selectedText: string;
    options: TextOptions;
    isLoading: boolean;
}) {
    const { user } = useUser();
    const { organization } = useOrganization();
    const [modelType, setModelType] = useAtom(modelTypeAtom);
    // const { data: activeWorkspace } = useGetActiveSpace();
    const { organization: activeWorkspace } = useOrganization();
    const { mutate: writeContent, isPending: isWriting } = useWriteContent(
        editor,
        user?.id || "",
        activeWorkspace?.id || ""
    );
    const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
    const [isOpen, setIsOpen] = useState(false);
    const { showToast } = useXWAlert();

    if (!editor) return null;

    // Prevent showing the BubbleMenu on images


    const toggleRefetchTokenUsage = () => {
        setTimeout(() => {
            setRefetchTokenUsage((prev) => !prev);
        }, 10_000);
    };

    const handleGenerateContent = () => {
        console.log("calledd!");
        writeContent({ prompt: selectedText, model: modelType });

        editor.commands.selectTextblockEnd();
        toggleRefetchTokenUsage();
    };

    const handleCreateTokens = () => {
        const text = selectedText;

        let tokens = 0;

        // Calculate tokens based on the model type
        if (modelType === MODEL_TYPE.CHAT_GPT) {
            tokens = text.length / 2;
        } else if (modelType === MODEL_TYPE.WIZARD) {
            tokens = text.length / 4;
        }

        console.log("consumed in the bubblemenu: ", tokens);
        if (organization) {
            // createTokens(tokens, organization.id).catch((err: any) => {
            //     console.log(err)
            //     // showToast({
            //     //     title: "Error",
            //     //     message: `Error: ${err}`,
            //     //     variant: "error",
            //     // })
            // });

            toggleRefetchTokenUsage();
        }
    };

    if (!user) return;
    const commands = [
        {
            label: "Autopilot",
            execute: () => {
                editor.chain().focus().aiComplete(options).run();
            },
        },
        {
            label: "Summarize",
            execute: () => {
                editor.chain().focus().aiSummarize({ stream: true }).run();
            },
        },
        {
            label: "Grammify",
            execute: () => {
                editor.chain().focus().aiFixSpellingAndGrammar({ stream: true }).run();
            },
        },
        {
            label: "Rephrase",
            execute: () => {
                editor.chain().focus().aiRephrase({ stream: true }).run();
            },
        },
        {
            label: "Emojify",
            execute: () => {
                editor.chain().focus().aiEmojify({ stream: true }).run();
            },
        },
        {
            label: "Generate",
            execute: () => handleGenerateContent(),
        },
    ];

    const commands2 = [
        {
            label: <Bold className="h-4 w-4" />,
            execute: () => editor?.chain().focus().toggleBold().run(),
            isActive: () => editor?.isActive("bold"),
        },
        {
            label: <Italic className="h-4 w-4" />,
            execute: () => editor?.chain().focus().toggleItalic().run(),
            isActive: () => editor?.isActive("italic"),
        },
        {
            label: <Underline className="h-4 w-4" />,
            execute: () => editor?.chain().focus().toggleUnderline().run(),
            isActive: () => editor?.isActive("underline"),
        },
        {
            label: <Strikethrough className="h-4 w-4" />,
            execute: () => editor?.chain().focus().toggleStrike().run(),
            isActive: () => editor?.isActive("strike"),
        },
        {
            label: <Code className="h-4 w-4" />,
            execute: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor?.isActive("code"),
        },
    ];

    return (
        <BubbleMenu
            className="flex gap-2 rounded-lg border border-xw-secondary p-1 shadow-md bg-xw-sidebar w-fit xw-scrollbar"
            tippyOptions={{
                duration: 100,
            }}
            editor={editor}
        >
            <div className="m-1 flex items-start gap-1 w-full">
                {/* AI commands dropdown */}
                <div className="relative">
                    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="gap-2 w-40 justify-start bg-xw-disabled">
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Image
                                        src={"/icons/chatmagic.svg"}
                                        height={16}
                                        width={16}
                                        alt="ChatMagic"
                                    />
                                )}

                                Ask With AI
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="flex flex-col z-[9999] border border-xw-border rounded-lg p-1 w-40"
                            align="start"
                        >
                            {commands.map((command, index) => (
                                <Button
                                    key={index}
                                    onClick={() => {
                                        if (options) {
                                            handleCreateTokens();
                                            command.execute();
                                            setIsOpen(false);
                                        }
                                    }}
                                    variant={isWriting ? "secondary" : "ghost"}
                                    className="justify-start hover:bg-xw-secondary active:bg-xw-secondary/80 transition-colors duration-200"
                                >
                                    {command.label}
                                </Button>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>


                <NewBubbleTextListPopover editor={editor} />

                {/* <NewEditorTextColor editor={editor} /> */}
                {/* Text formatting buttons */}
                {commands2.map((command, index) => (
                    <Button
                        key={index}
                        variant={command.isActive() ? "secondary" : "ghost"}
                        size={"icon"}
                        onClick={() => command.execute()}
                    >
                        {command.label}
                    </Button>
                ))}

                <NewLinkPopoverModel
                    editor={editor}
                />

            </div>
        </BubbleMenu >
    );
}

