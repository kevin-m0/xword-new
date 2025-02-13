"use client";

import React, { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Check, Loader2, File, Link } from "lucide-react";
import { useAtom } from "jotai";
import { useOrganization } from "@clerk/nextjs";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { multiFlowPrompt, multiFlowTranscribe } from "~/atoms/multiFlow";
import { trpc } from "~/trpc/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/reusable/XWNewTab";
import { Button } from "~/components/ui/button";

const ContentSelection = () => {
  const [, setTranscript] = useAtom(multiFlowPrompt);
  const [, setIsTranscribing] = useAtom(multiFlowTranscribe);
  const { showToast } = useXWAlert();

  // Document Selection State
  const [selectedDoc, setSelectedDoc] = React.useState<string | null>(null);
  const { organization: activeWorkspace } = useOrganization();

  // URL Input State
  const [url, setUrl] = useState("");

  // Fetch Documents
  const { data: docs, isLoading: isDocsLoading } =
    trpc.writerx.getAllDocs.useQuery({
      workspaceId: activeWorkspace?.id || "",
    });

  // Transcribe URL Mutation
  const { mutate: handleTranscribe, isPending: isUrlLoading } =
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

  // URL Submit Handler
  const onUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || url.trim().length < 3) return;
    setIsTranscribing(true);
    handleTranscribe({ url: url, type: "file" });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <File className="h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" /> Web URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <div className="flex flex-col gap-2">
            {isDocsLoading ? (
              <p>Loading documents...</p>
            ) : (
              docs?.map((doc) => (
                <Card
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc.id);
                    setTranscript(doc.content || "");
                  }}
                  className={`cursor-pointer ${selectedDoc === doc.id ? "border-xw-primary" : ""}`}
                >
                  <div className="p-4">
                    <h3 className="font-medium">{doc.title}</h3>
                    {doc.content ? (
                      <p>
                        {doc.content.slice(0, 50)}
                        {doc.content.length > 50 ? "..." : ""}
                      </p>
                    ) : (
                      <p className="text-red-500">No content</p>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <form onSubmit={onUrlSubmit} className="flex flex-row gap-2">
            <Input
              placeholder="https://example.com"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
            <Button
              type="submit"
              variant="default"
              disabled={isUrlLoading}
              size="icon"
            >
              {isUrlLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentSelection;
