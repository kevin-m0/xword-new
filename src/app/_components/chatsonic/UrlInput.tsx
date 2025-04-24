import { Input } from "~/components/ui/input";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";

interface UrlInputProps {
  urls: string[];
  setUrls: (urls: string[]) => void;
}

const UrlInput = ({ urls, setUrls }: UrlInputProps) => {
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="my-2 flex flex-col gap-2">
      {urls.map((url, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            placeholder="Enter URL..."
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => removeUrl(index)}>
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UrlInput;
