import { useState } from "react";

import { Button } from "~/components/ui/button";
import { ImageSourceNav } from "./ImageSourceNav";
import { SelectedImages } from "./SelectedImages";
import { StockImages } from "./StockImages";
import { GenerateImage } from "./GenerateImage";
import { AddFileLink } from "./AddFileLink";
import { Separator } from "~/components/ui/separator";
import NewImageUpload from "./NewImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/reusable/xw-dialog";

interface ImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImagesSelected: (images: string[]) => void;
  single?: boolean;
  limit?: number;
}

export const ImageSelector = ({
  open,
  onOpenChange,
  onImagesSelected,
  single = false,
  limit = 4,
}: ImageSelectorProps) => {
  const [activeSource, setActiveSource] = useState("generate");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Handle image selection
  const handleImageSelect = (imageUrl: string) => {
    if (single) {
      // Replace selected image in single mode
      setSelectedImages([imageUrl]);
    } else {
      // Toggle selection in multiple mode with a limit of 4 images
      setSelectedImages((prev) => {
        if (prev.includes(imageUrl)) {
          return prev.filter((url) => url !== imageUrl);
        } else if (prev.length < limit) {
          return [...prev, imageUrl];
        }
        return prev;
      });
    }
  };

  // Remove selected image by index
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Finalize image selection
  const handleInsert = () => {
    onImagesSelected(selectedImages);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[99999] flex h-[700px] w-full max-w-[700px] flex-col overflow-hidden rounded-lg p-0 shadow-xl">
        {/* Dialog Header */}
        <DialogHeader className="border-xw-border border-b p-4 pt-6">
          <div className="tb:flex-row tb:items-center flex flex-col items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold">
              Select Images
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Dialog Body */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
          {/* Sidebar Navigation */}
          <ImageSourceNav
            activeSource={activeSource}
            onSourceChange={setActiveSource}
          />

          <Separator />

          {/* Content Area */}
          <div className="xw-scrollbar flex-1 overflow-y-auto rounded-md">
            {activeSource === "generate" && (
              <GenerateImage
                onImageGenerated={handleImageSelect}
                selectedImages={selectedImages}
                onRemoveImage={handleRemoveImage}
              />
            )}
            {activeSource === "upload" && (
              <NewImageUpload
                onImageUploaded={handleImageSelect}
                selectedImages={selectedImages}
              />
            )}
            {activeSource === "link" && (
              <AddFileLink onImageAdded={handleImageSelect} />
            )}
            {activeSource === "stock" && (
              <StockImages
                onSelect={handleImageSelect}
                selectedImages={selectedImages}
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-xw-border flex items-center justify-end gap-2 border-t p-4">
          <div className="flex items-center gap-2">
            <SelectedImages
              images={selectedImages}
              onRemove={handleRemoveImage}
            />
            {selectedImages.length > 0 && (
              <Button variant="secondary" onClick={() => setSelectedImages([])}>
                Deselect All
              </Button>
            )}
          </div>
          <Button
            onClick={handleInsert}
            disabled={selectedImages.length === 0}
            variant="default"
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
