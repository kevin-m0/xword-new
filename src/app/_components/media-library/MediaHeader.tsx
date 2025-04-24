import React from "react";
import { Button } from "~/components/ui/button";
import NewFolderIcon from "~/icons/NewFolderIcon";

const MediaHeader = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-3xl font-semibold">Media Library</h1>

      <div className="flex items-center gap-2">
        {/* <Button variant={"secondary"}>
          <NewFolderIcon />
        </Button>

        <Button variant={"default"}>Upload</Button> */}
      </div>
    </div>
  );
};

export default MediaHeader;
