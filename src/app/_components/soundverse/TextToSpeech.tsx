import { Button } from '~/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { useAtom } from 'jotai';
import { isCheckingGrammarAtom, isGeneratingScriptAtom, isProcessingAtom, paraTextAtom } from "~/atoms/soundVerseAtom";
import { useXWAlert } from '~/components/reusable/xw-alert';
import { useUser } from '@clerk/nextjs';
// import { useUser } from '~/hooks/misc/useUser';

const TextToSpeech = () => {

    const [paraText, setParaText] = useAtom(paraTextAtom);
    const [isProcessing, setIsProcessing] = useAtom(isProcessingAtom);
    const [isGeneratingScript, setIsGeneratingScript] = useAtom(isGeneratingScriptAtom);
    const [isCheckingGrammar, setIsCheckingGrammar] = useAtom(isCheckingGrammarAtom);
    
    const { user } = useUser();
    const { showToast } = useXWAlert();

    const { mutate: checkGrammar } = useMutation({
        mutationFn: async () => {
            setIsCheckingGrammar(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/check/check-grammar`,
                {
                    method: "POST",
                    headers: {
                        Accept: "text/plain",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
                    },
                    body: JSON.stringify({
                        text: paraText,
                        userId: user?.id,
                        model: "wizard",
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to check grammar");
            }
            return response.body;
        },
        onSuccess: async (stream) => {
            if (!stream) {
                showToast({
                    title: "Error",
                    message: "Error checking grammar, please try again",
                    variant: "error",
                });
                return;
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accResponse = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                accResponse += chunkValue;
            }

            const jsonResponse = JSON.parse(accResponse);
            setParaText(jsonResponse.response);
            setIsCheckingGrammar(false);
        },
    });

    const { mutate: generateScript } = useMutation({
        mutationFn: async () => {
            setIsGeneratingScript(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate/audio/generate-script`,
                {
                    method: "POST",
                    headers: {
                        Accept: "text/plain",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
                    },
                    body: JSON.stringify({
                        topic: paraText,
                        userId: user?.id,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to generate script");
            }
            return response.body;
        },
        onSuccess: async (stream) => {
            if (!stream) {
                showToast({
                    title: "Error",
                    message: "Error generating script, Please try again",
                    variant: "error",
                });
                return;
            }
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accResponse = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                accResponse += chunkValue;
            }
            setParaText(accResponse);
            setIsGeneratingScript(false);
        },
    });

    return (
        <div>
            <div className="rounded-lg p-[0.7px] bg-gradient-to-t from-white/10 to-white/20">
                <div className="min-h-[350px] p-3 h-full w-full bg-xw-background rounded-lg flex flex-col">
                    <textarea
                        className="outline-none focus:ring-0 w-full resize-none border-none bg-transparent min-h-[300px] h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                        rows={8}
                        placeholder="Write your text here..."
                        aria-label="Text input for speech generation"
                        value={paraText}
                        onChange={(e) => setParaText(e.target.value)}
                        disabled={
                            isProcessing || isGeneratingScript || isCheckingGrammar
                        }
                    />

                    {/* Buttons: Check Grammar / Generate Script */}
                    {paraText === "" ? null : (
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="rounded-full p-[1px] px-4"
                                    onClick={() => checkGrammar()}
                                    disabled={
                                        isProcessing ||
                                        isGeneratingScript ||
                                        isCheckingGrammar
                                    }
                                >
                                    {isCheckingGrammar ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Check Grammar"
                                    )}
                                </Button>

                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="rounded-full p-[1px] px-2"
                                    onClick={() => generateScript()}
                                    disabled={
                                        isProcessing ||
                                        isGeneratingScript ||
                                        isCheckingGrammar
                                    }
                                >
                                    {isGeneratingScript ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Image
                                            src={"/icons/ideabulb.svg"}
                                            alt="idea bulb"
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TextToSpeech
