import { toast } from "sonner";
import { Editor } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";

import { ErrorToast } from "@/components/ui/custom-toast";
import { brandVoiceAtom, MODEL_TYPE } from "@/atoms";
import { useAtom } from "jotai";
import { useXWAlert } from "@/app/(site)/(dashboard)/_components/reusable/xw-alert";

const useWriteContent = (
  editor: Editor,
  userId: string,
  activeSpaceId: string
) => {
  const { showToast } = useXWAlert();
  const [brandVoice, _] = useAtom(brandVoiceAtom);
  return useMutation({
    mutationFn: async ({ prompt, model }: { prompt: string, model: MODEL_TYPE }) => {
      // const isSubscribed = await getIsSubscribed();
      const requestToken = process.env.NEXT_PUBLIC_LLM_TOKEN;
      console.log("before feetch for writeContent")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/write-content`,

        {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + requestToken,
          },
          body: JSON.stringify({
            userId: userId,
            prompt: prompt,
            words: "35",
            model: model,
            BrandVoice: brandVoice
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "There was a problem fetching content. Try after some time."
        );
      }
      return response.body;
    },
    onMutate: () => {
      editor.chain().focus().insertContent({ type: "reactComponent" }).run();
    },
    onSuccess: async (stream) => {
      if (!stream || stream === null) {
        showToast(
          {
            title: "Error",
            message: "There was a problem fetching content. Try after some time.",
            variant: "error",
          }
        );
      } else {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let accResponse = "";
        let isFirstChunk = true;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          accResponse += chunkValue;

          if (isFirstChunk) {
            editor
              .chain()
              .focus()
              .insertContent(`<p>${accResponse}</p>`, {
                parseOptions: { preserveWhitespace: true },
              })
              .run();
            isFirstChunk = false;
          } else {
            editor.commands.insertContent(chunkValue, {
              parseOptions: { preserveWhitespace: true },
            });
          }
        }
      }
    },
    onError: () => {
      const from = editor.$pos(editor.state.selection.$anchor.pos).from - 1;
      const to = editor.$pos(editor.state.selection.$anchor.pos).to;
      editor.commands.deleteRange({ from, to });
    },
  });
};

export default useWriteContent;
