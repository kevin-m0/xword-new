import { loadFonts } from "@/utils/loadRendleyFonts";
import { SubtitlesClip } from "@rendley/sdk";
import { FC, useState } from "react";
import XWButton from "../../reusable/XWButton";
import { toast } from "sonner";

import { ClipStyle } from "@rendley/sdk";
import SubtitleEditor from "./SubtitleEditor";

interface CaptionsTabProps {
  recording: any;
  rendley: any;
}

interface SubtitleEntry {
  index: number;
  start_time: string;
  end_time: string;
  text: string;
}

const CaptionsTab: FC<CaptionsTabProps> = ({ recording, rendley }) => {
  const [formattedSubtitles, setFormattedSubtitles] = useState<any[]>([]);
  const [fontFamilyState, setFontFamilyState] = useState<string>("Lexend");
  const [fontSizeState, setFontSizeState] = useState<string>("Medium");
  const [colorState, setColorState] = useState<string>("#FFFFFF");
  const [highlightColorState, setHighlightColorState] =
    useState<string>("#FF0000");
  const [subsPosition, setSubsPosition] = useState({ x: 0, y: 0 });
  const [subId, setSubId] = useState("");
  const [subClip, setSubClip] = useState<SubtitlesClip>();
  const [clipStyles, setClipStyles] = useState<Record<string, ClipStyle>>({});

  // useEffect(() => {
  //   const formatted = convertToSubtitleObjects(recording.recording.subtitles);
  //   setFormattedSubtitles(() => {
  //     return formatted;
  //   });
  // }, [recording.recording.subtitles]);

  // const convertToSubtitleObjects = (subtitles: string): SubtitleEntry[] => {
  //   const lines = subtitles.trim().split("\n");

  //   let index = 0;
  //   const result: SubtitleEntry[] = [];

  //   while (index < lines.length) {
  //     const entryNumber = parseInt(lines[index].trim(), 10);
  //     const timestamps = lines[index + 1].replace(",", ".").split(" --> ");
  //     const start_time = timestamps[0].trim();
  //     const end_time = timestamps[1].trim();

  //     let subtitleText: string[] = [];
  //     index += 2;
  //     while (index < lines.length && lines[index].trim()) {
  //       subtitleText.push(lines[index].trim());
  //       index++;
  //     }

  //     result.push({
  //       index: entryNumber,
  //       start_time,
  //       end_time,
  //       text: subtitleText.join(" "),
  //     });

  //     index++;
  //   }

  //   return result;
  // };

  const addSubtitleClip = (subId: string) => {
    setSubId(subId);

    // When the subtitle is added, instantiate and store the ClipStyle
    setClipStyles((prevClipStyles) => {
      // Only create a new ClipStyle if it doesn't already exist for the given subId
      if (!prevClipStyles[subId]) {
        return {
          ...prevClipStyles, // Spread the previous state to keep other clips intact
          [subId]: new ClipStyle({ clipId: subId }), // Add the new ClipStyle for the given subId
        };
      }
      return prevClipStyles; // If it already exists, don't modify the state
    });
  };

  const downloadSubtitles = () => {
    const blob = new Blob([JSON.stringify(formattedSubtitles)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recording?.title}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCaptions = async (subtitles: any) => {
    try {
      const rendleyVideoEditor = rendley.current;
      const engineInstance = await rendleyVideoEditor.getEngine();
      const engine = engineInstance.getInstance();
      const subs = engine
        .getSubtitlesManager()
        .convertSRTToSubtitles(subtitles.toUpperCase());

      engine.getSubtitlesManager().setHighlightedTextStyle({
        fontFamily: fontFamilyState,
        fontSize: 40,
        fontWeight: "bold",
        color: highlightColorState,
        strokeColor: "#000000",
        strokeThickness: 15,
      });
      engine.getSubtitlesManager().setTextMode("full");

      loadFonts(engine);

      const subtitlesId = engine.getLibrary().addSubtitles(subs);
      addSubtitleClip(subtitlesId);
      // setSubId(subtitlesId);

      const subtitlesClip = new SubtitlesClip({
        subtitlesId: subtitlesId,
      });
      setSubClip(subtitlesClip);
      const layer = engine.getTimeline().createLayer();
      await layer.addClip(subtitlesClip);

      engine.getSubtitlesManager().setMainTextStyle({
        fontFamily: fontFamilyState,
        fontSize: 96,
        color: "#FFFFFF",
        fontWeight: "bold",
      });
    } catch (err) {
      console.error("Error adding captions:", err);
    }
  };

  const applyPreset = async (preset: any) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setMainTextStyle(
      {
        fontFamily: preset.mainTextStyle.fontFamily,
        fontSize: preset.mainTextStyle.fontSize,
        color: preset.mainTextStyle.color,
        fontWeight: "bold",
      },
      { reset: true },
    );
    engine.getSubtitlesManager().setHighlightedTextStyle(
      {
        fontFamily: preset.highlightedTextStyle.fontFamily,
        fontSize: preset.highlightedTextStyle.fontSize,
        color: preset.highlightedTextStyle.color,
        strokeColor: preset.highlightedTextStyle.strokeColor,
        strokeThickness: preset.highlightedTextStyle.strokeThickness,
        backgroundColor: preset.highlightedTextStyle.backgroundColor,
        backgroundPadding: preset.highlightedTextStyle.backgroundPadding,
        backgroundCornerRadius:
          preset.highlightedTextStyle.backgroundCornerRadius,
      },
      { reset: true },
    );

    toast.success("Preset Applied Successfully");
  };

  const moveSubtitlesY = async (subId: string) => {
    console.log(subId);
    // Check if the ClipStyle for this subtitle exists
    const clipStyle = clipStyles[subId];

    if (!clipStyle) {
      console.log("Subtitle not found.");
      return;
    }

    // Get current position
    const pos = clipStyle.getPosition();
    console.log("Current Position:", pos);

    // Set new Y position
    clipStyle.setPosition(100, 100);

    console.log(subClip?.sprite);

    // subClip?.sprite && clipStyle.update();

    // Optionally trigger any necessary update or re-render
    // clipStyle &&
    //   subClip &&
    //   subClip.sprite &&
    //   clipStyle.update(subClip?.sprite!); // Assuming there's an update method

    // Log the updated position
    const updatedPos = clipStyle.getPosition();
    console.log("Updated Position:", updatedPos);
  };

  const setCaptionStyle = async (
    engine: any,
    config: {
      fontFamily?: string;
      fontSize?: "Small" | "Medium" | "Large";
      color?: string;
      highlightColor?: string;
      strokeColor?: string;
      strokeThickness?: number;
      backgroundColor?: string;
      backgroundPadding?: number;
      backgroundCornerRadius?: number;
    },
  ) => {
    const {
      fontFamily,
      fontSize,
      color,
      highlightColor,
      strokeColor,
      strokeThickness,
      backgroundColor,
      backgroundPadding,
      backgroundCornerRadius,
    } = config;

    const engineInstance = await engine.getEngine();
    const subtitlesManager = engineInstance.getInstance().getSubtitlesManager();

    // Update fontFamily for both main and highlighted styles if provided
    if (fontFamily) {
      subtitlesManager.setMainTextStyle({ fontFamily });
      subtitlesManager.setHighlightedTextStyle({ fontFamily });
    }

    // Update fontSize for main style based on predefined sizes
    if (fontSize) {
      if (fontSize === "Small") {
        subtitlesManager.setMainTextStyle({ fontSize: 40 });
      } else if (fontSize === "Medium") {
        subtitlesManager.setMainTextStyle({ fontSize: 64 });
      } else if (fontSize === "Large") {
        subtitlesManager.setMainTextStyle({
          fontSize: 96,
          strokeColor: "#000000",
          strokeThickness: 2,
        });
      }
    }

    // Update text color for main style
    if (color) {
      subtitlesManager.setMainTextStyle({ color });
    }

    // Update highlighted text style properties individually
    if (highlightColor) {
      subtitlesManager.setHighlightedTextStyle({
        color: highlightColor,
      });
    }

    if (strokeColor) {
      subtitlesManager.setMainTextStyle({ strokeColor });
    }

    if (strokeThickness) {
      subtitlesManager.setMainTextStyle({ strokeThickness });
    }

    if (backgroundColor) {
      subtitlesManager.setMainTextStyle({ backgroundColor });
    }

    if (backgroundPadding || backgroundCornerRadius) {
      subtitlesManager.setHighlightedTextStyle({
        backgroundPadding,
        backgroundCornerRadius,
        backgroundColor: "#ff00ff", // Default backgroundColor for highlighted text
      });
    }
  };

  return (
    <div className="overflow-hidden">
      <div>
        <div className="flex gap-2">
          <XWButton
            className1="w-1/2 mt-5"
            onClick={() => {
              addCaptions(recording.subtitles);
            }}
          >
            Insert Auto Captions
          </XWButton>
          <XWButton
            className1="w-1/2 mt-5"
            onClick={() => {
              downloadSubtitles();
            }}
          >
            Download SRT File
          </XWButton>
        </div>
        {/* <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <CaptionCanvas
                onClick={() => {
                  applyPreset(captionPresets[0]);
                }}
              />
              <CaptionCanvas
                onClick={() => {
                  applyPreset(captionPresets[1]);
                }}
              />
            </div>
            <div className="flex gap-2">
              <CaptionCanvas
                onClick={() => {
                  applyPreset(captionPresets[2]);
                }}
              />
              <CaptionCanvas
                onClick={() => {
                  applyPreset(captionPresets[3]);
                }}
              />
            </div>
            <div className="flex gap-2">
              <CaptionCanvas
                onClick={() => {
                  applyPreset(captionPresets[4]);
                }}
              />
            </div>
          </div>
        </div> */}
        <SubtitleEditor rendley={rendley} />
        <div className="flex gap-2"></div>
        {/* testing purposes */}
        {/* <XWButton
          className1="w-1/2 mt-5"
          onClick={async () => {
            const engine = await rendley.current.getEngine();
            const project = engine.instance.serialize();
            const timeline = engine.instance.getTimeline();
            console.log(timeline.getFitDuration());
            console.log(project);
            moveSubtitlesY(subId);
          }}
        >
          show engine
        </XWButton> */}
      </div>
    </div>
  );
};

export default CaptionsTab;
