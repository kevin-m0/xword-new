
import { ArrowRight, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/reusable/XWSelect";
import { Button } from "~/components/ui/button";

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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-3 flex-1 sm:flex-initial">
        <span className="text-base text-gray-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Generate in
        </span>
        <Select
          defaultValue="english"
          onValueChange={onLanguageChange}
        >
          <SelectTrigger className=" w-fit">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english" >English</SelectItem>
            <SelectItem value="spanish" >Spanish</SelectItem>
            <SelectItem value="french" >French</SelectItem>
            <SelectItem value="german" >German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onGenerate}
        disabled={disabled}
        variant={"default"}
      >
        Select Images
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};