import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Save } from "lucide-react";
import Image from "next/image";

interface AddFileLinkProps {
  onImageAdded: (imageUrl: string) => void;
}

export const AddFileLink = ({ onImageAdded }: AddFileLinkProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  const handleAddImage = () => {
    if (imageUrl) {
      onImageAdded(imageUrl);
      setImageUrl("");
      setPreviewUrl("");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr,1fr]">
      <div className="space-y-5">
        <div className="space-y-2">
          <Input
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste image URL here..."
          />
        </div>

        <Button
          onClick={handleAddImage}
          disabled={!imageUrl}
          variant={"default"}
        >
          <Save className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-200">Image Preview</p>
        <div className="bg-xw-background border-xw-border flex aspect-square w-full items-center justify-center rounded-lg border">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              height={100}
              width={100}
              sizes="100vh"
              className="h-full w-full rounded-lg object-contain"
              onError={() => setPreviewUrl("")}
            />
          ) : (
            <p className="text-xw-muted px-4 text-center text-sm">
              The image preview will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
