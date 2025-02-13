import React, { useState } from "react";
import { ChevronDown, ChevronRight, Copy, RefreshCw } from "lucide-react";
import XWBadge from "~/components/reusable/XWBadge";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";

interface Section {
  id: string;
  title: string;
  isExpanded?: boolean;
  content?: React.ReactNode;
}

const RecurringContentComponent = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "summary",
      title: "One Sentence Summary",
      isExpanded: false,
    },
    {
      id: "themes",
      title: "Key Themes",
      isExpanded: true,
      content: (
        <div className="ml-7 space-y-2 text-gray-500">
          <p>1. Chris Rock&apos;s stand-up career and talent</p>
          <p>2. Will Smith slapping Chris Rock incident</p>
          <p>3. Impact of the slap on Chris Rock</p>
          <p>4. Crafting and refining stand-up routines</p>
          <p>5. Emotional and mental impact of events</p>
          <p>6. Influence of great comedians on peers</p>
          <p>7. The evolution of stand-up comedy sets</p>
        </div>
      ),
    },
    {
      id: "keywords",
      title: "Keywords",
      isExpanded: false,
    },
    {
      id: "overview",
      title: "Timestamped Overview",
      isExpanded: false,
    },
    {
      id: "topics",
      title: "Key Topics and Bullets",
      isExpanded: false,
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section,
      ),
    );
  };

  return (
    <div className="mt-10 flex flex-col gap-6 rounded-xl bg-black/40">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Recurring Content</h1>
        <p className="text-gray-500">
          Recurring prompts will generate content for each of your recordings.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="xw-premium-div flex flex-col gap-4 rounded-lg border border-zinc-800/50 bg-gradient-to-r p-4"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => toggleSection(section.id)}
              >
                {section.isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-white">
                    {section.title}
                  </span>

                  <XWBadge>Preset Prompt</XWBadge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {section.id === "themes" && section.isExpanded ? (
                  <>
                    <XWSecondaryButton>
                      <RefreshCw className="h-4 w-4" />
                      Modify
                    </XWSecondaryButton>
                    <XWSecondaryButton>
                      <Copy className="h-4 w-4" />
                      Copy Content
                    </XWSecondaryButton>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {section.isExpanded && section.content && (
              <div className="transition-all duration-200 ease-in-out">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringContentComponent;
