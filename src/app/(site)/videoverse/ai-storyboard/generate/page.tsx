import { FC } from "react";
import StoryboardGeneratorDialog from "~/app/_components/storyboard/StoryboardGeneratorDialog";

interface generateStoryboardPageProps {}

const generateStoryboardPage: FC<generateStoryboardPageProps> = ({}) => {
  return (
    <div>
      <StoryboardGeneratorDialog />
    </div>
  );
};

export default generateStoryboardPage;
