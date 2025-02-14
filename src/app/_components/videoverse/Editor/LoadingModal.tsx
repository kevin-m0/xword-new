"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface LoadingModalProps {
  isOpen: boolean;
}

const messages = [
  "Initializing export (1/7)...",
  "Processing data (2/7)...",
  "Generating report (3/7)...",
  "Finalizing export (4/7)...",
  "Almost done (5/5)...",
];

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });

      setMessageIndex((prev) => {
        const newIndex = Math.floor((progress / 100) * messages.length);
        return newIndex < messages.length ? newIndex : prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, progress]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent
        className="sm:max-w-md bg-[#1a1a1a] border-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center space-y-6 py-8">
          {/* Logo */}
          <div className="w-12 h-12">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-white"
            >
              <path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12L12 8L16 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-white h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading Text */}
          <div className="flex justify-between w-full text-sm text-gray-400">
            <span>{messages[messageIndex]}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
