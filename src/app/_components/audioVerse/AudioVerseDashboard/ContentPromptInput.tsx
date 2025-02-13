import React, { KeyboardEvent, useState } from "react";
import { SendMessageIcon } from "~/icons";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  contentInputAtom,
  contentResponseAtom,
  promptLoadingAtom,
  refetchTrigger,
} from "~/atoms";
import { useAtom } from "jotai";
import { trpc } from "~/trpc/react";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { ErrorToast } from "../../custom-toast";
import { Button } from "~/components/ui/button";
import { useUpdateChat } from "./useUpdateChat";

interface MessageInputProps {
  context: string;
  messages: ContentInput[];
}

export type ContentInput = {
  id: string;
  content: string;
  role: string;
  created: string;
};

const ContentPromptInput = ({ context, messages }: MessageInputProps) => {
  const [input, setInput] = useState<string>("");
  const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
  const { mutate: updateChat } = useUpdateChat();
  const { data: user } = trpc.user.getCurrentLoggedInUser.useQuery();
  const { data: activeWorkspace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();
  const [, setPromptLoading] = useAtom(promptLoadingAtom);
  const [, setContentResponse] = useAtom(contentResponseAtom);
  const [, setContentInput] = useAtom(contentInputAtom);

  const { mutate: handleSend, isPending } = useMutation({
    mutationFn: async (payload: {
      messages: ContentInput[];
      context: string;
    }) => {
      if (isWorkspaceFetching) return;

      setContentInput("");
      setContentResponse("");
      setPromptLoading(true);

      const paymentId = `${activeWorkspace?.id}:${user?.id}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/chat`,
        {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
          },
          body: JSON.stringify({
            userId: paymentId,
            messages: payload.messages,
            context: payload.context,
          }),
        },
      );
      if (!res.ok) {
        setPromptLoading(false);
        throw Error(`Error in Generating Response`);
      }
      return res.body;
    },
    onSuccess: async (stream) => {
      if (!stream || stream === null) {
        toast.custom((t) => (
          <ErrorToast
            t={t}
            title=""
            description="Error generating the response"
          />
        ));
      } else {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const loopRunner = true;
        const generationId = crypto.randomUUID();
        let scrollCount = 0;
        let ans = "";

        while (loopRunner) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const decodedChunk = decoder.decode(value, { stream: true });
          ans += decodedChunk;
          // const systemMessage: Messages = {
          //   id: generationId,
          //   content: ans,
          //   created: new Date().toISOString(),
          //   role: "system",
          // };
          scrollCount += 1;
        }
        setContentInput(input);
        setInput(""); // Clear the input after sending the message given that the response was successful
        setContentResponse(ans);
        setPromptLoading(false);
        // updateChat({
        //   chat: {
        //     content: ans,
        //     role: "system",
        //     recId: documentId,
        //   },
        // });
      }
    },
    onSettled: () => {
      setRefetchTokenUsage((prev) => !prev);
    },
    onError: () => {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title=""
          description="Error generating the response"
        />
      ));
      // scrollIntoView();
      // setInput(""); // Not clearing Input because of error in generating response
      // updateChat({
      //   chat: {
      //     content: "Error generating the response",
      //     role: "system",
      //     recId: documentId,
      //   },
      // });
      return;
    },
  });

  const handleMessageSend = () => {
    if (input.length === 0) {
      toast.error("Please enter a prompt");
    } else if (input.length > 1000) {
      toast.custom((t) => (
        <ErrorToast t={t} title="" description="Message is too long" />
      ));
      return;
    }
    const userQuery = {
      id: crypto.randomUUID(),
      content: input,
      created: new Date().toISOString() as any,
      role: "user",
    };

    // updateChat({
    //   chat: {
    //     content: userQuery.content,
    //     role: "user",
    //     recId: documentId,
    //   },
    // });

    handleSend({ messages: [...messages, userQuery], context });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  return (
    <div className="relative flex w-full items-center p-2">
      <input
        placeholder="What kind of content do you want to create?"
        className="h-full w-full border-none bg-transparent outline-none focus:outline-none focus:ring-0"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <Button
        variant={"ghost"}
        size={"sm"}
        disabled={input.length === 0}
        className="pr-2"
      >
        {isPending ? (
          <Loader className="h-3 w-3 animate-spin" />
        ) : (
          <SendMessageIcon
            className="cursor-pointer"
            onClick={handleMessageSend}
          />
        )}
      </Button>
    </div>
  );
};

export default ContentPromptInput;
