'use client';
import React, { useEffect, useState } from "react";
// import { SendMessageIcon } from "@/icons";
import { toast } from "sonner";
import { Chat } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useUpdateChat } from "./useUpdateChat";
import { Button } from "~/components/ui/button";
// import { useGetActiveSpace } from "../../../../_hooks/workspace/useGetActiveSpace";
import { useAtom } from "jotai";
// import { selectedSuggestionAtom } from "@/app/(site)/(dashboard)/_atoms/writerXAtoms";
import axios from "axios";
import { marked } from "marked";
import { trpc } from "~/trpc/react";
import { SendMessageIcon } from "~/icons";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { selectedSuggestionAtom } from "~/atoms/writerXAtoms";
// import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { useOrganization } from "@clerk/nextjs";

interface MessageInputProps {
    context: string;
    messages: Chat[];
    id: string;
    moveDown: boolean;
    setMoveDown: (value: boolean) => void;
}

const ChatMessageInput = ({ context, messages, id, moveDown, setMoveDown }: MessageInputProps) => {
    const [prompt, setPrompt] = useAtom(selectedSuggestionAtom);
    const [input, setInput] = useState<string>(prompt);
    const { showToast } = useXWAlert();
    const { mutate: updateChat } = useUpdateChat({ documentId: id });
    const { data: user } = trpc.user.getCurrentLoggedInUser.useQuery();

    useEffect(() => {
        setInput(prompt);
    }, [prompt]);


    const { organization: activeWorkspace } = useOrganization();
    const { mutate: handleSend, isPending } = useMutation({
        mutationFn: async (payload: { messages: Chat[]; context: string }) => {

            const paymentId = `${activeWorkspace?.id}:${user?.id}`;


            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/xmail-chatbot`,
                {
                    userId: paymentId,
                    sessionId: "1",
                    last_messages: payload.messages,
                    mailContext: { context: payload.context },
                    query: input,
                    mode: "Normal",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
                    },
                }
            );
            if (!res.data) {
                updateChat({
                    chat: {
                        content: "Something Went wrong please try again",
                        role: "ai",
                        docId: id,
                    },
                });

                return;
            }
            return res.data;
        },
        onSuccess: async (response) => {
            setInput("");

            // Resolve the response and convert to string
            const markdownContent = await (async () => {
                if (typeof response?.response === "string") return response.response;
                if (response?.response instanceof Promise) return await response.response;
                return "Seems like something went wrong";
            })();

            // Convert Markdown to plain text
            const plainText = marked(markdownContent) as string;

            updateChat({
                chat: {
                    content: plainText.replace(/<\/?[^>]+(>|$)/g, ""),
                    role: "ai",
                    docId: id,
                },
            });
            setTimeout(() => {
                setMoveDown(true);
            }, 2000)
        },
        onError: (error: any) => {
            showToast({
                title: "Error",
                message: error.message || "An error occurred while generating the response.",
                variant: "error",
            });
            updateChat({
                chat: {
                    content: "Something went wrong. Please try again.",
                    role: "system",
                    docId: id,
                },
            });
        },
    });

    const handleMessageSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (input.length > 1000) {
            toast.error("Message is too long");
            return;
        }

        const userQuery: Chat = {
            id: crypto.randomUUID(),
            content: input,
            created: new Date(),
            role: "user",
            documentId: id,
        };

        updateChat({
            chat: {
                content: userQuery.content,
                role: "user",
                docId: id,
            },
        });
        handleSend({ messages: [...messages, userQuery], context });
    };

    return (
        <div className="sticky bottom-0 py-4 border-t border-xw-secondary">
            <form onSubmit={handleMessageSend} className="relative bg-xw-background rounded-lg border border-xw-border p-2 min-h-[100px]">
                <textarea
                    className="w-full h-full resize-none border-0 bg-transparent focus:ring-0 outline-none"
                    placeholder="Ask a question or make a request..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2"
                    type="submit"
                    disabled={isPending}
                >
                    <SendMessageIcon className="h-4 w-4" />
                </Button>
            </form>
            <p className="text-center text-sm text-xw-muted mt-2">
                ChatSonic can make mistakes. Check important info.
            </p>
        </div>
    );
};

export default ChatMessageInput;