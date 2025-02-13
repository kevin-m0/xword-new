"use client";

import { useEffect, useState } from "react";
import { Subtitle, parseSRT } from "@/utils/subtitle-parser";

export function SubtitleDisplay(subs: any) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const parsed = parseSRT(subs);
    setSubtitles(parsed);
  }, [subs]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {subtitles.map((subtitle) => (
        <div
          key={subtitle.id}
          className="flex flex-col gap-2 border-l-2 py-2 px-5 border-l-white"
        >
          <div className="flex gap-5">
            <span className="text-sm text-xw-muted">
              {subtitle.startTime} - {subtitle.endTime}
            </span>
          </div>

          <p className="text-xw-muted-foreground">{subtitle.text}</p>
        </div>
      ))}
    </div>
    // <div className="min-h-screen bg-[#0a0a0a] p-4 text-white">
    //   <div className="mx-auto max-w-3xl space-y-6">
    //     {subtitles.map((subtitle) => (
    //       <div
    //         key={subtitle.id}
    //         className="relative border-l-2 border-white/20 pl-4"
    //       >
    //         <div className="flex items-center justify-between">
    //           <span className="text-sm text-gray-400">
    //             {subtitle.startTime} - {subtitle.endTime}
    //           </span>
    //         </div>
    //         <p className="mt-1 text-gray-300">{subtitle.text}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}
