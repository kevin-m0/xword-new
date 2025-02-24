'use client';

import React, { useState, useCallback } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from 'next/image';
import { useAtom } from 'jotai';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader, Loader2 } from 'lucide-react';
import { GenerationType } from '@prisma/client';
import { trpc } from '~/trpc/react';
import { ART_STYLES } from '~/lib/constant/art-styles';
// import { useGetActiveSpace } from '~/hooks/workspace/useGetActiveSpace';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect';
import { XWTextarea } from '~/components/reusable/XWTextarea';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/reusable/xw-tooltip';
import { Button } from '~/components/ui/button';
import { useXWAlert } from '~/components/reusable/xw-alert';
import { useDebounce } from '~/hooks/misc/useDebounce';
import { isGeneratingRealtimeImageAtom, realTimeImageAtom, refetchTrigger } from '~/atoms/photosonicAtom';
import { useOrganization } from '@clerk/nextjs';



// Define the form schema
const formSchema = z.object({
    resolution: z.enum(["1024x1024", "768x1024", "1024x768"], {
        required_error: "Please select a resolution.",
    }),
    artStyle: z.string().min(1, "Please select an art style."),
    prompt: z.string().refine(
        (value) => value.replace(/\s/g, '').length >= 4,
        "Prompt must contain at least 3 characters (excluding spaces)"
    ),
});

type FormValues = z.infer<typeof formSchema>;



