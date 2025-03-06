"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";
import { CalendarEvent } from "./calender-components/types";
import CalendarHeader from "./CalenderHeader";
import DisplayCalendarComponent from "./calender-components/DisplayCalenderComponent";

const CalendarComponent = () => {
  const { user } = useUser();

  const {
    data: posts,
    isLoading,
    error,
  } = trpc.pathfix.getUserPosts.useQuery(
    { userId: user?.id as string },
    {
      enabled: !!user?.id,
    },
  );

  const formatPostsForCalendar = (posts: CalendarEvent[] | undefined) => {
    if (!posts) return [];

    return posts.map((post: CalendarEvent) => ({
      ...post,
      start: new Date(post.scheduledAt as Date),
      end: new Date(new Date(post.scheduledAt as Date).getTime() + 5 * 60000),
    })) as CalendarEvent[];
  };

  const calendarEvents = formatPostsForCalendar(posts as CalendarEvent[]);

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="tb:p-10 flex flex-1 flex-col gap-5 p-5">
        <CalendarHeader />

        <DisplayCalendarComponent events={calendarEvents} />
      </div>
    </div>
  );
};

export default CalendarComponent;
