"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import { ClipboardListIcon, Loader, FileIcon } from "lucide-react";
import {
  postMediaAtom,
  postTextAtom,
  selectedOptionAtom,
} from "~/atoms/calendarAtoms";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { format } from "date-fns";
import { PreviewDocument } from "./PreviewDocument";
import { trpc } from "~/trpc/react";
import { useOrganization } from "@clerk/nextjs";
import SearchBarComponent from "~/components/topbar/SearchBarComponent";

interface Document {
  id: string;
  title: string;
  role: string;
  access: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  folderId: string | null;
  organizationId: string | null;
  spaceId: string | null;
  isStarred: boolean;
  viewCount: number | null;
  redirectId: string | null;
  thumbnailImageUrl: string | null;
  thumbnailImageId: string | null;
  content: string | null;
  variations: any[];
  previewType: string | null;
  docId: string | null;
  redirectType: string | null;
  isFirstOpen: boolean;
  promptId: string | null;
  assetFolderId: string | null;
  createdBy: string;
  images: any[];
}

const SelectDocument: React.FC<{ trigger?: React.ReactNode }> = ({
  trigger,
}) => {
  const { organization: activeSpace } = useOrganization();
  const [postMedia, setPostMedia] = useAtom(postMediaAtom);
  const [postText, setPostText] = useAtom(postTextAtom);
  const [selectedOption] = useAtom(selectedOptionAtom);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  const { data: documents, isLoading: isDocumentsLoading } =
    trpc.document.fetchDocumentsByWorkSpaceId.useQuery(
      {
        workspaceId: activeSpace?.id as string,
      },
      {
        enabled: !!activeSpace?.id,
        staleTime: 0,
      },
    );

  const toggleDocumentSelection = (doc: Document) => {
    setPostMedia((prev) => {
      const isSelected = prev.some(
        (media) =>
          media.type === "image" &&
          media.source === "url" &&
          media.content === doc.thumbnailImageUrl,
      );
      if (isSelected) {
        // Remove the selected media
        setPostText("");
        return prev.filter(
          (media) =>
            !(
              media.type === "image" &&
              media.source === "url" &&
              media.content === doc.thumbnailImageUrl
            ),
        );
      } else {
        // Add the new media
        if (!(selectedOption === "Story")) {
          setPostText(doc.content as string);
        }
        return [
          ...prev,
          {
            type: "image",
            source: "url",
            content: doc.thumbnailImageUrl as string,
          },
        ];
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm">
            Select Document <ClipboardListIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-[1200px] flex-col gap-5">
        <DialogHeader className="flex flex-row items-center gap-5 text-left">
          <div>
            <DialogTitle className="mb-0 text-2xl font-semibold">
              Select Documents
            </DialogTitle>
            <DialogDescription className="mt-2">
              Choose Documents from your WriterX workspace to upload.
            </DialogDescription>
          </div>
        </DialogHeader>

        <XWGradSeparator />

        <div>
          <div className="mb-6 flex items-center justify-between gap-5">
            <SearchBarComponent />
          </div>

          {isDocumentsLoading ? (
            <div className="flex justify-center">
              <Loader className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {documents &&
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocumentSelection(doc)}
                    className={`relative cursor-pointer overflow-hidden rounded-lg border-2 p-4 shadow-sm hover:shadow-md ${
                      selectedDocs.has(doc.id)
                        ? "border-blue-500"
                        : "border-white"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex flex-row items-center gap-2">
                        <div>
                          <FileIcon className="h-10 w-10 text-gray-600" />
                        </div>
                        <div className="flex flex-col items-start justify-start">
                          <div>
                            <h2 className="mt-2 text-center text-sm font-medium">
                              {doc.title}
                            </h2>
                          </div>
                          <div>
                            <p className="mt-1 text-xs text-gray-400">
                              Created:{" "}
                              {format(new Date(doc.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <PreviewDocument doc={doc} />
                      </div>
                    </div>
                    {postText.includes(doc.content as string) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/30">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="h-8 w-8 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectDocument;
