import React, { KeyboardEvent, useState } from "react";
import { Input } from "~/components/ui/input";
import { SendMessageIcon } from "~/icons";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Messages } from "~/types";
import { useMutation } from "@tanstack/react-query";
import { AudioProjectChat } from "@prisma/client";
import { refetchTrigger } from "~/atoms";
import { useAtom } from "jotai";
import { trpc } from "~/trpc/react";
import { useDocumentId } from "~/hooks/editor/useDocumentId";
import { ErrorToast } from "../../custom-toast";
import { useUpdateChat } from "./useUpdateChat";
import { useOrganization, useUser } from "@clerk/nextjs";
interface MessageInputProps {
  // scrollIntoView: () => void;
  context: string;
  messages: AudioProjectChat[];
}

const MessageInput = ({
  // scrollIntoView,
  context,
  messages,
}: MessageInputProps) => {
  const [input, setInput] = useState<string>("");
  const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
  const documentId = useDocumentId();
  const { mutate: updateChat } = useUpdateChat();
  const { user } = useUser();

  const { organization: activeWorkspace, isLoaded: isWorkspaceFetching } =
    useOrganization();
  const { mutate: handleSend, isPending } = useMutation({
    mutationFn: async (payload: {
      messages: AudioProjectChat[];
      context: string;
    }) => {
      if (!isWorkspaceFetching) return;
      setInput(""); // Clear the input after sending the message given that the response was successful

      const paymentId = `${activeWorkspace?.id}:${user?.id}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/chatbot/xmail-chatbot`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: paymentId,
            sessionId: documentId,
            avatarId: "wizard",
            mode: "Normal",
            query: payload?.messages[0]?.content as string,
            messages: payload.messages,
            role: "user",
            mailContext: { body: payload.context },
          }),
        },
      );
      console.log(res.body, "sent materials");
      if (!res.ok) {
        throw Error(`Error in Generating Response`);
      }
      return res.body;
    },
    onSuccess: async (stream) => {
      if (!stream || stream === null) {
        toast.error("Error generating the response");
      } else {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const loopRunner = true;
        const generationId = crypto.randomUUID();
        let scrollCount = 0;
        let ans = "";

        // scrollIntoView();
        while (loopRunner) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const decodedChunk = decoder.decode(value, { stream: true });
          ans += decodedChunk;
          const systemMessage: Messages = {
            id: generationId,
            content: ans,
            created: new Date().toISOString(),
            role: "ai",
          };
          scrollCount += 1;
        }

        updateChat({
          chat: {
            content: ans,
            role: "ai",
            recId: documentId as string,
          },
        });
      }
    },
    onSettled: () => {
      setRefetchTokenUsage((prev) => !prev);
    },
    onError: () => {
      toast.error("Error generating the response");
      return;
    },
  });

  const handleMessageSend = () => {
    if (input.length === 0) {
      return;
    } else if (input.length > 1000) {
      toast.custom((t) => (
        <ErrorToast t={t} title="" description="Message is too long" />
      ));
      return;
    }
    const userQuery: AudioProjectChat = {
      id: crypto.randomUUID(),
      content: input,
      createdAt: new Date().toISOString() as any,
      role: "user",
      audioProjectId: documentId as string,
    };
    updateChat({
      chat: {
        content: userQuery.content,
        role: "user",
        recId: documentId as string,
      },
    });
    handleSend({ messages: [...messages, userQuery], context });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Ask me anything about this recording..."
        className="my-2 h-full w-full rounded-xl border-gray-500 bg-xw-background p-3 px-4 text-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button
        disabled={input.length === 0}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {isPending ? (
          <Loader className="h-3 w-3 animate-spin" />
        ) : (
          <SendMessageIcon onClick={handleMessageSend} />
        )}
      </button>
    </div>
  );
};

export default MessageInput;
