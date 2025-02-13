import { Sparkles, Upload, Link, Image, Film } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ImageSourceNavProps {
  activeSource: string;
  onSourceChange: (source: string) => void;
}

export const ImageSourceNav = ({
  activeSource,
  onSourceChange,
}: ImageSourceNavProps) => {
  const sources = [
    {
      id: "generate",
      label: "Generate",
      icon: <Sparkles className="h-4 w-4" />,
    },
    { id: "upload", label: "Upload", icon: <Upload className="h-4 w-4" /> },
    { id: "link", label: "Add file link", icon: <Link className="h-4 w-4" /> },
    // eslint-disable-next-line jsx-a11y/alt-text
    { id: "stock", label: "Stock images", icon: <Image className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-row gap-2 p-2">
      {sources.map((source) => (
        <Button
          variant={activeSource === source.id ? "secondary" : "ghost"}
          key={source.id}
          size={"sm"}
          onClick={() => onSourceChange(source.id)}
          className="justify-start gap-2"
        >
          {source.icon}
          {source.label}
        </Button>
      ))}
    </div>
  );
};
