"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/reusable/xw-dialog";
import moment from "moment";
import { CalendarEvent } from "./types";
import { ScrollArea } from "~/components/ui/scroll-area";

interface ShowMoreEventsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEvent[];
}

const ShowMoreEventsDialog = ({
  isOpen,
  onClose,
  date,
  events,
}: ShowMoreEventsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-lg bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle>
            Events for {moment(date).format("MMMM D, YYYY")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-2 p-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg border border-xw-secondary p-3 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-xw-primary" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{event.title}</h4>
                  <p className="text-xs text-xw-muted">
                    {moment(event.start).format("h:mm A")} -{" "}
                    {moment(event.end).format("h:mm A")}
                  </p>
                  {event.description && (
                    <p className="mt-1 text-xs text-xw-muted">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShowMoreEventsDialog;
