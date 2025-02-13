"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import {
  multiFlowCategories,
  multiFlowPrompt,
  multiFlowStep,
  multiPromptArray,
  MultiSelectType,
  multiSourceSelect,
} from "~/atoms/multiFlow";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { ImageSelector } from "../flow/support/ImageSelector/ImageSelector";
import { SelectedImagesPreview } from "../flow/support/DynamicForm/SelectedImagesPreview";
import { mapImageParser } from "../flow/handler/parser/mapImageParser";
import { Label } from "~/components/ui/label";
import { SelectValue } from "~/components/ui/select";
import { useOrganization } from "@clerk/nextjs";
import { marked } from "marked";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { useUser } from "~/hooks/misc/useUser";
import { trpc } from "~/trpc/react";
import { MarkdownParser } from "~/lib/markdown-parser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/reusable/XWSelect";
import XWBadge from "~/components/reusable/XWBadge";
import XWCheckbox from "~/components/reusable/xw-checkbox";

const toneOptions = [
  "Conversational",
  "Friendly",
  "Funny",
  "Persuasive",
  "Compelling",
  "Assertive",
  "Professional",
  "Informative",
  "Courteous",
  "Empathetic",
  "Emotive",
  "Engaging",
  "Clear",
  "Concise",
];

const MultiFlowThree = ({ closeDialog }: { closeDialog: () => void }) => {
  const { showToast } = useXWAlert();
  const [prompts] = useAtom(multiPromptArray);
  const [step, setStep] = useAtom(multiFlowStep);
  const [currentGenerating, setCurrentGenerating] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { organization: activeWorkspace } = useOrganization();
  const { data: user } = useUser();
  const [isCampaignGenerated, setIsCampaignGenerated] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [categories, setCategories] = useAtom(multiFlowCategories);
  const [contentLength, setContentLength] = useState<string>("50-100 words");
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>(""); // For current input
  const [keywords, setKeywords] = useState<string[]>([]); // For stored keywords
  const [sourceType, setSourceType] = useAtom(multiSourceSelect);

  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleToneSelect = (tone: string) => {
    setSelectedTones((prevTones) => {
      // If tone is already selected, remove it
      if (prevTones.includes(tone)) {
        return prevTones.filter((t) => t !== tone);
      }

      // If less than 3 tones are selected, add the new tone
      if (prevTones.length < 3) {
        return [...prevTones, tone];
      }

      // If 3 tones are already selected, don't add more
      return prevTones;
    });
  };

  const [transcript, setTranscript] = useAtom(multiFlowPrompt);

  const handleImagesSelected = (images: string[]) => {
    setSelectedImages(images);
    setIsImageSelectorOpen(false);
  };

  const utils = trpc.useUtils();

  const { mutate: createDocument, isPending } =
    trpc.writerx.newCreateDocument.useMutation({
      onSuccess(data) {
        utils.writerx.getAllDocs.invalidate();
      },
    });

  const { mutate: createSocialDocument, isPending: isSocialLoading } =
    trpc.writerx.createSocialDocument.useMutation({
      onSuccess(data) {
        utils.writerx.getAllDocs.invalidate();
      },
    });

  const { mutate: createCampaign, isPending: isCampaignLoading } =
    trpc.flow.generateMultiCampaign.useMutation({
      onSuccess: async (campaignResponse) => {
        // console.log({ campaignResponse });
        setIsCampaignGenerated(true);
        setIsGenerating(true); // Start loading

        for (let i = 0; i < campaignResponse.length; i++) {
          const { promptId, content } = campaignResponse[i];
          const type = categories[i]?.category;
          const prev = categories[i]?.prevType;
          setCurrentGenerating(i + 1);
          // console.log({ i, promptId, content, type, prev });
          handleGenerate(promptId, content, type as string, prev as string);
        }

        setTimeout(() => {
          setIsGenerating(false); // Stop loading
          setStep(0);
          setSourceType(MultiSelectType.default);
          closeDialog();
          showToast({
            title: "Success",
            message: "All docs have been processed successfully!",
            variant: "success",
          });
        }, 2000);
      },
      onError: (error) => {
        setIsGenerating(false); // Stop loading on error
        showToast({
          title: "Error",
          message: error.message,
          variant: "error",
        });
      },
    });

  // Content generation for both General and Social categories
  const handleGenerate = async (
    promptId: string,
    response: string | any,
    type: string,
    previewType: string,
  ) => {
    console.log("Response: ", response);

    if (!response) {
      showToast({
        title: "Error",
        message: "Failed to generate content. Please try again.",
        variant: "error",
      });
      return;
    }

    try {
      setIsGenerating(true);

      // let content = response.data[0].content;
      if (type === "General") {
        response = mapImageParser(selectedImages, response);

        // console.log("Mapped Images: ", response);
        const parser = new MarkdownParser(response);
        const parsedData = parser.parse();
        // console.log("Parsed data: ", parsedData);

        const plainText = marked(response) as string;

        createDocument({
          workspaceId: activeWorkspace?.id as string,
          payload: JSON.stringify(parsedData),
          title:
            plainText.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 20) ||
            "Generated Document",
          content: response,
        });
      } else {
        // console.log("Social Content: ", response);

        const parsedVariations = response?.variations?.map((variation: any) => {
          return `${variation.variation} ${variation.hashtags}`;
        });

        // console.log("Variations: ", parsedVariations);

        createSocialDocument({
          title:
            parsedVariations[0].slice(0, 20) || "Generated Social Document",
          spaceId: activeWorkspace?.id as string,
          content: parsedVariations[0],
          promptId: promptId,
          thumbnailImageUrl: selectedImages[0] as string,
          images: selectedImages,
          variations: parsedVariations,
          previewType: previewType,
        });
      }
    } catch (error: any) {
      showToast({
        title: "Error generating response",
        message: error?.message as string,
        variant: "error",
      });
    }
  };

  const handleMultiCampaign = () => {
    // Tones validation
    if (selectedTones.length === 0) {
      showToast({
        title: "Validation Error",
        message: "Please select at least one tone.",
        variant: "error",
      });
      return;
    }

    // Keywords validation
    if (!keywords.length) {
      showToast({
        title: "Validation Error",
        message: "Please enter keywords for the target audience.",
        variant: "error",
      });
      return;
    }

    // Content length validation
    if (!contentLength) {
      showToast({
        title: "Validation Error",
        message: "Please select the desired content length.",
        variant: "error",
      });
      return;
    }

    // Images validation
    if (selectedImages.length === 0) {
      showToast({
        title: "Validation Error",
        message: "Please select at least one image.",
        variant: "error",
      });
      return;
    }

    // Prompts validation
    if (prompts.length === 0) {
      showToast({
        title: "Validation Error",
        message: "No prompts available for generating content.",
        variant: "error",
      });
      return;
    } else if (prompts.length === 0) {
      showToast({
        title: "Validation Error",
        message: "Please select prompts.",
        variant: "error",
      });
      return;
    }

    const payload = {
      userId: user?.id || "",
      promptId: prompts,
      responses: {
        text: transcript || "",
        params: {
          tones: selectedTones.join(", "),
          "Who is the target audience for this": keywords.join(", "),
          "Desired length of content": contentLength,
        },
      },
    };

    console.log("Payload: ", payload);

    createCampaign({ payload: payload });
  };

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Generated Content</h1>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Select Length</Label>
          <Select value={contentLength} onValueChange={setContentLength}>
            <SelectTrigger>
              <SelectValue placeholder="Select a length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30-50 words">30-50 words</SelectItem>
              <SelectItem value="50-100 words">50-100 words</SelectItem>
              <SelectItem value="100-200 words">100-200 words</SelectItem>
              <SelectItem value="200-500 words">200-500 words</SelectItem>
              <SelectItem value="500 - 1000 words">500 - 1000 words</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Keywords</Label>
          <div className="border-xw-border flex max-h-32 flex-wrap items-center gap-2 overflow-y-auto rounded-lg border bg-black p-2 text-sm">
            {keywords.map((keyword, index) => (
              <XWBadge key={index} className="flex h-7 items-center gap-1">
                {keyword}
                <button onClick={() => handleRemoveKeyword(index)}>
                  <X className="h-3 w-3" />
                </button>
              </XWBadge>
            ))}
            <div className="flex items-center">
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordAdd}
                placeholder="tag.."
                className="h-7 w-24 min-w-[100px] flex-shrink-0 border-none bg-transparent text-xs focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Tones</Label>
          <Select
            value={selectedTones.join(", ")}
            onValueChange={(val) => setSelectedTones(val.split(", "))}
          >
            <SelectTrigger>
              <div className="truncate">
                {selectedTones.length > 0
                  ? selectedTones.join(", ")
                  : "Select tones"}
              </div>
            </SelectTrigger>
            <SelectContent>
              <div className="space-y-2 p-3">
                {toneOptions.map((option, index) => {
                  const isSelected = selectedTones.includes(option);
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <XWCheckbox
                        id={`tone-${index}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToneSelect(option)}
                        className="h-5 w-5 rounded-lg border-2 border-gray-700/50 bg-gray-900/50 text-indigo-500 focus:ring-indigo-500"
                      />
                      <label htmlFor={`tone-${index}`}>{option}</label>
                    </div>
                  );
                })}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <ImageSelector
          open={isImageSelectorOpen}
          onOpenChange={setIsImageSelectorOpen}
          onImagesSelected={handleImagesSelected}
        />
      </div>

      <SelectedImagesPreview
        addTrigger={
          <button
            onClick={() => setIsImageSelectorOpen(true)}
            className="bg-xw-card hover:bg-xw-card-hover border-xw-border flex h-28 w-28 items-center justify-center rounded-xl border"
            disabled={isImageSelectorOpen || selectedImages.length > 3}
          >
            <Plus className="h-4 w-4" />
          </button>
        }
        selectedImages={selectedImages}
        onRemoveImage={(index) => {
          setSelectedImages(selectedImages.filter((_, i) => i !== index));
        }}
        onClearAll={() => setSelectedImages([])}
      />

      <div className="mt-6">
        <Button
          variant="default"
          onClick={handleMultiCampaign}
          disabled={isCampaignLoading || isGenerating}
        >
          {isCampaignLoading || isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Campaign
        </Button>
      </div>

      <div className="text-xw-muted text-sm">
        <span>
          Generated {currentGenerating} of {prompts.length} content...
        </span>
      </div>
    </div>
  );
};

export default MultiFlowThree;
