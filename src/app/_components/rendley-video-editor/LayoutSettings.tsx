import { Plus } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

interface LayoutSettingsProps {
  recording: any;
  rendley: any;
  mainClipId: string;
}

export default function LayoutSettings({
  rendley,
  mainClipId,
}: LayoutSettingsProps) {
  const handleResize = async (platform: string) => {
    const rendleyVideoEditor = rendley.current;
    const engineInstance = await rendleyVideoEditor.getEngine();
    const engine = engineInstance.getInstance();
    const display = engine.getDisplay();
    const timeline = engine.getTimeline();
    const mainClip = timeline.getClipById(mainClipId);

    if (platform === "Youtube") {
      display.setResolution(1920, 1080);
      if (mainClip) {
        mainClip.style.position = [1920 / 2, 1080 / 2];
      }
    }
    if (platform === "Instagram") {
      display.setResolution(1080, 810);
      if (mainClip) {
        mainClip.style.position = [1080 / 2, 810 / 2];
      }
    }
    if (platform === "X") {
      display.setResolution(1080, 1080);
      if (mainClip) {
        mainClip.style.position = [1080 / 2, 1080 / 2];
      }
    }
    if (platform === "TikTok") {
      display.setResolution(1080, 1920);
      if (mainClip) {
        mainClip.style.position = [1080 / 2, 1920 / 2];
      }
    }
  };

  const layouts = [
    {
      name: "Youtube",
      resolution: [1920, 1080],
      image: "/images/videoverse/aspect-ratio/youtube.png",
    },
    {
      name: "Instagram",
      resolution: [1080, 810],
      image: "/images/videoverse/aspect-ratio/instagram-feed.png",
    },
    {
      name: "X",
      resolution: [1080, 1080],
      image: "/images/videoverse/aspect-ratio/x.png",
    },
    {
      name: "TikTok",
      resolution: [1080, 1920],
      image: "/images/videoverse/aspect-ratio/tiktok.png",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <Card
            key={layout.name}
            onClick={() => handleResize(layout.name)}
            className="w-100 h-100 cursor-pointer border-zinc-800 bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
          >
            <CardContent className="h-40 p-4">
              <div className="flex h-full w-full transform items-center justify-center rounded-md bg-zinc-800 shadow-lg transition-all hover:translate-y-[-2px]">
                <Image
                  src={layout.image}
                  alt={layout.name}
                  width={layout.resolution[0]}
                  height={layout.resolution[1]}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm font-medium">{layout.name}</p>
              <p className="text-xs text-zinc-400">{layout.resolution}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
