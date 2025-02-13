import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";

interface SelectedImagesProps {
  images: string[];
  onRemove: (index: number) => void;
}

export const SelectedImages = ({ images, onRemove }: SelectedImagesProps) => {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xw-muted text-sm font-medium">
        {images.length} {images.length === 1 ? "image" : "images"} selected
      </span>
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative transition-transform duration-200 hover:scale-105"
          >
            <div className="border-xw-card h-14 w-14 overflow-hidden rounded-lg border-2 shadow-lg sm:h-16 sm:w-16">
              <Image
                src={image}
                alt={`Selected ${index + 1}`}
                width={100}
                height={100}
                sizes="100vh"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(index)}
              className="bg-xw-primary hover:bg-xw-primary-hover absolute -right-2 -top-2 flex h-6 w-6 transform items-center justify-center rounded-full opacity-0 shadow-xl transition-all duration-200 hover:scale-110 group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
