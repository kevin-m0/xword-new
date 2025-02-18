import React from "react";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import CalendarSchedulePostModel from "./CalenderSchedulePostModel";

const CalendarHeader = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-3xl font-semibold">Calendar</h1>

      <div className="flex items-center gap-2">
        <div>
          <CalendarSchedulePostModel
            trigger={
              <Button variant={"default"} size={"sm"} className="w-fit">
                Schedule Post <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
