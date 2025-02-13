"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Search } from "lucide-react";
import { useAtom } from "jotai";

import SelectTemplateSkeleton from "../handler/skeletons/SelectTemplateSkeleton";
import PromptsIcons from "./PromptsIcons";
import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  flowPrevType,
  flowPromptId,
  flowSteps,
  flowType,
  FlowType,
} from "~/atoms/flowAtom";
import { trpc } from "~/trpc/react";

interface Prompt {
  promptTitle: string;
  promptDescription: string;
  categoryId: string;
  type: FlowType;
  categoryName: string;
  subCategoryName: string;
  promptId: string;
  inputdata: string[];
  inputparams: string[];
}

const SelectTemplateComponent = ({
  usecase,
}: {
  usecase: "Audio" | "Video" | "Content";
}) => {
  const { data: flowPrompts, isLoading } =
    trpc.flow.fetchFlowPrompts.useQuery<Prompt[]>();
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search bar
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // For tag filters

  const [flowPrompt, setFlowPromptId] = useAtom(flowPromptId);
  const [step, setStep] = useAtom(flowSteps);
  const [type, setType] = useAtom(flowType);
  const [prev, setPrev] = useAtom(flowPrevType);

  // Filter prompts based on search query
  const filteredPrompts = flowPrompts?.filter((prompt) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch =
      prompt.promptTitle.toLowerCase().includes(lowerCaseQuery) ||
      prompt.promptDescription.toLowerCase().includes(lowerCaseQuery) ||
      prompt.subCategoryName.toLowerCase().includes(lowerCaseQuery);

    const matchesTag = selectedTag
      ? prompt.subCategoryName === selectedTag
      : true;

    return matchesSearch && matchesTag && prompt.categoryName === usecase;
  });

  // Group filtered prompts by subCategoryName
  const groupedPrompts = filteredPrompts?.reduce<Record<string, Prompt[]>>(
    (acc, prompt) => {
      const { subCategoryName } = prompt;
      if (!acc[subCategoryName]) {
        acc[subCategoryName] = [];
      }
      acc[subCategoryName].push(prompt);
      return acc;
    },
    {},
  );

  const onSelect = (promptId: string, type: FlowType, prevType: string) => {
    setFlowPromptId(promptId);
    setStep(1);
    setType(type);
    setPrev(prevType);
  };

  const filters = new Set(
    flowPrompts
      ?.filter((prompt) => prompt.categoryName === usecase)
      .map((prompt) => prompt.subCategoryName),
  );

  return (
    <div className="space-y-4 px-5 pb-5">
      {/* Header Section */}
      <div className="flex items-center gap-4 py-3">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2 top-1/2 z-50 h-5 w-5 -translate-y-1/2 transform text-white/80" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      <Separator />
      {filters && filters.size > 0 && (
        <ScrollArea className="mb-4 w-full">
          <div className="w-full min-w-[1152px] pb-2">
            {/* Tag filter */}

            <div className="flex w-full items-center gap-2 pb-2">
              <Button
                variant={selectedTag === null ? "default" : "secondary"}
                className="w-full whitespace-nowrap px-4 text-xs"
                onClick={() => setSelectedTag(null)}
                size="sm"
              >
                All
              </Button>
              {Array.from(filters).map((subCategory) => (
                <Button
                  key={subCategory}
                  variant={
                    selectedTag === subCategory ? "default" : "secondary"
                  }
                  className="w-full whitespace-nowrap px-4 text-xs"
                  onClick={() => setSelectedTag(subCategory)}
                  size="sm"
                >
                  {subCategory}
                </Button>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </div>
        </ScrollArea>
      )}

      {/* Loading State */}
      {isLoading && <SelectTemplateSkeleton />}

      {/* No Prompts Found */}
      {!isLoading && (!filteredPrompts || filteredPrompts.length === 0) && (
        <div className="px-5">
          <Card className="bg-xw-sidebar-two border-none p-6 text-center text-white/80 shadow-none">
            <CardTitle className="mb-2 text-lg font-medium">
              No Template found
            </CardTitle>
            <CardDescription className="text-sm">
              Try adjusting your search or filter criteria.
            </CardDescription>
          </Card>
        </div>
      )}

      {/* Render Grouped Prompts */}
      {!isLoading &&
        groupedPrompts &&
        Object.keys(groupedPrompts).length > 0 && (
          <div>
            {Object.entries(groupedPrompts).length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedPrompts).map(
                  ([subCategory, prompts]) => (
                    <Card
                      key={subCategory}
                      className="bg-xw-sidebar-two hover:bg-xw-card border-none shadow-none"
                    >
                      <CardHeader className="tb:grid-cols-4 grid grid-cols-1 p-4">
                        <h2 className="p-2 text-base font-semibold">
                          {subCategory}
                        </h2>
                        <div className="tb:col-span-3 tb:grid-cols-3 grid grid-cols-2 gap-4">
                          {prompts.map((prompt) => (
                            <Button
                              key={prompt.promptId}
                              variant="secondary"
                              onClick={() =>
                                onSelect(
                                  prompt.promptId,
                                  prompt.type,
                                  prompt.subCategoryName,
                                )
                              }
                              className="w-full justify-start gap-2"
                            >
                              <PromptsIcons promptTitle={prompt.promptTitle} />
                              {prompt.promptTitle}
                            </Button>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                  ),
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default SelectTemplateComponent;
