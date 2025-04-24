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
  addTrigger
}: SelectedImagesPreviewProps) => {
  console.log("selected images------->", selectedImages);
  return (
    <div className="space-y-4 w-full">
      <Label>Selected Images</Label>
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div>
          {addTrigger}
        </div>
        {selectedImages && selectedImages.length > 0 && (

          <div className="flex flex-wrap gap-3">
            {selectedImages.map((image: string, index) => (
              <div
                key={index}
                className="relative group transition-transform duration-300 hover:scale-105"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-xw-border shadow-xl">
                  <Image
                    height={100}
                    width={100}
                    sizes="100vh"
                    src={image}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-7 h-7  bg-xw-primary  hover:bg-xw-primary-hover  text-white rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            ))}

          </div>


        )}

        {selectedImages && selectedImages.length > 0 && (
          <Button
            variant="ghost"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};