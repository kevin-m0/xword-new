"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { FormHeader } from "./FormHeader";
import { InputField } from "./InputField";
import { TranscriptionField } from "./TranscriptionField";
import { ParameterField } from "./ParameterField";
import { ImageSelector } from "../ImageSelector/ImageSelector";
import { SelectedImagesPreview } from "./SelectedImagesPreview";
import { parseInputParam } from "~/utils/formUtils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { v4 as uuid } from "uuid";
import { handleFileTrasncription } from "../../handler/transcription/transcription";
import { mapImageParser } from "../../handler/parser/mapImageParser";
import { useOrganization } from "@clerk/nextjs";
import { useUser } from "~/hooks/misc/useUser";
import { uploadFile } from "~/services/aws-file-upload";
import { getAwsUrl } from "~/lib/get-aws-url";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { flowType } from "~/atoms/flowAtom";
import { trpc } from "~/trpc/react";
interface DynamicFormProps {
  promptId: string;
  promptTitle: string;
  promptDescription: string;
  categoryName: string;
  subCategoryName: string;
  inputdata: string[];
  inputparams: string[];
  inputType: "text" | "image" | "audio" | "video";
  prev: string;
  step: Number;
  setStep: (num: Number) => void;
}

export const DynamicForm = ({
  promptId,
  promptTitle,
  promptDescription,
  categoryName,
  subCategoryName,
  inputdata,
  inputparams,
  prev,
  inputType,
  step,
  setStep,
}: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>(
    {},
  );
  const [newOption, setNewOption] = useState<Record<string, string>>({});
  const [showNewOptionInput, setShowNewOptionInput] = useState<
    Record<string, boolean>
  >({});
  const [isInputDataComplete, setIsInputDataComplete] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentFieldType, setCurrentFieldType] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<Record<string, boolean>>({});
  const [transcribedFields, setTranscribedFields] = useState<
    Record<string, boolean>
  >({});
  const { showToast } = useXWAlert();
  const router = useRouter();
  const { organization: activeWorkspace } = useOrganization();
  const { data: user } = useUser();
  const [isGeneratingAIResponse, setIsGeneratingAIResponse] = useState(false);

  const [checkFlowType, setType] = useAtom(flowType);

  const handleFileUpload = async (type: string, file: File) => {
    setCurrentFieldType(type);
    setIsTranscribing(true);

    if (!file) {
      setIsTranscribing(false);
      return;
    }
    try {
      const fileKey = uuid();
      await uploadFile(file, fileKey);
      const url = getAwsUrl(fileKey) as string;

      const res = await handleFileTrasncription({ url: url, type: "mux" });

      setTranscript(res.transcript);

      return res;
    } catch (error) {
      console.error("Transcription error:", error);
      showToast({
        title: "Error",
        message: "An error occurred during transcription.",
        variant: "error",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleUrlTranscription = async (type: string, url: string) => {
    setCurrentFieldType(type);
    setIsTranscribing(true);

    console.log("We are here: ", url, type);

    try {
      const isYoutubeUrl =
        url.includes("youtube.com") || url.includes("youtu.be");

      const res = await handleFileTrasncription({
        url: url,
        type: isYoutubeUrl ? "youtube" : "mux",
      });

      setTranscript(res.transcript);
      handleTranscriptDone(currentFieldType, res.transcript);
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Error transcribing URL");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleMultiSelect = (field: string, value: string) => {
    setSelectedOptions((prev) => {
      const current = prev[field] || [];
      const isSelected = current.includes(value);

      if (isSelected) {
        // Deselect the tag
        return {
          ...prev,
          [field]: current.filter((v) => v !== value),
        };
      }

      if (current.length < 3) {
        // Select the tag if under the limit
        return {
          ...prev,
          [field]: [...current, value],
        };
      }

      // Otherwise, do nothing
      return prev;
    });
  };

  const handleAddNewOption = (field: string) => {
    if (newOption[field]?.trim()) {
      setCustomOptions((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), newOption[field]],
      }));
      setNewOption((prev) => ({ ...prev, [field]: "" }));
      setShowNewOptionInput((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleInputDataComplete = () => {
    const allFieldsFilled = inputdata.every((input) => {
      const [type] = input.split(":");
      return formData[type]?.trim();
    });

    console.log(inputdata);

    if (allFieldsFilled) {
      setIsInputDataComplete(true);
      setStep(2);
    } else if (transcript) {
      setIsInputDataComplete(true);
      setStep(2);
    } else {
      showToast({
        title: "Alert",
        message: "Please fill all required fields before proceeding",
        variant: "caution",
      });
    }
  };

  const handleImagesSelected = (images: string[]) => {
    setSelectedImages(images);
    setIsImageSelectorOpen(false);
  };

  const handleTranscriptDone = (type: string, transcriptText: string) => {
    handleInputChange(type, transcriptText);
    setTranscribedFields((prev) => ({ ...prev, [type]: true }));
    setTranscriptDialogOpen(false);
  };

  const utils = trpc.useUtils();

  const { mutate: createDocument, isPending: isCreatingDocument } =
    trpc.writerx.newCreateDocument.useMutation({
      onSuccess(data) {
        // localStorage.setItem("AIResponse", aiResponse ?? "");
        setIsGeneratingAIResponse(false);
        utils.writerx.getAllDocs.invalidate();
        showToast({
          title: "Success",
          message: "Document created successfully",
          variant: "success",
        });
        router.push(`/writerx/${data.id}`);
      },
      onError(error) {
        setIsGeneratingAIResponse(false);
        showToast({
          title: "Error creating document",
          message: error.message,
          variant: "error",
        });
      },
    });

  const {
    mutate: createSocialDoc,
    isPending: isGeneratingSocialContent,
    isError,
  } = trpc.writerx.createSocialDocument.useMutation({
    onSuccess(data) {
      setIsGeneratingAIResponse(false);
      // localStorage.setItem("AIResponse", aiResponse ?? "");
      utils.writerx.getAllDocs.invalidate();
      showToast({
        title: "Success",
        message: "Document created successfully",
        variant: "success",
      });
      router.push(`/social/${data}`);
    },
    onError(error) {
      setIsGeneratingAIResponse(false);
      showToast({
        title: "Error creating document",
        message: error.message,
        variant: "error",
      });
    },
  });

  const validateInputParams = () => {
    console.log("Validating inputparams:", inputparams);
    console.log("Current formData state:", formData);
    console.log("Current selectedOptions state:", selectedOptions);

    return inputparams.every((param) => {
      const field = parseInputParam(param);
      console.log(`Validating field:`, field);

      if (field.type === "multiple") {
        // Make sure selectedOptions contains the tones array
        const isValid =
          Array.isArray(selectedOptions[field.label]) &&
          selectedOptions[field.label]?.length > 0;
        console.log(
          `Field "${field.label}" (multiple type) is valid:`,
          isValid,
        );
        return isValid;
      }

      const isValid = Boolean(formData[field.label]?.trim());
      console.log(`Field "${field.label}" (single value) is valid:`, isValid);
      return isValid;
    });
  };

  const handleGenerate = async () => {
    // Prepare params object from formData and selectedOptions

    const isValid = validateInputParams();

    if (!isValid) {
      showToast({
        title: "Error",
        message: "Please fill all required fields before proceeding",
        variant: "error",
      });

      return;
    }

    if (checkFlowType.toString() === "Social") {
      if (selectedImages.length === 0) {
        showToast({
          title: "Error",
          message: "Please select at least one image before proceeding",
          variant: "error",
        });
        return;
      }
    }
    setIsGeneratingAIResponse(true);
    const params: Record<string, string> = {};
    inputparams.forEach((param) => {
      const field = parseInputParam(param);
      if (field.type === "multiple") {
        // Join selected options with comma for array type fields
        params[field.label] = selectedOptions[field.label]?.join(", ") || "";
      } else {
        params[field.label] = formData[field.label] || "";
      }
    });

    // Prepare request payload
    const payload = {
      userId: user?.id as string,
      promptId: promptId,
      responses: {
        text: formData[inputdata[0].split(":")[0]] || transcript,
        params: params,
      },
    };

    console.log("Sending data to API:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-single-campaign`,
        payload,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
          },
        },
      );

      console.log("API Response:", response.data);
      // Handle the response as needed

      let content = response.data[0].content;

      // console.log(checkFlowType, FlowType.General);

      if (checkFlowType.toString() === "Social") {
        // console.log("Social Content: ", content.variations[0]);

        const parsedVariations = content.variations.map((variation: any) => {
          return `${variation.variation} ${variation.hashtags}`;
        });

        // console.log("Prev Type: ", prev);

        createSocialDoc({
          title: payload.responses.text.slice(0, 16) || "Untitled Document",
          spaceId: activeWorkspace?.id as string,
          content: parsedVariations[0],
          promptId: promptId,
          thumbnailImageUrl: selectedImages[0] as string,
          images: selectedImages,
          variations: parsedVariations,
          previewType: prev || "",
        });
      } else {
        content = mapImageParser(selectedImages, content);

        // console.log("Mapped Images: ", content);
        const parser = new MarkdownParser(content);

        // console.log("parser: ", parser);
        const parsedData = parser.parse();
        console.log("parse data: ", parsedData);

        createDocument({
          workspaceId: activeWorkspace?.id as string,
          payload: JSON.stringify(parsedData),
          title: payload.responses.text.slice(0, 16) || "Untitled Document",
          content: response.data[0].content,
        });
      }
    } catch (error: any) {
      setIsGeneratingAIResponse(false);
      console.error("Error generating response:", error);
      showToast({
        title: "Error generating response",
        message: error?.message as string,
        variant: "error",
      });
    }
  };

  const handleInputEdit = () => {
    setIsInputDataComplete(false);
    setStep(1);
  };

  return (
    <div className="w-full">
      <FormHeader
        categoryName={categoryName}
        subCategoryName={subCategoryName}
        promptTitle={promptTitle}
        promptDescription={promptDescription}
      />

      <div className="space-y-8">
        {!isInputDataComplete && (
          <div className="mt-4 space-y-4">
            <Label className="text-lg font-semibold text-gray-100">
              {inputdata[0]?.split(":")[0]}
            </Label>
            {inputType === "video" || inputType === "audio" ? (
              <TranscriptionField
                type={inputType}
                inputType={inputType}
                formData={formData}
                isTranscribing={isTranscribing}
                showUrlInput={showUrlInput}
                transcribedFields={transcribedFields}
                onInputChange={handleInputChange}
                transcript={transcript}
                setTranscript={setTranscript}
                onUrlInputToggle={(type, showUrl) =>
                  setShowUrlInput((prev) => ({ ...prev, [type]: showUrl }))
                }
                onFileUpload={handleFileUpload}
                onUrlTranscription={handleUrlTranscription}
                onTranscriptEdit={(type, transcript) => {
                  setTranscript(transcript);
                  setCurrentFieldType(type);
                  setTranscriptDialogOpen(true);
                }}
                setIsInputDataComplete={setIsInputDataComplete}
              />
            ) : (
              <InputField
                type={inputdata[0]?.split(":")[0] as string}
                inputType={inputType}
                formData={formData}
                isInputDataComplete={isInputDataComplete}
                onInputChange={handleInputChange}
              />
            )}
          </div>
        )}

        {!isInputDataComplete && (
          <Button
            onClick={handleInputDataComplete}
            variant={"default"}
            disabled={isTranscribing}
            className="flex gap-1 rounded-lg px-2 py-1"
          >
            {isTranscribing && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isTranscribing ? "Transcribing..." : "Next"}
            {!isTranscribing && <ChevronRight className="h-4 w-4" />}
          </Button>
        )}

        {isInputDataComplete && (
          <>
            <div className="flex justify-start">
              <Button
                onClick={handleInputEdit}
                variant={"default"}
                className="mt-4 flex gap-1 rounded-lg px-2 py-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            </div>

            <div className="tb:grid-cols-2 grid gap-5">
              {inputparams.map((param, index) => {
                const field = parseInputParam(param);
                return (
                  <div key={index} className="space-y-3">
                    <Label>{field.label}</Label>
                    <ParameterField
                      field={field}
                      formData={formData}
                      selectedOptions={selectedOptions}
                      customOptions={customOptions}
                      showNewOptionInput={showNewOptionInput}
                      newOption={newOption}
                      onInputChange={handleInputChange}
                      onMultiSelect={handleMultiSelect}
                      onShowNewOptionInput={(field, show) =>
                        setShowNewOptionInput((prev) => ({
                          ...prev,
                          [field]: show,
                        }))
                      }
                      onNewOptionChange={(field, value) =>
                        setNewOption((prev) => ({ ...prev, [field]: value }))
                      }
                      onAddNewOption={handleAddNewOption}
                    />
                  </div>
                );
              })}
            </div>
            <ImageSelector
              open={isImageSelectorOpen}
              onOpenChange={setIsImageSelectorOpen}
              onImagesSelected={handleImagesSelected}
            />

            <div className="flex w-full flex-wrap items-center">
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
                  setSelectedImages(
                    selectedImages.filter((_, i) => i !== index),
                  );
                }}
                onClearAll={() => setSelectedImages([])}
              />
            </div>
            <Button
              onClick={() => handleGenerate()}
              variant={"default"}
              disabled={isGeneratingAIResponse}
            >
              {isGeneratingAIResponse ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isGeneratingAIResponse ? "Generating..." : "Generate"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