const PhotoSonicRealTimeGenerationForm = ({ userId }: { userId: string }) => {
    const utils = trpc.useUtils();
    const { showToast } = useXWAlert();
    const [isFetching, setIsFetching] = useState(false);
    const [, setRealtimeImage] = useAtom(realTimeImageAtom);
    const [, setRefetchTokenUsage] = useAtom(refetchTrigger);
    // const { data: defaultSpace } = useGetActiveSpace();
    const {organization : defaultSpace} = useOrganization()

    const [isGeneratedImage, setIsGeneratingRealtimeImageAtom] = useAtom(isGeneratingRealtimeImageAtom);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resolution: "1024x768",
            artStyle: "Realism",
            prompt: "",
        },
    });

    const prompt = form.watch("prompt");
    const debouncedPrompt = useDebounce(prompt, 500);

    const { mutate: enhancePrompt, isPending: isEnhancing } = useMutation({
        mutationFn: async () => {
            const paymentId = `${defaultSpace?.id}:${userId}`;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/enhance-image-prompt`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
                    },
                    body: JSON.stringify({
                        userId: paymentId,
                        prompt: form.getValues("prompt"),
                        artStyle: form.getValues("artStyle"),
                        resolution: form.getValues("resolution"),
                        tags: [],
                    }),
                }
            );

            if (!response.ok) throw new Error("Failed to enhance prompt");
            return response.body;
        },
        onError: () => {
            showToast({
                variant: "error",
                title: "Error Generating Enhanced Prompt",
                message: "An error occurred while generating enhanced prompt, please refresh and try again."
            });
        },
        onSuccess: async (stream) => {
            if (!stream) {
                showToast({
                    variant: "error",
                    title: "Error",
                    message: "Error generating the response"
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
                form.setValue("prompt", accResponse);
            }
        },
        onSettled: () => {
            setRefetchTokenUsage((prev) => !prev);
            setIsGeneratingRealtimeImageAtom(false);
        },
    });

    const { mutateAsync: uploadBase64Image } = trpc.aws.uploadBase64ImagePublic.useMutation();
    const { mutate: storeGeneratedImage, isPending: isSaving } = trpc.image.storeGeneratedImage.useMutation({
        onSuccess: () => {
            utils.image.getGeneratedImages.invalidate();
            showToast({
                variant: "success",
                title: "Success",
                message: "Image saved successfully"
            });
        },
    });

    const generateImage = async (values: FormValues) => {

        if (values.prompt.trim().length < 4) {
            return;
        }

        setIsGeneratingRealtimeImageAtom(true);
        console.log("value-------------->", values);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/generate-realtime-image`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
                    },
                    body: JSON.stringify({
                        userId,
                        prompt: values.prompt,
                        artStyle: values.artStyle,
                        resolution: values.resolution,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.image) {
                showToast({
                    variant: "error",
                    title: "Error",
                    message: data.message || "Something went wrong. Please try again."
                });
                return null;
            }

            return `data:image/png;base64,${data.image}`;
        } catch (e) {
            showToast({
                variant: "error",
                title: "Error",
                message: "Failed to generate image. Please try again."
            });
            return null;
        } finally {
            setIsGeneratingRealtimeImageAtom(false);
        }
    };

    const [isGenerating, setIsGenerating] = useState(false);

    const { data: imageSrc } = useQuery({
        queryKey: ["get-image", debouncedPrompt],
        queryFn: async () => {
            if (!prompt || prompt.trim().length < 4) return null;

            setIsGenerating(true);
            setRealtimeImage(null); // Clear previous image while loading

            try {
                const source = await generateImage(form.getValues());
                if (!source) return null;

                setRefetchTokenUsage((prev) => !prev);
                setRealtimeImage(source);
                return source;
            } finally {
                setIsGenerating(false);
            }
        },
        staleTime: 500,
        // keepPreviousData: true,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (values: FormValues) => {
        if (!imageSrc) return;

        if (values.prompt.trim().length < 4) {
            return;
        }

        try {
            const fileName = `${crypto.randomUUID()}.png`;
            const imageKey = await uploadBase64Image({
                fileName,
                base64Data: imageSrc,
                contentType: 'image/png'
            });
            if (!imageKey) {
                showToast({
                    variant: "error",
                    title: "Error",
                    message: "Failed to save image. Please try again."
                })
                return;
            }
            storeGeneratedImage({
                imageKey,
                prompt,
                generationType: GenerationType.REALTIME_IMAGE,
                workspaceId: defaultSpace?.id || "",
                resolution: values.resolution
            });
        } catch (error) {
            console.error("Error saving image:", error);
            showToast({
                variant: "error",
                title: "Error",
                message: "Failed to save image. Please try again."
            })
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Resolution Field */}
                        <FormField
                            control={form.control}
                            name="resolution"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aspect Resolution</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose resolution" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1024x1024">SQUARE (1:1)</SelectItem>
                                            <SelectItem value="1024x768">LANDSCAPE (2:1)</SelectItem>
                                            <SelectItem value="768x1024">PORTRAIT (1:2)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Art Style Field */}
                        <FormField
                            control={form.control}
                            name="artStyle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Art Style</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose style" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ART_STYLES.map((style) => (
                                                <SelectItem key={style.value} value={style.value}>
                                                    {style.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Prompt Field */}
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>Prompt</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-start gap-2">
                                        <div className="flex-1 relative">
                                            <XWTextarea
                                                {...field}
                                                placeholder="Describe what you want to create..."
                                                className="min-h-[300px] resize-none"
                                                disabled={isEnhancing}
                                            />
                                            <div className="absolute right-2 bottom-2">
                                                <TooltipProvider>
                                                    <TooltipTrigger>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full bg-xw-background-secondary hover:bg-xw-background-secondary/80"
                                                            onClick={() => enhancePrompt()}
                                                            disabled={!field.value || isEnhancing}
                                                        >
                                                            {isEnhancing ? (
                                                                <Loader className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Image
                                                                    src="/icons/ideabulb.svg"
                                                                    alt='idea bulb'
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        variant="white"
                                                        position="left-bottom"
                                                        className='text-sm max-w-xs mx-2'
                                                    >
                                                        <p>Enhance your prompt with AI</p>
                                                    </TooltipContent>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                </FormControl>
                                <div className="mt-2 text-sm">
                                    <span className={`  ${field.value?.replace(/\s/g, '').length >= 4 ? 'text-white' : 'text-red-500'}`}>
                                        words: {field.value?.replace(/\s/g, '').length || 0} / 4
                                    </span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Save Button */}
                <div className="mt-auto border-t border-xw-secondary p-4">
                    <Button
                        type="submit"
                        variant="default"
                        disabled={!imageSrc || isSaving || isGenerating}
                        className="w-full"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Generating...
                            </>
                        ) : (
                            "Save Image"
                        )}
                    </Button>

                </div>
            </form>
        </Form>
    );
};

export default PhotoSonicRealTimeGenerationForm;
