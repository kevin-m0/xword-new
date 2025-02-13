import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Label } from "~/components/ui/label";

interface SelectedImagesPreviewProps {
  selectedImages: string[];
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
  addTrigger?: React.ReactNode;
}

export const SelectedImagesPreview = ({
  selectedImages,
  onRemoveImage,
  onClearAll,
  addTrigger,
}: SelectedImagesPreviewProps) => {
  return (
    <div className="w-full space-y-4">
      <Label>Selected Images</Label>
      <div className="flex w-full flex-wrap items-center gap-4">
        <div>{addTrigger}</div>
        {selectedImages && selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {selectedImages.map((image: string, index) => (
              <div
                key={index}
                className="group relative transition-transform duration-300 hover:scale-105"
              >
                <div className="border-xw-border h-28 w-28 overflow-hidden rounded-xl border-2 shadow-xl">
                  <Image
                    height={100}
                    width={100}
                    sizes="100vh"
                    src={image}
                    alt={`Selected ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onRemoveImage(index)}
                  className="bg-xw-primary hover:bg-xw-primary-hover absolute -right-2 -top-2 flex h-7 w-7 transform items-center justify-center rounded-full text-white opacity-0 shadow-xl transition-all duration-300 hover:scale-110 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedImages && selectedImages.length > 0 && (
          <Button variant="ghost" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};
