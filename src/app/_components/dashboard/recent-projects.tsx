import { AudioProject, VideoModel } from "@prisma/client";
import { Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

interface RecentProjectsProps {
  sessions: (AudioProject | VideoModel)[];
}

export default function RecentProjects({ sessions = [] }: RecentProjectsProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {/* New Session Card */}
        <Card className="cursor-pointer border-zinc-800 bg-zinc-900 text-white transition-colors hover:bg-zinc-700">
          <CardContent className="flex h-40 items-center justify-center p-4">
            <div className="flex h-full w-full transform items-center justify-center rounded-md bg-zinc-800 shadow-lg transition-all hover:scale-105">
              <Plus className="h-8 w-8 text-zinc-400" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-4 pt-0">
            <p className="text-sm font-medium">Start a new project</p>
          </CardFooter>
        </Card>

        {/* Session Cards */}
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="cursor-pointer border-zinc-800 bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
          >
            <CardContent className="h-40 p-4">
              <div className="flex h-full w-full transform items-center justify-center rounded-md bg-zinc-800 shadow-lg transition-all hover:translate-y-[-2px]"></div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm font-medium">{session.title}</p>
              <p className="text-xs text-zinc-400">
                {session.createdAt.toString()} •
              </p>
            </CardFooter>
          </Card>
        ))}

        {/* Empty Cards to Fill Grid */}
        {Array.from({ length: Math.max(0, 5 - sessions.length - 1) }).map(
          (_, i) => (
            <Card key={`empty-${i}`} className="border-dashed text-white">
              <CardFooter className="p-4"></CardFooter>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
