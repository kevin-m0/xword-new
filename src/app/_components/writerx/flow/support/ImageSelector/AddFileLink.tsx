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
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-8 ">
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
          <Save className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-200">Image Preview</p>
        <div className="w-full aspect-square bg-xw-background border border-xw-border rounded-lg flex items-center justify-center">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              height={100}
              width={100}
              sizes="100vh"
              className="w-full h-full object-contain rounded-lg"
              onError={() => setPreviewUrl("")}
            />
          ) : (
            <p className="text-sm text-xw-muted text-center px-4">
              The image preview will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  );
};