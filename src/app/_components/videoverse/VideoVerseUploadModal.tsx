"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "~/components/ui/switch";
import CloudinaryUpload from "./Cloudinary/CloudinaryUpload";
import YoutubeUpload from "./YoutubeUpload";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { UploadCloud } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface VideoVerseUploadModalProps {}

export function VideoVerseUploadModal({}: VideoVerseUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"sm"} onClick={() => setIsOpen(true)}>
          New Project <UploadCloud className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar">
        <DialogTitle>
          <div className="flex flex-col items-center justify-center gap-3 border-b p-4">
            <h2 className="text-xl font-semibold text-white">
              Import your Recording
            </h2>
            <h4 className="max-w-80 text-center text-sm text-muted-foreground">
              For best results, video uploads should be at least 1080p (1920 x
              1080 pixels) in MP4 format
            </h4>
          </div>
        </DialogTitle>
        <FirstScreen onUploadClick={closeDialog} />
        <SecondScreen />
      </DialogContent>
    </Dialog>
  );
}

function FirstScreen({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <CloudinaryUpload onClick={onUploadClick} />
    </div>
  );
}

function SecondScreen() {
  return <YoutubeUpload />;
}
