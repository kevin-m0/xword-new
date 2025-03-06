import React, { useState, useCallback, useMemo } from "react";
import {
  Calendar,
  EventProps,
  momentLocalizer,
  View,
  NavigateAction,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { cn } from "~/utils/utils";
import { calendarStyles } from "./calendar-styles";
import ShowMoreEventsDialog from "./ShowMoreEventsDialog";
import { CalendarEvent } from "./types";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { scheduleAndTimeAtom } from "~/atoms/calendarAtoms";
import { useAtom } from "jotai";
import { isToday, isFuture } from "date-fns";
import TwitterIcon from "~/icons/SocialIcons/TwitterIcon";
import InstagramIcon from "~/icons/SocialIcons/InstagramIcon";
import YouTubeIcon from "~/icons/SocialIcons/YoutubeIcon";
import FacebookIcon from "~/icons/SocialIcons/FaceBookIcon";
import LinkedInIcon from "~/icons/SocialIcons/LinkedinIcon";
import CalendarSchedulePostModel from "../CalenderSchedulePostModel";
import CalendarCustomToolbar from "./CalenderCustomToolbar";

// Lazy load EventDialog
const EditPostScheduleModel = dynamic(() => import("./EditPostScheduleModel"), {
  ssr: false,
});

interface DateCellWrapperProps {
  children: React.ReactNode;
  value: Date;
}

const PlatformIcon = React.memo(({ platform }: { platform: string }) => {
  switch (platform) {
    case "twitter":
      return <TwitterIcon className="h-4 w-4" />;
    case "instagram":
      return <InstagramIcon className="h-4 w-4" />;
    case "youtube":
      return <YouTubeIcon className="h-4 w-4" />;
    case "facebook":
      return <FacebookIcon className="h-4 w-4" />;
    default:
      return <LinkedInIcon className="h-4 w-4" />;
  }
});
PlatformIcon.displayName = "PlatformIcon";

const CustomEvent = React.memo(
  ({
    event,
    onSelectEvent,
  }: {
    event: CalendarEvent;
    onSelectEvent: (event: CalendarEvent) => void;
  }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectEvent(event);
      },
      [event, onSelectEvent],
    );

    return (
      <div
        className="flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md bg-white/90 px-1 py-1 text-xs text-black"
        onClick={handleClick}
      >
        <PlatformIcon platform={event.platform as string} />
        <div className="truncate opacity-80">{event.title}</div>
      </div>
    );
  },
);

CustomEvent.displayName = "CustomEvent";

const DateCellWrapper = React.memo(
  ({ children, value }: DateCellWrapperProps) => {
    const showButton = isToday(value) || isFuture(value);

    return (
      <div
        className={cn(
          "group/cell relative h-full w-full border-r border-xw-secondary",
        )}
      >
        <div className="relative flex h-full flex-col">
          {children}
          {showButton && (
            <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover/cell:opacity-100">
              <CalendarSchedulePostModel
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white text-black shadow-lg hover:bg-white/80"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

DateCellWrapper.displayName = "DateCellWrapper";

interface DisplayCalendarComponentProps {
  events: CalendarEvent[];
}

const DisplayCalendarComponent: React.FC<DisplayCalendarComponentProps> =
  React.memo(({ events }) => {
    const { user } = useUser();
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
      null,
    );
    const [selectedDate, setSelectedDate] = useAtom(scheduleAndTimeAtom);
    const [showMoreDate, setShowMoreDate] = useState<Date | null>(null);
    const [showMoreEvents, setShowMoreEvents] = useState<CalendarEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const localizer = useMemo(() => momentLocalizer(moment), []);

    const handleNavigate = useCallback(
      (newDate: Date, view: View, action: NavigateAction) => {
        setCurrentDate(newDate);
      },
      [],
    );

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
      setSelectedEvent(event);
    }, []);

    const handleShowMore = useCallback(
      (events: CalendarEvent[], date: Date) => {
        setShowMoreDate(date);
        setShowMoreEvents(events);
      },
      [],
    );

    const handleCloseEventDialog = useCallback(() => {
      setSelectedEvent(null);
    }, []);

    const handleCloseShowMoreDialog = useCallback(() => {
      setShowMoreDate(null);
    }, []);

    const components = useMemo(
      () => ({
        toolbar: CalendarCustomToolbar,
        event: (props: EventProps<CalendarEvent>) => (
          <CustomEvent event={props.event} onSelectEvent={handleSelectEvent} />
        ),
        dateCellWrapper: DateCellWrapper,
      }),
      [handleSelectEvent],
    );

    const messages = useMemo(
      () => ({
        showMore: (count: number) => `+${count} more`,
      }),
      [],
    );

    return (
      <div className="h-[800px] rounded-lg">
        <Calendar
          localizer={localizer}
          events={events}
          style={{ height: "100%" }}
          startAccessor="start"
          defaultView="month"
          endAccessor="end"
          views={["month"]}
          date={currentDate}
          onNavigate={handleNavigate}
          components={components}
          className={cn(
            calendarStyles.base,
            "[&_.rbc-today]:bg-pink-500 [&_.rbc-today]:text-white",
            "[&_.rbc-off-range-bg]:bg-xw-sidebar",
            "[&_.rbc-day-bg]:group-hover/cell:bg-white [&_.rbc-day-bg]:group-hover/cell:text-black",
            "[&_.rbc-date-cell]:relative [&_.rbc-date-cell]:text-white",
          )}
          onSelectSlot={(event) => {
            setSelectedDate(event.start);
          }}
          onSelectEvent={handleSelectEvent}
          onShowMore={handleShowMore}
          selectable
          popup={false}
          messages={messages}
        />

        <EditPostScheduleModel
          post={selectedEvent as CalendarEvent}
          isOpen={!!selectedEvent}
          onClose={handleCloseEventDialog}
        />

        <ShowMoreEventsDialog
          isOpen={!!showMoreDate}
          onClose={handleCloseShowMoreDialog}
          date={showMoreDate!}
          events={showMoreEvents}
        />
      </div>
    );
  });

DisplayCalendarComponent.displayName = "DisplayCalendarComponent";

export default DisplayCalendarComponent;
