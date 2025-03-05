import { useState } from "react";

import { Button } from "~/components/ui/button";
import { ImageSourceNav } from "./ImageSourceNav";
import { SelectedImages } from "./SelectedImages";
import { StockImages } from "./StockImages";
import { GenerateImage } from "./GenerateImage";
import { UploadImage } from "./UploadImage";
import { AddFileLink } from "./AddFileLink";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import NewImageUpload from "./NewImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/reusable/xw-dialog";

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
      <DialogContent className="h-[700px] z-[99999] p-0 flex flex-col max-w-[700px] w-full overflow-hidden rounded-lg shadow-xl">
        {/* Dialog Header */}
        <DialogHeader className="p-4 pt-6 border-b border-xw-border">
          <div className="flex flex-col tb:flex-row items-start tb:items-center justify-between gap-4">
            <DialogTitle className="text-xl font-bold">
              Select Images
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Dialog Body */}
        <div className="flex-1 flex flex-col overflow-hidden p-5 gap-4">
          {/* Sidebar Navigation */}
          <ImageSourceNav
            activeSource={activeSource}
            onSourceChange={setActiveSource}
          />

          <Separator />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto rounded-md xw-scrollbar">
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
        <div className="p-4 border-t border-xw-border flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <SelectedImages images={selectedImages} onRemove={handleRemoveImage} />
            {selectedImages.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => setSelectedImages([])}
              >
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
