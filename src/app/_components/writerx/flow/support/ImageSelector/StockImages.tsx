import { useState, useEffect, useCallback } from "react";
import { Check, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";

interface StockImage {
  url: string;
  author: string;
}

interface StockImagesProps {
  onSelect: (url: string) => void;
  selectedImages: string[];
}

const DEFAULT_IMAGES: StockImage[] = [
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", author: "Efe Kurnaz" },
  { url: "https://images.unsplash.com/photo-1520453803296-c39eabe2dab4", author: "Austin Chan" },
  { url: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5", author: "Clark Tibbs" },
  { url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8", author: "Florian Klauer" },
  { url: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285", author: "Ian Schneider" },
  { url: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32", author: "Nik" },
];

export const StockImages = ({ onSelect, selectedImages }: StockImagesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<StockImage[]>(DEFAULT_IMAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 6;

  const fetchImages = useCallback(async (query: string, page: number) => {
    if (!query.trim()) {
      setImages(DEFAULT_IMAGES);
      setTotalPages(1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=${perPage}`,
        {
          headers: { Authorization: `Client-ID cOB5BZzQXRkAgy-e3eB8hqjMrO3074Lcv8PMGUwwhh0` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      const formattedImages = data.results.map((img: any) => ({
        url: img.urls.regular,
        author: img.user.name,
      }));

      setImages(formattedImages.length > 0 ? formattedImages : []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce effect to wait for user to stop typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchImages(searchQuery, 1);
      setPage(1);
    }, 500); // Wait 500ms before fetching

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchImages]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchImages(searchQuery, newPage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 tb:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: perPage }).map((_, index) => (
              <Skeleton key={index} className="h-full w-full aspect-square" />
            ))
          : images.length > 0
          ? images.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => onSelect(image.url)}
              >
                <Image
                  src={image.url}
                  alt={`Stock ${index + 1}`}
                  height={100}
                  width={100}
                  className="w-full aspect-square object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <div className="absolute bottom-2 left-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.author}
                </div>
                {selectedImages.includes(image.url) && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-primary shadow-md rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))
          : (
            <div className="text-center col-span-2 tb:col-span-3 text-gray-500">
              No results found.
            </div>
          )}
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 text-sm text-gray-500">
          Page {page} of {totalPages}

          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              variant="secondary"
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              disabled={page === totalPages}
              variant="default"
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
