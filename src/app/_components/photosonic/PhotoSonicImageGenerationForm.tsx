'use client';

import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import axios, { AxiosRequestConfig } from "axios";
import { BiVector, BiCopy } from 'react-icons/bi';
import Image from 'next/image';
import { GenerationType } from "@prisma/client";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useGetActiveSpace } from '~/hooks/workspace/useGetActiveSpace';
import { useXWAlert } from '~/components/reusable/xw-alert';
import { trpc } from '~/trpc/react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { XWInput } from '~/components/reusable/XWInput';
import { XWTextarea } from '~/components/reusable/XWTextarea';
import { Separator } from '~/components/ui/separator';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/reusable/xw-tooltip';
import { aiImageCount, aiImageLoadingRatio, aiImagesLoadingState, currentGeneratingPrompt, imageCurrentState, refetchTrigger } from '~/atoms/photosonicAtom';

const imagePromptSchema = z.object({
    model: z.string(),
    prompt: z.string().max(500),
    negativePrompt: z.string().max(500).optional(),
    ratio: z.string(),
    resolution: z.string(),
    style: z.string(),
    numberOfOutputs: z.number().min(1).max(4),
    seed: z.string().optional(),
});

type Inputs = z.infer<typeof imagePromptSchema>;

type GenerateImagePayload = {
    model: string;
    userId: string;
    prompt: string;
    quantity: number;
    negativePrompt: string;
    resolution: string;
    tags: string[];
    artStyle: string;
    colors: string[];
};

const dropdowns = {
    model: {
        label: "Model",
        options: [
            "Essential V2",
            "Flux",
            "Stable Diffusion XL"
        ]
    },
    ratio: {
        label: "Ratio",
        options: [
            "Landscape (2:1)",
            "Square (1:1)",
            "Portrait (1:2)"
        ]
    },
    resolution: {
        label: "Resolution",
        options: [
            "1024x1024",
            "1024x768",
            "768x1024"
        ],
        dimensions: "1344 × 768"
    },
    style: {
        label: "Style",
        options: [
            "3D Render",
            "Analog Film",
            "Anime",
            "Cinematic",
            "Comic Book",
            "Digital Art",
            "Enhance",
            "Fantasy Art",
            "Isometric",
            "Line Art",
            "Low Poly",
            "Modeling Compound",
            "Neon Punk",
            "Origami",
            "Photographic",
            "Pixel Art",
            "Realism",
            "Sketch",
            "Sticker",
            "Watercolor"
        ]
    }
};

const mapResolution = (ratio: string): string => {
    const resolutionMap: Record<string, string> = {
        "Square (1:1)": "1024x1024",
        "Landscape (2:1)": "1024x768",
        "Portrait (1:2)": "768x1024",
    };
    return resolutionMap[ratio] || "1024x1024";
};

