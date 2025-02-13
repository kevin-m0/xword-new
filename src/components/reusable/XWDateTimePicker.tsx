"use client";

import * as React from "react";
import { DateTime } from "luxon";
import { CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../reusable/xw-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../reusable/XWSelect";
import XWGradSeparator from "./XWGradSeparator";

interface XWDateTimePickerProps {
  onChange?: (date: Date | undefined) => void;
  value?: Date;
}

export default function XWDateTimePicker({
  onChange,
  value,
}: XWDateTimePickerProps) {
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [open, setOpen] = React.useState(false);
  const [timezone, setTimezone] = React.useState<string>(defaultTimezone);
  const [date, setDate] = React.useState<DateTime | undefined>(
    value ? DateTime.fromJSDate(value).setZone(defaultTimezone) : undefined,
  );
  const [hours, setHours] = React.useState<string>(
    date ? date.toFormat("hh") : DateTime.local().toFormat("hh"),
  );
  const [minutes, setMinutes] = React.useState<string>(
    date ? date.toFormat("mm") : DateTime.local().toFormat("mm"),
  );
  const [ampm, setAmpm] = React.useState<string>(
    date ? date.toFormat("a") : DateTime.local().toFormat("a"),
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const dt = DateTime.fromJSDate(newDate)
        .setZone(timezone)
        .set({ hour: Number(hours), minute: Number(minutes), second: 0 })
        .set({ hour: ampm === "AM" ? Number(hours) : Number(hours) + 12 });
      setDate(dt);
      onChange?.(dt.toJSDate());
    } else {
      setDate(undefined);
      onChange?.(undefined);
    }
  };

  const handleTimeChange = (
    updatedHours: string,
    updatedMinutes: string,
    updatedAmpm: string,
  ) => {
    if (date) {
      const dt = date
        .set({
          hour: Number(updatedHours),
          minute: Number(updatedMinutes),
          second: 0,
        })
        .set({
          hour:
            updatedAmpm === "AM"
              ? Number(updatedHours)
              : Number(updatedHours) + 12,
        });
      setDate(dt);
      onChange?.(dt.toJSDate());
    }
    setHours(updatedHours);
    setMinutes(updatedMinutes);
    setAmpm(updatedAmpm);
  };

  const handleTimezoneChange = (newTimezone: string) => {
    if (date) {
      const dt = date.setZone(newTimezone);
      setDate(dt);
      onChange?.(dt.toJSDate());
    }
    setTimezone(newTimezone);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="xw_outline"
            className="w-full justify-start text-left"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              `${date.toFormat("DDD t")} ${ampm}`
            ) : (
              <span>Pick date and time</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-4">
          <DialogTitle>Calendar</DialogTitle>
          <div className="flex flex-col gap-4">
            {/* Calendar */}
            <Calendar
              mode="single"
              selected={date?.toJSDate()}
              onSelect={(newDate) => handleDateChange(newDate)}
              initialFocus
              className="mx-auto"
            />
            {/* Time Selectors */}
            <div className="flex w-full items-center space-x-2">
              {/* Hours */}
              <Select
                value={hours}
                onValueChange={(val) => handleTimeChange(val, minutes, ampm)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={(i + 1).toString().padStart(2, "0")}
                    >
                      {(i + 1).toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Minutes */}
              <Select
                value={minutes}
                onValueChange={(val) => handleTimeChange(hours, val, ampm)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* AM/PM */}
              <Select
                value={ampm}
                onValueChange={(val) => handleTimeChange(hours, minutes, val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Timezone Selector */}
            <Select value={timezone} onValueChange={handleTimezoneChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <XWGradSeparator />
          <div className="flex justify-end">
            <Button
              variant={"primary"}
              onClick={() => {
                onChange?.(date?.toJSDate());
                setOpen(false);
              }}
            >
              Set
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
