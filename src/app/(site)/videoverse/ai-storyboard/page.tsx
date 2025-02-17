"use client";

import { StoryboardFrame, StoryboardStyle } from "~/types";
import { PenTool } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { storyBoardScriptAtom } from "~/atoms";
import { LoadingSpinner } from "~/components/loaders/LoadingSpinner";
import { TextInput } from "~/app/_components/storyboard/TextInput";
import { extractScriptContent } from "~/utils/utils";

interface StoryboardProps {}

const Storyboard: FC<StoryboardProps> = ({}) => {
  const [concept, setConcept] = useState("");
  const [script, setScript] = useAtom(storyBoardScriptAtom);
  const [style, setStyle] = useState<StoryboardStyle>("realistic");
  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  const [error, setError] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);

  const router = useRouter();

  const generateScript = async (concept: string) => {
    try {
      const body = {
        text: concept,
        length: "250-300",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/generate-text-video-script`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(body),
        },
      );

      return {
        success: true,
        script: extractScriptContent(await response.text()),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please check your connection.");
    }
  };

  const handleGenerateScript = async () => {
    if (concept.length < 50) {
      setError("Please enter at least 50 characters");
      return;
    }

    setError("");
    setIsGeneratingScript(true);

    try {
      const response = await generateScript(concept);
      if (response.success) {
        setScript(response.script);
      } else {
        toast.error("Failed to generate script");
      }
      router.push("/videoverse/ai-storyboard/generate");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div>
      <div className="min-w-6xl flex min-h-[90vh] items-center">
        <div className="mx-auto w-[50vw] space-y-10 p-8">
          <header className="animate-fade-in space-y-4 text-center">
            <h1 className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-5xl font-extrabold text-transparent">
              Storyboard Generator
            </h1>
            <p className="text-lg font-medium text-gray-600">
              Transform your story concepts into visual narratives
            </p>
          </header>

          <main className="space-y-10">
            {error && (
              <div className="animate-shake rounded-lg border-l-4 border-red-500 bg-red-50 px-6 py-4 text-red-700 shadow-md">
                {error}
              </div>
            )}

            <section className="space-y-6 rounded-2xl bg-black p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="flex items-center gap-3 text-3xl font-bold text-indigo-700">
                <PenTool className="h-8 w-8" />
                Story Concept
              </h2>
              <TextInput
                value={concept}
                onChange={setConcept}
                placeholder="Enter your story concept (minimum 50 characters)"
                error={error}
              />
              <button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript || concept.length < 50}
                className="w-full transform rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 active:scale-95 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 md:w-auto"
              >
                {isGeneratingScript ? (
                  <LoadingSpinner text="Generating script..." />
                ) : (
                  "Generate Script"
                )}
              </button>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;
