import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ChevronDown, ChevronUp, Globe, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { OpenSections } from "~/types/chatsonic.types";

interface DomainTypeaheadProps {
  includeDomains: string[];
  setIncludeDomains: (domains: string[]) => void;
  openSections: OpenSections;
  setOpenSections: React.Dispatch<React.SetStateAction<OpenSections>>;
}

const DomainTypeahead = ({
  includeDomains = [],
  setIncludeDomains,
  openSections,
  setOpenSections,
}: DomainTypeaheadProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddDomain = (domain: string) => {
    if (!domain || !isValidDomain(domain)) return;
    !includeDomains.includes(domain) &&
      setIncludeDomains([...includeDomains, domain]);
    setInputValue("");
  };

  const handleRemoveDomain = (domain: string) => {
    setIncludeDomains(includeDomains.filter((d) => d !== domain));
  };

  const isValidDomain = (domain: string) => {
    const pattern = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/;
    return pattern.test(domain);
  };

  const toggleSection = () => {
    setOpenSections((prev) => ({ ...prev, domains: !prev.domains }));
  };

  return (
    <Collapsible open={openSections.domains} onOpenChange={toggleSection}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-xw-sidebar w-full justify-between px-0 focus:ring-0"
        >
          <div className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2 uppercase">
              <Globe className="h-4 w-4" />
              Domain Filter
            </span>
            {openSections.domains ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="border-xw-border rounded-lg border bg-black">
          <div className="flex items-center gap-2 p-1">
            <Input
              placeholder="Enter Domain..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddDomain(inputValue);
                }
              }}
              className="h-full flex-1 border-neutral-800 bg-transparent"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setInputValue("")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {includeDomains && includeDomains.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {includeDomains.map((domain) => (
                <div
                  key={domain}
                  className="bg-xw-secondary flex items-center gap-1 rounded-md px-2 py-1"
                >
                  <span className="text-sm">{domain}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    onClick={() => handleRemoveDomain(domain)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DomainTypeahead;
