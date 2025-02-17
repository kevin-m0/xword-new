import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Edit } from "lucide-react";
import SocialFlowSidebar from "./SocialFlowSidebar";

const SocialMobileSidebar = ({ variations }: { variations: string[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SocialFlowSidebar variations={variations} />
      </SheetContent>
    </Sheet>
  );
};

export default SocialMobileSidebar;
