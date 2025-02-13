import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import { Button } from "~/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";

interface LanguageSelectorProps {
  onLanguageChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export const LanguageSelector = ({
  onLanguageChange,
  onGenerate,
  disabled = false,
}: LanguageSelectorProps) => {
  return (
    <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <div className="flex flex-1 items-center gap-3 sm:flex-initial">
        <span className="flex items-center gap-2 text-base text-gray-300">
          <Globe className="h-4 w-4 text-indigo-400" />
          Generate in
        </span>
        <Select defaultValue="english" onValueChange={onLanguageChange}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onGenerate} disabled={disabled} variant={"default"}>
        Select Images
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
