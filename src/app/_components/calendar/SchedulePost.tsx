import React from "react";
import { useAtom } from "jotai";
import XWDateTimePicker from "~/components/reusable/XWDateTimePicker";
import { scheduleAndTimeAtom } from "~/atoms/calendarAtoms";

const SchedulePost: React.FC = () => {
  const [selectedDate, setSelectedDate] = useAtom(scheduleAndTimeAtom);

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <XWDateTimePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
          />
        </div>
      </div>
    </div>
  );
};

SchedulePost.displayName = "SchedulePost";

export default SchedulePost;
