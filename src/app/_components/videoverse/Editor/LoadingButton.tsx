"use client";

import LoadingModal from "./LoadingModal";
import { useState } from "react";
import XWButton from "../../reusable/XWButton";

export default function LoadingButton() {
  const [open, setOpen] = useState(false);

  const handleComplete = () => {
    setOpen(false);
    // You can add any post-completion logic here
    console.log("Export completed!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <XWButton onClick={() => setOpen(true)}>Export Video as MP4</XWButton>
      <LoadingModal
        isOpen={open}
        // onComplete={handleComplete}
      />
    </div>
  );
}
