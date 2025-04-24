import React, { useRef } from "react";
import { useAtom } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/reusable/xw-dialog";
import { Button } from "~/components/ui/button";
import { Download, Paperclip, UploadCloud, X } from "lucide-react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import XWGradSeparator from "~/components/reusable/XWGradSeparator";
import {
  Media,
  postMediaAtom,
  selectedOptionAtom,
} from "~/atoms/calendarAtoms";

const UploadContentModel = () => {
  const [postMedia, setPostMedia] = useAtom(postMediaAtom);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedOption] = useAtom(selectedOptionAtom);
  const handleFileSelect = () => {
    // fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("files-------->", files);

    const docArray = ["Shorts", "Reel", "Video"]; // Define document types

    if (files) {
      const newMediaList: Media[] = Array.from(files)
        .filter((file) => {
          // Check if the selected option allows videos
          if (!docArray.includes(selectedOption as string)) {
            return file.type.startsWith("image"); // Only allow images
          }
          return file.type.startsWith("video"); // Only allow videos
        })
        .map((file) => ({
          type: file.type.startsWith("video")
            ? "video"
            : file.type.startsWith("image")
              ? "image"
              : "audio",
          source: "file",
          content: file,
        }));

      setPostMedia((prev) => [...prev, ...newMediaList]);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <XWSecondaryButton>
            Upload Content
            <UploadCloud className="h-4 w-4" />
          </XWSecondaryButton>
        </DialogTrigger>
        <DialogContent className="flex w-full max-w-lg flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Upload Your Content
            </DialogTitle>
            <DialogDescription>
              Upload and schedule your own content directly through Xword.
            </DialogDescription>
          </DialogHeader>
          <XWGradSeparator />

          <div className="flex w-full flex-col rounded-[16px] border-[2px] border-dashed border-xw-secondary bg-xw-background py-10">
            <div className="my-auto flex w-full flex-col gap-2 p-5 text-center">
              <Download className="mx-auto h-10 w-10" />
              <h1 className="text-xl font-semibold text-xw-muted-foreground">
                Drag & Drop your Video files
              </h1>
              <p className="text-sm text-xw-muted">File size up to 200MB.</p>

              <div className="mx-auto mt-5 flex items-center gap-2">
                <XWSecondaryButton size="sm" onClick={handleFileSelect}>
                  Browse
                </XWSecondaryButton>
                <input
                  type="file"
                  // ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="video/*,image/*,audio/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {postMedia.length > 0 && (
            <div className="mt-5">
              <h2 className="mb-2 text-lg font-semibold">Selected Files</h2>
              <ul className="list-disc space-y-2 pl-5">
                {postMedia.map((media, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-xw-muted" />
                    <span>
                      {typeof media?.content === "object" &&
                      "name" in media.content
                        ? media.content.name
                        : ""}
                    </span>
                    <span className="text-xs text-xw-muted">
                      ({media.type})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <XWGradSeparator />

          <DialogClose asChild>
            <Button variant="secondary" className="mt-4">
              <X className="mr-2 h-4 w-4" />
              Close & Save
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadContentModel;
