'use client';

import React, { useState } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '~/components/ui/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GenerationType } from '@prisma/client';
import { trpc } from '~/trpc/react';
import { useXWAlert } from '~/components/reusable/xw-alert';
import { useGetActiveSpace } from '~/hooks/workspace/useGetActiveSpace';
import { useDebounce } from '~/hooks/misc/useDebounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect';

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

type PhotoSonicRealTimeGenerationFormProps = {
    userId: string;
};

const PhotoSonicRealTimeGenerationForm: React.FC<PhotoSonicRealTimeGenerationFormProps> = ({ userId }) => {
    const utils = trpc.useUtils();
    const { showToast } = useXWAlert();

    const { data: defaultSpace } = useGetActiveSpace();
    const [isGenerating, setIsGenerating] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resolution: "1024x768",
            artStyle: "Realism",
            prompt: "",
        },
    });

    const { mutateAsync: uploadBase64Image } = trpc.aws.uploadBase64ImagePublic.useMutation();
    const { mutate: storeGeneratedImage } = trpc.image.storeGeneratedImage.useMutation({
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
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/image/generate-realtime-image`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    },
                    body: JSON.stringify(values),
                }
            );
            const data = await res.json();
            return data.image ? `data:image/png;base64,${data.image}` : null;
        } catch {
            showToast({
                variant: "error",
                title: "Error",
                message: "Failed to generate image. Please try again."
            });
            return null;
        }
    };

    const debouncedPrompt = useDebounce(form.watch("prompt"), 500);
    const { data: imageSrc } = useQuery({
        queryKey: ["get-image", debouncedPrompt],
        queryFn: async () => {
            if (debouncedPrompt.trim().length < 4) return null;
            setIsGenerating(true);
            try {
                return await generateImage(form.getValues());
            } finally {
                setIsGenerating(false);
            }
        },
        staleTime: 500,
        // keepPreviousData: true,
    });

    const onSubmit = async (values: FormValues) => {
        if (!imageSrc) return;
        try {
            const fileName = `${crypto.randomUUID()}.png`;
            const imageKey = await uploadBase64Image({
                fileName,
                base64Data: imageSrc,
                contentType: 'image/png'
            });
            storeGeneratedImage({
                imageKey: imageKey as string,
                prompt: values.prompt,
                generationType: GenerationType.REALTIME_IMAGE,
                workspaceId: defaultSpace?.id || "",
                resolution: values.resolution
            });
        } catch {
            showToast({
                variant: "error",
                title: "Error",
                message: "Failed to save image. Please try again."
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                <FormField control={form.control} name="resolution" render={({ field }) => (
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
                )} />
            </form>
        </Form>
    );
};

export default PhotoSonicRealTimeGenerationForm;
