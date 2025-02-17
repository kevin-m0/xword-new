import { FC } from "react";
import { StoryboardFramePreview } from "~/app/_components/storyboard/StoryboardFramePreview";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
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

export default Page;
