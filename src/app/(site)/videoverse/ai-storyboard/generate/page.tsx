import StoryboardGeneratorDialog from "@/app/(site)/(dashboard)/_components/Storyboard/StoryboardGeneratorDialog";
import { FC } from "react";

interface generateStoryboardPageProps {}

const generateStoryboardPage: FC<generateStoryboardPageProps> = ({}) => {
  return (
    <div>
      <StoryboardGeneratorDialog />
    </div>
  );
};

export default generateStoryboardPage;
