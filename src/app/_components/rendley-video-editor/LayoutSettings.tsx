interface LayoutSettingsProps {
  recording: any;
  rendley: any;
  mainClipId: string;
}

const LayoutSettings = ({
  recording,
  rendley,
  mainClipId,
}: LayoutSettingsProps) => {
  const handleResize = async (platform: string) => {
    const rendleyVideoEditor = rendley.current;
    const engineInstance = await rendleyVideoEditor.getEngine();
    const engine = engineInstance.getInstance();
    const display = engine.getDisplay();
    const timeline = engine.getTimeline();
    const mainClip = timeline.getClipById(mainClipId);

    if (platform === "youtube") {
      display.setResolution(1920, 1080);
      if (mainClip) {
        mainClip.style.position = [1920 / 2, 1080 / 2];
      }
    }
    if (platform === "instagram") {
      display.setResolution(1080, 1080);
      if (mainClip) {
        mainClip.style.position = [1080 / 2, 1080 / 2];
      }
    }
    if (platform === "twitter") {
      display.setResolution(1280, 720);
      if (mainClip) {
        mainClip.style.position = [1280 / 2, 720 / 2];
      }
    }
    if (platform === "tiktok") {
      display.setResolution(1080, 1920);
      if (mainClip) {
        mainClip.style.position = [1080 / 2, 1920 / 2];
      }
    }
  };
  return (
    <>
      <div>
        <button
          className="bg-black p-4 text-white"
          onClick={() => handleResize("youtube")}
        >
          Youtube 16:9
        </button>
        <button onClick={() => handleResize("instagram")}>Instagram 1:1</button>
        <button onClick={() => handleResize("twitter")}>Twitter 2:1</button>
        <button onClick={() => handleResize("tiktok")}>TikTok 9:16</button>
      </div>
    </>
  );
};

export default LayoutSettings;
