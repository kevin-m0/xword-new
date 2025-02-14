import { StoryboardFramePreview } from "@/app/(site)/(dashboard)/_components/Storyboard/StoryboardFramePreview";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <StoryboardFramePreview
        frames={[]}
        totalFrames={10}
        isGenerating={true}
      />
    </div>
  );
};

export default page;
