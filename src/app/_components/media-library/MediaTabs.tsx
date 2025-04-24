"use client";

import React from "react";
import { useAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { mediaTabs } from "~/atoms/mediaAtoms";

const MediaTabs = () => {
  const [mediaTab, setMediaTab] = useAtom(mediaTabs);

  const handleChange = (value: "assets" | "projects") => {
    setMediaTab(value);
  };

  return (
    <div className="flex w-full max-w-md items-center">
      <Button
        onClick={() => handleChange("assets")}
        className={`hover:border-xw-primary w-full rounded-none border-b-2 hover:border-b-2 ${
          mediaTab === "assets"
            ? "border-xw-primary from-xw-primary-foreground bg-gradient-to-t to-transparent"
            : "border-xw-secondary"
        }`}
      >
        Assets
      </Button>

      <Button
        onClick={() => handleChange("projects")}
        className={`hover:border-xw-primary w-full rounded-none border-b-2 hover:border-b-2 ${
          mediaTab === "projects"
            ? "border-xw-primary from-xw-primary-foreground bg-gradient-to-t to-transparent"
            : "border-xw-secondary"
        }`}
      >
        Projects
      </Button>
    </div>
  );
};

export default MediaTabs;
