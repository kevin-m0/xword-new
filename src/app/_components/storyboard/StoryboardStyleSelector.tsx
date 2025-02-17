import { storyboardStyleAtom } from "~/atoms";
import { Button } from "~/components/ui/button";
import { StoryboardStyle } from "~/types";
import { useAtom } from "jotai";
import { FC, useState } from "react";
import { Carousel } from "./StyleCarouselCustom";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StoryboardStyleSelectorProps {
  handleNextStep: () => void;
}

const StoryboardStyleSelector: FC<StoryboardStyleSelectorProps> = ({
  handleNextStep,
}) => {
  const [storyboardStyle, setStoryboardStyle] = useAtom(storyboardStyleAtom);

  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter();

  const slides = [
    {
      url: "/images/flow.jpeg",
      alt: "Scenic mountain landscape",
      title: "Realistic",
    },
    {
      url: "/images/flow.jpeg",
      alt: "Serene lake view",
      title: "Cartoon",
    },
    {
      url: "/images/flow.jpeg",
      alt: "Forest pathway",
      title: "Anime",
    },
    {
      url: "/images/flow.jpeg",
      alt: "Forest pathway",
      title: "Watercolor",
    },
  ];

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setStoryboardStyle(slides[index]?.title as StoryboardStyle); // Update the selected storyboard style
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mx-auto w-[90%] max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Featured Styles
        </h1>
        <Carousel
          handleSlideChange={handleSlideChange}
          slides={slides.map((slide, index) => (
            <div
              key={index}
              className={`relative flex-[0_0_100%] pl-4 first:pl-0`}
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={slide.url}
                  alt={slide.alt}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className={`text-2xl font-bold`}>{slide.title}</h2>
                </div>
              </div>
            </div>
          ))}
        />
      </div>
      <Button
        variant={"default"}
        className="px-4 py-2"
        onClick={() => {
          if (storyboardStyle) {
            router.push("/videoverse/ai-storyboard/preview");
          } else {
            alert("Please select a style before proceeding.");
          }
        }}
      >
        Generate Storyboard
      </Button>
    </div>
  );
};

export default StoryboardStyleSelector;