const PhotoSonicImageGenerationForm = ({ userId }: { userId: string }) => {
    const [fetchingImages, setFetchingImages] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [colorStyle, setColorStyle] = useState<string[]>([]);
    const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
    const [, setCurrentImgs] = useAtom(imageCurrentState);
    const [isGenerating, setIsGenerating] = useAtom(aiImagesLoadingState);
    const [loadingRatio, setLoadingRatio] = useAtom(aiImageLoadingRatio);
    const [loadingCount, setLoadingCount] = useAtom(aiImageCount);
    const [, setImageCount] = useAtom(aiImageCount);
    const [, setCurrentPrompt] = useAtom(currentGeneratingPrompt);
    const { showToast } = useXWAlert();


    const { data: defaultSpace } = useGetActiveSpace();
    const utils = trpc.useUtils();

    const form = useForm<Inputs>({
        resolver: zodResolver(imagePromptSchema),
        defaultValues: {
            model: "Essential V2",
            prompt: "",
            negativePrompt: "",
            ratio: "Landscape (2:1)",
            resolution: "720p",
            style: dropdowns.style.options[0], // Set first style option as default
            numberOfOutputs: 1,
            seed: Math.floor(Math.random() * 10000).toString(),
        },
    });

    const { mutate: storeGeneratedImage } = trpc.image.storeGeneratedImage.useMutation({
        onSuccess: (images: any) => {
            setCurrentImgs(images);
            setTimeout(() => {
                setIsGenerating(false);
            }, 5000);
            utils.image.getGeneratedImages.invalidate();
        },
        onSettled: () => {
            setFetchingImages(false);
            form.reset();
            setTags([]);
            setColorStyle([]);
        },
    });

    const generateImage = async (payload: GenerateImagePayload) => {
        try {
            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                },
            };

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/generate-images`,
                payload,
                config
            );

            return data;
        } catch (e) {
            showToast({
                variant: 'error',
                title: 'Error',
                message: 'Error generating images'
            });
        }
    };


    const { mutate: enhancePrompt, isPending: isEnhancing } = useMutation({
        mutationFn: async () => {
            const paymentId = `${defaultSpace?.id}:${userId}`;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/enhance-image-prompt`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
                    },
                    body: JSON.stringify({
                        model: form.getValues("model"),
                        userId: paymentId,
                        prompt: form.getValues("prompt"),
                        artStyle: form.getValues("style"),
                        resolution: mapResolution(form.getValues("ratio")),
                        tags,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to enhance prompt");
            }

            return response.body;
        },
        onError: () => {
            showToast({
                variant: 'error',
                title: 'Error Generating Enhanced Prompt',
                message: 'An error occurred while generating enhanced prompt, please refresh and try again.'
            });
        },
        onSuccess: async (stream) => {
            if (!stream) {
                showToast({
                    variant: 'error',
                    title: 'Error',
                    message: 'Error generating the response'
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
        },
    });

    const onSubmit = async (data: Inputs) => {
        console
        if (!data.style) {
            showToast({
                variant: 'error',
                title: 'Error',
                message: 'Please select an art style.'
            });
            return;
        }

        setIsGenerating(true);
        setLoadingRatio(mapResolution(data.ratio));
        setImageCount(data.numberOfOutputs);
        setCurrentPrompt(data.prompt);
        setCurrentImgs([]);

        try {
            const paymentId = `${defaultSpace?.id}:${userId}`;
            const updatedPayload: GenerateImagePayload = {
                model: data.model,
                prompt: data.prompt,
                quantity: data.numberOfOutputs,
                negativePrompt: data.negativePrompt || "",
                resolution: mapResolution(data.ratio),
                userId: paymentId,
                artStyle: data.style,
                tags,
                colors: colorStyle,
            };

            const imageKey = await generateImage(updatedPayload);
            if (!imageKey) return;

            imageKey.map((asset: { file: string }) => {
                storeGeneratedImage({
                    imageKey: `${asset.file}`,
                    prompt: data.prompt,
                    resolution: mapResolution(data.ratio),
                    generationType: GenerationType.TEXT_TO_IMAGE,
                    workspaceId: defaultSpace?.id || "",
                });
            });

            setRefetchTokenUsage((prev) => !prev);
        } catch (error) {
            showToast({
                variant: 'error',
                title: 'Error',
                message: 'There was some error generating images.'
            });
        }
    };

    const handleNumberOfOutputsChange = (value: number) => {
        form.setValue("numberOfOutputs", value);
        setImageCount(value);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                <div className="flex-1 overflow-y-auto">
                    <div className="px-5 py-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-2'>
                                    <FormLabel>{dropdowns.model.label}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dropdowns.model.options.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ratio"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-2'>
                                    <FormLabel>{dropdowns.ratio.label}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dropdowns.ratio.options.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="style"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-2'>
                                    <FormLabel>{dropdowns.style.label}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dropdowns.style.options.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="numberOfOutputs"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-2'>
                                    <FormLabel>Number of Outputs</FormLabel>
                                    <div className='flex items-center gap-2'>
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <Button
                                                key={i}
                                                className={`w-full`}
                                                onClick={() => handleNumberOfOutputsChange(i + 1)}
                                                type="button"
                                                variant={field.value === i + 1 ? "default" : "secondary"}
                                                disabled={isGenerating}
                                            >
                                                {i + 1}
                                            </Button>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="seed"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-2 justify-between'>
                                        <FormLabel>Seed</FormLabel>
                                        <div className='flex items-center gap-1'>
                                            <p className='text-xs'>Randomize</p>
                                            <Button
                                                type="button"
                                                size={"icon"}
                                                className='px-2 py-2 h-8 w-8 bg-xw-secondary rounded-md'
                                                onClick={() => field.onChange(Math.floor(Math.random() * 10000).toString())}
                                                disabled={fetchingImages}
                                            >
                                                <BiVector className='h-4 w-4' />
                                            </Button>
                                            <Button
                                                type="button"
                                                size={"icon"}
                                                className='px-2 py-2 h-8 w-8 bg-xw-secondary rounded-md'
                                                onClick={() => navigator.clipboard.writeText(field.value || '')}
                                                disabled={fetchingImages}
                                            >
                                                <BiCopy className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <XWInput
                                            placeholder='3333'
                                            {...field}
                                            disabled={fetchingImages}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="negativePrompt"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel>Negative Prompt</FormLabel>
                                    <FormControl>
                                        <XWTextarea
                                            placeholder='What you do not want to see in the generated image...'
                                            rows={3}
                                            {...field}
                                            disabled={fetchingImages}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormControl>
                                        <XWTextarea
                                            placeholder='Describe your image in detail...'
                                            rows={10}
                                            {...field}
                                            disabled={fetchingImages || isEnhancing}
                                        />
                                    </FormControl>
                                    <div className='absolute bottom-3 right-3'>
                                        <TooltipProvider>
                                            <TooltipTrigger>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className='h-9 w-9 rounded-full'
                                                    onClick={() => enhancePrompt()}
                                                    disabled={!field.value || isEnhancing || fetchingImages}
                                                >
                                                    {isEnhancing ? (
                                                        <Loader className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Image
                                                            src="/icons/ideabulb.svg"
                                                            alt='idea bulb'
                                                            width={20}
                                                            height={20}
                                                        />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent variant='white' position="left-bottom" className='text-sm max-w-xs mx-2'>
                                                <p>Enhance your prompt with AI</p>
                                            </TooltipContent>
                                        </TooltipProvider>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className='mt-auto mb-0 border-t border-secondary p-4'>
                    <div className='flex items-center justify-end gap-2'>
                        <Button
                            type="submit"
                            disabled={fetchingImages || isGenerating || isEnhancing || !form.getValues("prompt")}
                        >
                            {fetchingImages ? (
                                <Loader className="h-4 w-16 animate-spin" />
                            ) : (
                                'Generate'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default PhotoSonicImageGenerationForm;
