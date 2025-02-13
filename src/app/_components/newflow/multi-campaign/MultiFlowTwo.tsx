"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Search } from "lucide-react";
import { useAtom } from "jotai";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import SelectTemplateSkeleton from "../flow/handler/skeletons/SelectTemplateSkeleton";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  multiFlowCategories,
  multiFlowStep,
  multiPromptArray,
  MultiSelectType,
  multiSourceSelect,
} from "~/atoms/multiFlow";
import { trpc } from "~/trpc/react";
import XWCheckbox from "~/components/reusable/xw-checkbox";

type Prompt = {
  promptTitle: string;
  promptDescription: string;
  categoryId: string;
  categoryName: string;
  type: string;
  subCategoryName: string;
  promptId: string;
  inputdata: string[];
  inputparams: string[];
};

const MultiFlowTwo = () => {
  const { data, isLoading } =
    trpc.flow.getAllMultiCampaigns.useQuery<Prompt[]>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // For tag filters

  const [step, setStep] = useAtom(multiFlowStep);
  const [selectedPrompts, setSelectedPrompts] = useAtom(multiPromptArray);
  const [categories, setCategories] = useAtom(multiFlowCategories);
  const [sourceType, setSourceType] = useAtom(multiSourceSelect);

  // Filter prompts based on search query and selected tag
  const filteredPrompts = data?.filter((prompt: Prompt) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch =
      prompt.promptTitle.toLowerCase().includes(lowerCaseQuery) ||
      prompt.promptDescription.toLowerCase().includes(lowerCaseQuery) ||
      prompt.subCategoryName.toLowerCase().includes(lowerCaseQuery);

    const matchesTag = selectedTag
      ? prompt.subCategoryName === selectedTag
      : true;

    let currentCat = "content";
    if (
      sourceType === MultiSelectType.audio ||
      sourceType === MultiSelectType.audio_url
    ) {
      currentCat = "audio";
    } else if (sourceType === MultiSelectType.video_url) {
      currentCat = "video";
    }

    return (
      matchesSearch &&
      matchesTag &&
      prompt.categoryName.toLowerCase() === currentCat
    );
  });

  // Group prompts by subCategoryName
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

  // Handle Checkbox Toggle
  const togglePromptSelection = (
    promptId: string,
    type: string,
    prevType: string,
  ) => {
    setSelectedPrompts((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((id) => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });

    setCategories(
      (prev: { promptId: string; category: string; prevType: string }[]) => {
        if (prev.some((item) => item.promptId === promptId)) {
          return prev.filter((item) => item.promptId !== promptId);
        } else {
          return [...prev, { promptId, category: type, prevType }];
        }
      },
    );
  };

  // Check if a prompt is selected
  const isPromptSelected = (promptId: string) =>
    selectedPrompts.includes(promptId);
  const handleNext = () => {
    if (selectedPrompts.length > 0) {
      setStep(step + 1);
    }
  };

  const filters = new Set(data?.map((prompt) => prompt.subCategoryName));

  return (
    <div className="space-y-5 px-5 pb-5">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2 top-1/2 z-50 h-5 w-5 -translate-y-1/2 transform text-white/80" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant={"ghost"} onClick={() => setStep(step - 1)}>
            Back
          </Button>
          <Button
            disabled={!selectedPrompts || selectedPrompts.length === 0}
            variant={"default"}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tag Filters */}
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
        <div className="">
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

      {/* Grouped Prompts by SubCategory */}
      {groupedPrompts &&
        Object.entries(groupedPrompts).map(([subCategory, prompts]) => (
          <Card
            key={subCategory}
            className="bg-xw-sidebar-two hover:bg-xw-card border-none shadow-none"
          >
            <CardHeader className="tb:grid-cols-4 grid grid-cols-1 p-4">
              <h2 className="p-2 text-base font-semibold">{subCategory}</h2>
              <div className="tb:col-span-3 tb:grid-cols-3 grid grid-cols-2 gap-4">
                {prompts.map((prompt: Prompt) => (
                  <div
                    key={prompt.promptId}
                    className={`bg-xw-secondary hover:bg-xw-secondary-hover flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 ${
                      isPromptSelected(prompt.promptId)
                        ? "border-xw-primary border"
                        : ""
                    }`}
                  >
                    <XWCheckbox
                      className="border-xw-primary"
                      checked={isPromptSelected(prompt.promptId)}
                      onCheckedChange={() =>
                        togglePromptSelection(
                          prompt.promptId,
                          prompt.type,
                          prompt.subCategoryName,
                        )
                      }
                    />
                    {prompt.promptTitle}
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
    </div>
  );
};

export default MultiFlowTwo;
