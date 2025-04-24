import { useState, useEffect } from "react";
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

const DEFAULT_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    author: "Efe Kurnaz",
  },
  {
    url: "https://images.unsplash.com/photo-1520453803296-c39eabe2dab4",
    author: "Austin Chan",
  },
  {
    url: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5",
    author: "Clark Tibbs",
  },
  {
    url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
    author: "Florian Klauer",
  },
  {
    url: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285",
    author: "Ian Schneider",
  },
  {
    url: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32",
    author: "Nik",
  },
];

export const StockImages = ({ onSelect, selectedImages }: StockImagesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<StockImage[]>(DEFAULT_IMAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 6;

  const searchUnsplash = async (query: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Client-ID cOB5BZzQXRkAgy-e3eB8hqjMrO3074Lcv8PMGUwwhh0`,
          },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");

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
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchUnsplash(searchQuery, 1);
    } else {
      setImages(DEFAULT_IMAGES);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    handleSearch();
    setPage(1); // Reset to first page on search query change
  }, [searchQuery, handleSearch]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      searchUnsplash(searchQuery, newPage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-[50] h-4 w-4 -translate-y-1/2 transform text-white" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="pl-10"
            />
          </div>

          {/* <Button onClick={handleSearch} size={"icon"} variant={"primary"}>
            <Search className="w-4 h-4" />
          </Button> */}
        </div>
      </div>

      {/* Image Grid */}
      <div className="tb:grid-cols-3 grid grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: perPage }).map((_, index) => (
            <Skeleton key={index} className="aspect-square h-full w-full" />
          ))
        ) : images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
              onClick={() => onSelect(image.url)}
            >
              <Image
                src={image.url}
                alt={`Stock ${index + 1}`}
                height={100}
                width={100}
                className="aspect-square w-full rounded-lg object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-2 left-2 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                {image.author}
              </div>
              {selectedImages.includes(image.url) && (
                <div className="absolute inset-0 rounded-lg bg-black/40">
                  <div className="bg-xw-primary m-3 flex h-6 w-6 items-center justify-center rounded-full shadow-md">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="tb:col-span-3 col-span-2 text-center text-gray-500">
            No results found.
          </div>
        )}
      </div>

      {/* Page Info */}
      <div className="flex items-center justify-between gap-2 text-sm text-gray-500">
        Page {page} of {totalPages}
        <div className="flex gap-2">
          <Button
            disabled={page === 1}
            variant={"secondary"}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={page === totalPages}
            variant={"default"}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
