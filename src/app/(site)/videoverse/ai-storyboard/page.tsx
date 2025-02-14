"use client";

import { LoadingSpinner } from "@/components/skeletons/LoadingSpinner";
import { TextInput } from "@/app/(site)/(dashboard)/_components/Storyboard/TextInput";
import { StoryboardFrame, StoryboardStyle } from "@/types";
import { PenTool } from "lucide-react";
import { FC, useState } from "react";
import TopbarComponent from "../../_components/topbar/TopbarComponent";
import { toast } from "sonner";
import { extractScriptContent } from "@/utils/storyboard";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { storyBoardScriptAtom } from "@/atoms";

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
      <TopbarComponent />
      <div className="flex items-center min-w-6xl min-h-[90vh]">
        <div className="mx-auto w-[50vw] p-8 space-y-10">
          <header className="text-center space-y-4 animate-fade-in">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Storyboard Generator
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Transform your story concepts into visual narratives
            </p>
          </header>

          <main className="space-y-10">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md animate-shake">
                {error}
              </div>
            )}

            <section className="space-y-6 bg-black p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-indigo-700">
                <PenTool className="w-8 h-8" />
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
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold 
                hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed 
                transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
              >
                {isGeneratingScript ? (
                  <LoadingSpinner text="Generating script..." />
                ) : (
                  "Generate Script"
                )}
              </button>
            </section>

            {/* {script && (
              <section className="space-y-6 bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up">
                <h2 className="text-3xl font-bold text-indigo-700">
                  Generated Script
                </h2>
                <ScriptEditor
                  value={script}
                  onChange={setScript}
                  disabled={isGeneratingStoryboard}
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <StyleSelector value={style} onChange={setStyle} />
                  <button
                    onClick={handleCreateStoryboard}
                    disabled={isGeneratingStoryboard || !script}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold
                    hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                    transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    {isGeneratingStoryboard ? (
                      <LoadingSpinner text="Creating storyboard..." />
                    ) : (
                      "Create Storyboard"
                    )}
                  </button>
                </div>
              </section>
            )} */}

            {/* {frames.length > 0 && (
            <section className="space-y-6 bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl animate-slide-up">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-indigo-700">
                <Film className="w-8 h-8" />
                Storyboard Preview
              </h2>
              <StoryboardPreview
                frames={frames}
                isGenerating={isGeneratingStoryboard}
                totalFrames={10}
              />
            </section>
          )} */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;
