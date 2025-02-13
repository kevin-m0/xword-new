import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Upload, Play, Download } from "lucide-react";
import { BiSitemap } from "react-icons/bi";
import Image from "next/image";
import XWSecondaryButton from "../../../../reusable/XWSecondaryButton";

interface UploadImageProps {
  onImageUploaded: (imageUrl: string) => void;
}

export const UploadImage = ({ onImageUploaded }: UploadImageProps) => {
  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLDivElement>,
  ) => {
    let files: FileList | null = null;

    if ("dataTransfer" in event) {
      files = event.dataTransfer.files;
    } else if ("target" in event && event.target instanceof HTMLInputElement) {
      files = event.target.files;
    }

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setRecentImages((prev) => [imageUrl, ...prev]);
          onImageUploaded(imageUrl);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e);
  };

  return (
    <div className="space-y-8">
      <div
        className={`border-xw-border bg-xw-background rounded-xl border border-dashed p-8 transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <Download className="mx-auto h-10 w-10" />
          {/* <div className="flex gap-4">
            <BiSitemap className="w-8 h-8 text-gray-400" />
            <Play className="w-8 h-8 text-gray-400" />
            <Upload className="w-8 h-8 text-gray-400" />
          </div> */}
          <h1 className="tb:text-2xl text-center text-3xl font-semibold">
            Drag & Drop Your Image
          </h1>
          <p className="text-xw-muted tb:text-base text-sm">
            .png, .jpg, .jpeg are allowed.
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            multiple
          />
          <XWSecondaryButton
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Upload Images
          </XWSecondaryButton>
        </div>
      </div>

      {recentImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recently Uploaded Media</h3>
            <Button variant="xw_link" onClick={() => setRecentImages([])}>
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {recentImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                height={100}
                width={100}
                sizes="100vh"
                alt={`Recent upload ${index + 1}`}
                className="h-24 w-full cursor-pointer rounded-lg object-cover"
                onClick={() => onImageUploaded(image)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
