"use client";

import Image from "next/image";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Button } from "~/components/ui/button";

const SettingsHeader = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-3xl font-semibold">Account Settings</h1>
      <div className="flex items-center gap-3">
        <XWSecondaryButton>
          <Image src={"/icons/gift.svg"} alt="gift" width={16} height={16} />
          Refer and Earn
        </XWSecondaryButton>
        <Button variant={"default"} size="sm">
          Invite Members
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;
