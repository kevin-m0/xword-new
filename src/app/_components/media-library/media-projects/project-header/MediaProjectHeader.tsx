import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { recentExports } from "~/lib/constant/media.constants";

const MediaProjectHeader = () => {
  const projectData = [
    {
      id: 1,
      name: "New Project Video",
      icon: "/icons/video-add.svg",
    },
    {
      id: 2,
      name: "New Audio Project",
      icon: "/icons/audio-lines.svg",
    },
    {
      id: 3,
      name: "New Doc Project",
      icon: "/icons/doc-add.svg",
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid max-w-4xl grid-cols-3 gap-5">
        {projectData.map((item) => (
          <Card key={item.id} className="flex flex-col gap-5 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <Image src={item.icon} height={28} width={28} alt={item.name} />
              </div>

              <Plus className="h-5 w-5" />
            </div>
            <h1>{item.name}</h1>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Recently exported</h2>
        <div className="tb:grid-cols-3 grid grid-cols-1 gap-4">
          {recentExports.map((item) => (
            <div
              className="xw-gradient-primary-border-t rounded-lg"
              key={item.id}
            >
              <div className="relative h-full w-full rounded-lg bg-xw-card p-4 hover:bg-xw-card-hover">
                <div className="flex items-center gap-4">
                  <div>
                    <Image
                      src={item.image}
                      alt={item.title}
                      height={100}
                      width={100}
                      sizes="100vh"
                      className="h-20 w-auto"
                    />
                  </div>
                  <div className="flex flex-grow flex-col gap-3">
                    <p className="text-sm text-xw-muted">Exported</p>
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="text-xs text-xw-muted">{item.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="xw-gradient-primary-border-t rounded-lg">
            <div className="relative flex h-full w-full flex-col gap-4 rounded-lg bg-xw-card p-4 hover:bg-xw-card-hover">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">All Exports</h3>
                <span className="text-muted-foreground">32</span>
              </div>
              <Button variant={"secondary"} size="sm" className="ml-auto mr-0">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaProjectHeader;
