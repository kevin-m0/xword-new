import { X } from "lucide-react";
import Image from "next/image";

interface SelectedImagesProps {
  images: string[];
  onRemove: (index: number) => void;
}

export const SelectedImages = ({ images, onRemove }: SelectedImagesProps) => {
  if (images.length === 0) return null;
  console.log("images--->",);
  
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-xw-muted">
        {images.length} {images.length === 1 ? 'image' : 'images'} selected
      </span>
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group transition-transform duration-200 hover:scale-105"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-xw-card shadow-lg">
              <Image
                src={image}
                alt={`Selected ${index + 1}`}
                width={100}
                height={100}
                sizes="100vh"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-xw-primary hover:bg-xw-primary-hover  rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};