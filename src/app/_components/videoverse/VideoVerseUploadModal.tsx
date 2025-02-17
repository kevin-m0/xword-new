"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "~/components/ui/switch";
import CloudinaryUpload from "./Cloudinary/CloudinaryUpload";
import YoutubeUpload from "./YoutubeUpload";

interface VideoVerseUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoVerseUploadModal({
  isOpen,
  onClose,
}: VideoVerseUploadModalProps) {
  const [currentScreen, setCurrentScreen] = useState<"first" | "second">(
    "first",
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-black">Create New</h2>
              <div className="flex items-center space-x-2">
                {currentScreen === "first" ? (
                  <span className="text-sm text-black">Upload Video</span>
                ) : (
                  <span className="text-sm text-black">Import URL</span>
                )}
                <Switch
                  checked={currentScreen === "second"}
                  onCheckedChange={() =>
                    setCurrentScreen(
                      currentScreen === "first" ? "second" : "first",
                    )
                  }
                />
              </div>
            </div>
            <div className="relative h-64">
              <AnimatePresence
                initial={false}
                custom={currentScreen === "first" ? -1 : 1}
              >
                <motion.div
                  key={currentScreen}
                  custom={currentScreen === "first" ? -1 : 1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 0.3 }}
                  className="absolute inset-0 p-6"
                >
                  {currentScreen === "first" ? (
                    <FirstScreen />
                  ) : (
                    <SecondScreen />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FirstScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <CloudinaryUpload />
    </div>
  );
}

function SecondScreen() {
  return <YoutubeUpload />;
}
