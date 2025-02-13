import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "@/components/ui/card";
import XWBadge from "../../reusable/XWBadge";
import XWSecondaryButton from "../../reusable/XWSecondaryButton";
import Image from "next/image";
import { featuredExamples } from "../../../_lib/audio-exp";
import { fetchPromptLibraryForTranscription } from "@/services/llm";
import { PromptLibraryProps } from "@/components/transcribe-audio/ExamplePrompts";
import { CategoryWithPrompts } from "@/types";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast } from "@/components/ui/custom-toast";
import { useAtom } from "jotai";
import {
  contentInputAtom,
  contentResponseAtom,
  promptLoadingAtom,
  refetchTrigger,
} from "@/atoms";
import { useGetActiveSpace } from "../../../_hooks/workspace/useGetActiveSpace";
import { useUser } from "@clerk/nextjs";
import { ContentInput } from "@/components/transcribe-audio/ContentPromptInput";
import TopLoader from "@/components/skeletons/top-loader";

const AudioVerseExampleComponent = ({ audioProject }: any) => {
  const [promptsObject, setPromptsObject] = useState<CategoryWithPrompts[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
  const { data: activeWorkspace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();
  const { user } = useUser();
  const [, setPromptLoading] = useAtom(promptLoadingAtom);
  const [, setContentResponse] = useAtom(contentResponseAtom);
  const [, setContentInput] = useAtom(contentInputAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchPromptLibraryForTranscription();
        const promptLibrary: PromptLibraryProps[] = data;

        const audioPrompts = promptLibrary.filter(
          (prompt) => prompt.categoryName === "Audio",
        );

        // Fetch unique categories
        const categories = new Set<string>();
        audioPrompts.forEach((prompt) => {
          categories.add(prompt.subCategoryName);
        });

        // Convert the set to an array
        const uniqueCategoriesArray = Array.from(categories);
        setUniqueCategories(uniqueCategoriesArray);

        // Create an array of objects with the category name and the prompts
        const promptsObject: CategoryWithPrompts[] = uniqueCategoriesArray.map(
          (categoryName) => {
            const prompts: PromptLibraryProps[] = audioPrompts
              .filter((prompt) => prompt.subCategoryName === categoryName)
              .map((prompt) => ({
                promptId: prompt.promptId,
                promptTitle: prompt.promptTitle,
                promptDescription: prompt.promptDescription,
                categoryId: prompt.categoryId,
                categoryName: prompt.categoryName,
                subCategoryName: prompt.subCategoryName,
                inputdata: prompt.inputdata,
                inputparams: prompt.inputparams,
              }));
            return {
              category: categoryName,
              prompts,
            };
          },
        );

        setPromptsObject(promptsObject);
      } catch (e) {
        toast.error("Failed to fetch prompts.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { mutate: handleSend, isLoading } = useMutation({
    mutationFn: async (payload: {
      messages: ContentInput[];
      context: string | undefined;
    }) => {
      setPromptLoading(true);
      setContentInput("");
      setContentResponse("");

      const paymentId = `${activeWorkspace?.id}:${user?.id}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/chat`,
        {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
          },
          body: JSON.stringify({
            userId: paymentId,
            messages: payload.messages,
            context: payload.context,
          }),
        },
      );
      if (!res.ok) {
        setPromptLoading(false);
        throw Error(`Error in Generating Response`);
      }
      return res.body;
    },
    onSuccess: async (stream) => {
      if (!stream || stream === null) {
        toast.custom((t) => (
          <ErrorToast
            t={t}
            title=""
            description="Error generating the response"
          />
        ));
      } else {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        const loopRunner = true;
        const generationId = crypto.randomUUID();
        let scrollCount = 0;
        let ans = "";

        while (loopRunner) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const decodedChunk = decoder.decode(value, { stream: true });
          ans += decodedChunk;
          // const systemMessage: Messages = {
          //   id: generationId,
          //   content: ans,
          //   created: new Date().toISOString(),
          //   role: "system",
          // };
          scrollCount += 1;
        }
        setPromptLoading(false);
        setContentInput("");
        setContentResponse(ans);
        // setAiResponse(ans);
        // updateChat({
        //   chat: {first
        //     recId: documentId,
        //   },
        // });
      }
    },
    onSettled: () => {
      setRefetchTokenUsage((prev) => !prev);
    },
    onError: () => {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title=""
          description="Error generating the response"
        />
      ));
      // scrollIntoView();
      // setInput(""); // Not clearing Input because of error in generating response
      // updateChat({
      //   chat: {
      //     content: "Error generating the response",
      //     role: "system",
      //     recId: documentId,
      //   },
      // });
      return;
    },
  });

  const handlePromptClick = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/get-selected-prompt?promptId=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // or response.text() if you expect plain text
      })
      .then((prompt) => {
        const userQuery = {
          id: crypto.randomUUID(),
          content: prompt.prompt,
          created: new Date().toISOString() as any,
          role: "user",
        };

        // updateChat({
        //   chat: {
        //     content: userQuery.content,
        //     role: "user",
        //     recId: documentId,
        //   },
        // });

        handleSend({
          messages: [prompt.prompt, userQuery],
          context: audioProject?.transcript,
        }); // This is your processed data
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
      });
  };

  if (loading) return <TopLoader />;

  return (
    <div className="bg-xw-sidebar border-xw-secondary space-y-8 rounded-xl border p-5">
      {/* Featured Examples Section */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Here are some examples you can try:
        </h2>
        <div className="tb:grid-cols-3 grid grid-cols-1 gap-4">
          {featuredExamples.map((example) => (
            <Card
              key={example.id}
              className="xw-premium-div border-xw-secondary h-full border p-5"
            >
              <div className="flex h-full flex-col">
                <h3 className="mb-4 text-lg font-medium text-white">
                  {example.title}
                </h3>
                <div className="mt-auto flex w-full items-center justify-between gap-2">
                  {example.tags.map((tag) => (
                    <XWBadge key={tag}>{tag}</XWBadge>
                  ))}
                  <div>
                    <XWSecondaryButton>
                      Draft
                      <Image
                        src={"/icons/pen.svg"}
                        alt="pen"
                        height={16}
                        width={16}
                      />
                    </XWSecondaryButton>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Filter Section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Browse by use case:
        </h2>
        <div className="flex flex-wrap gap-2">
          {uniqueCategories.map((category, i) =>
            category === "All" ? (
              <Button
                key={i}
                variant={"primary"}
                size={"sm"}
                className="h-8 px-3"
              >
                All
              </Button>
            ) : (
              <XWSecondaryButton
                key={i}
                size="sm"
                className2={`cursor-pointer xw-premium-div`}
              >
                {category}
              </XWSecondaryButton>
            ),
          )}
        </div>
      </section>

      {/* Examples Grid */}
      <section>
        <div className="tb:grid-cols-3 grid grid-cols-1 gap-4">
          {promptsObject.map((item) => {
            return item.prompts.map((prompt) => (
              <Card
                key={prompt.promptId}
                className="xw-premium-div border-xw-secondary h-full border p-5"
              >
                <div className="flex h-full flex-col">
                  <h3 className="mb-4 text-lg font-medium text-white">
                    {prompt.promptTitle}
                  </h3>
                  <div className="mt-auto flex w-full items-center justify-between gap-2">
                    <XWBadge>{prompt.subCategoryName}</XWBadge>
                    <div>
                      <XWSecondaryButton
                        onClick={() => handlePromptClick(prompt.promptId)}
                      >
                        Draft
                        <Image
                          src={"/icons/pen.svg"}
                          alt="pen"
                          height={16}
                          width={16}
                        />
                      </XWSecondaryButton>
                    </div>
                  </div>
                </div>
              </Card>
            ));
          })}
        </div>
      </section>
    </div>
  );
};

export default AudioVerseExampleComponent;
