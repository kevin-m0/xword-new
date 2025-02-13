import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import { Textarea } from "~/components/ui/textarea";
import { XWRadioGroup, XWRadioGroupItem } from "~/components/reusable/XWRadio";

interface GenerateImageProps {
  onImageGenerated: (imageUrl: string) => void;
  selectedImages: string[];
  onRemoveImage: (index: number) => void;
}

export const GenerateImage = ({
  onImageGenerated,
  selectedImages,
  onRemoveImage,
}: GenerateImageProps) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("illustration");
  const [aspectRatio, setAspectRatio] = useState("square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [isSelected, setIsSelected] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const resolution =
        aspectRatio === "square"
          ? "1024x1024"
          : aspectRatio === "landscape"
            ? "1024x768"
            : "768x1024";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/generate-realtime-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          },
          body: JSON.stringify({
            userId: "meta-tester-1",
            prompt: prompt,
            resolution: resolution,
            artStyle: style === "illustration" ? "illustration" : "realistic",
          }),
        },
      );

      const data = await response.json();
      const imageUrl = `data:image/png;base64,${data.image}`;
      setGeneratedImage(imageUrl);
      onImageGenerated(imageUrl);
      setIsSelected(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageClick = () => {
    if (isSelected === generatedImage) {
      // If currently selected, remove selection
      setIsSelected("");
      const index = selectedImages.indexOf(generatedImage);
      if (index !== -1) {
        onRemoveImage(index);
      }
    } else {
      // If not selected, select and append to selectedImages
      setIsSelected(generatedImage);
      if (!selectedImages.includes(generatedImage)) {
        onImageGenerated(generatedImage);
      }
    }
  };

  return (
    <div className="tb:grid-cols-[1.2fr,1fr] grid grid-cols-1 gap-8">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-sm font-medium text-gray-200">
            Describe the scene for your image{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Try to be as detailed as possible..."
            rows={8}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Style <span className="text-red-500">*</span>
          </Label>
          <XWRadioGroup
            value={style}
            onValueChange={setStyle}
            className="flex gap-3"
          >
            <div className="flex items-center gap-1.5">
              <XWRadioGroupItem value="illustration" id="illustration" />
              <Label htmlFor="illustration">Illustration</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <XWRadioGroupItem value="photo" id="photo" />
              <Label htmlFor="photo">Photo</Label>
            </div>
          </XWRadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Aspect Ratio <span className="text-red-500">*</span>
          </Label>
          <XWRadioGroup
            value={aspectRatio}
            onValueChange={setAspectRatio}
            className="flex gap-3"
          >
            <div className="flex items-center gap-1.5">
              <XWRadioGroupItem value="square" id="square" />
              <Label htmlFor="square">Square</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <XWRadioGroupItem value="landscape" id="landscape" />
              <Label htmlFor="landscape">Landscape</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <XWRadioGroupItem value="portrait" id="portrait" />
              <Label htmlFor="portrait">Portrait</Label>
            </div>
          </XWRadioGroup>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          className={cn("w-full")}
          variant={"default"}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-200">
          Generated Image
        </Label>
        <div
          className={cn(
            "border-xw-border group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border",
            generatedImage && "hover:bg-xw-primary",
          )}
          onClick={handleImageClick}
        >
          {generatedImage ? (
            <>
              <Image
                src={generatedImage}
                alt="Generated"
                fill
                className="h-full w-full rounded-lg object-contain"
              />
              {isSelected && (
                <div className="border-xw-primary absolute inset-0 flex items-center justify-center rounded-lg border-2">
                  <Check className="text-xw-primary h-8 w-8" />
                </div>
              )}
            </>
          ) : (
            <p className="text-xw-muted px-4 text-center text-sm">
              The image will appear here once generated
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
