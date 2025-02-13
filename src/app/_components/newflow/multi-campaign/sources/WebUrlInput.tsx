// components/FlowContentSelection/components/WebUrlInput.tsx
"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { Check, Loader2 } from "lucide-react";
import { multiFlowPrompt, multiFlowTranscribe } from "~/atoms/multiFlow";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { trpc } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const WebUrlInput = () => {
  const [, setTranscript] = useAtom(multiFlowPrompt);
  const { showToast } = useXWAlert();
  const [url, setUrl] = useState("");
  const [isTranscribing, setIsTranscribing] = useAtom(multiFlowTranscribe);

  const { mutate: handleTranscribe, isPending } =
    trpc.writerx.handleTranscribe.useMutation({
      onSuccess(data) {
        setTranscript(data);
        setIsTranscribing(false);
      },
      onError(error) {
        setIsTranscribing(false);
        showToast({
          title: "Error",
          message: error.message,
          variant: "error",
        });
      },
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || url.trim().length < 3) return;
    setIsTranscribing(true);
    handleTranscribe({ url: url, type: "file" });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-row gap-2">
      <Input
        placeholder="https://example.com"
        onChange={(e) => setUrl(e.target.value)}
        value={url}
      />

      <div>
        <Button variant={"default"} disabled={isPending} size={"icon"}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default WebUrlInput;
