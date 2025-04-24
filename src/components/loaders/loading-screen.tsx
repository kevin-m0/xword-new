"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <motion.div
        className="h-8 w-8 rounded-full border-2 border-white border-r-transparent"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}
