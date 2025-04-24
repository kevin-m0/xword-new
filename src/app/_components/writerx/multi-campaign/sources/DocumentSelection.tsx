"use client";

import React from "react";
import { Card } from "~/components/ui/card";
import { useAtom } from "jotai";
import { multiFlowPrompt } from "~/atoms/multiFlow";
import { useOrganization } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";

const DocumentSelection = () => {
  const [, setTranscript] = useAtom(multiFlowPrompt);
  const [selectedDoc, setSelectedDoc] = React.useState<string | null>(null);
  const { organization: activeWorkspace } = useOrganization();

  const { data: docs, isLoading: isDocsLoading } =
    trpc.writerx.getAllDocs.useQuery({
      workspaceId: activeWorkspace?.id || "",
    });

  return (
    <div className="flex flex-col gap-2">
      {isDocsLoading ? (
        <p>Loading documents...</p>
      ) : (
        docs?.map((doc) => (
          <Card
            key={doc.id}
            onClick={() => {
              setSelectedDoc(doc.id);
              setTranscript(doc.content);
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
  );
};

export default DocumentSelection;
