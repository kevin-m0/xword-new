"use client";

import { GenerationType, ImageData } from "@prisma/client";
import React, { useMemo, useCallback, useEffect, useState } from "react";

import { trpc } from "~/trpc/react";
import PhotoSonicImageLoadingSkeleton from "./PhotoSonicImageLoadingSkeleton";


import Image from "next/image";
import { useAtom } from "jotai";
import {
    aiImageCount,
    aiImageLoadingRatio,
    aiImagesLoadingState,
    currentGeneratingPrompt,
} from "~/atoms";
// import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import PhotoSonicImageSlider from "./PhotoSonicImageSlider";
import { getAwsUrl } from "~/lib/get-aws-url";
import EmptyScreen from "../empty/EmptyScreen";
import { useOrganization } from "@clerk/nextjs";

interface GroupedImages {
    prompt: string;
    images: ImageType[];
    createdAt: Date;
}

type ImageType = {
    id: string;
    prompt: string;
    resolution: string | null;
    imageKey: string;
    imageUrl: string | null;
    generationType: GenerationType;
    userId: string | null;
    workspaceId: string | null;
    createdAt: Date;
};

const ImageDisplay = ({ image, groupImages }: { image: ImageData; groupImages: ImageData[] }) => {
    const [width, height] = (image.resolution || "1024x768").split("x").map(Number) as [number, number];;
    const aspectRatio = (height / width ) * 100;
   

    const groupUrlsQueries = groupImages.map((img) => {
        const key = img.imageKey;
        return getAwsUrl(key) as string;
    });

    const groupUrls = groupUrlsQueries
        .map((query) => query)
        .filter((url): url is string => typeof url === "string");

    const imageIndex = groupImages.findIndex((img) => img.id === image.id);
    const currentImageUrl = groupUrls[imageIndex];

    return (
        <PhotoSonicImageSlider index={imageIndex} images={groupUrls}>
            <div
                className="relative w-full rounded-lg overflow-hidden border border-xw-border cursor-pointer group"
                style={{ paddingTop: `${aspectRatio}%` }}
            >
                {currentImageUrl && (
                    <Image
                        src={currentImageUrl}
                        alt={image.prompt || "Generated image"}
                        width={width}
                        height={height}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={imageIndex === 0}
                    />
                )}
            </div>
        </PhotoSonicImageSlider>
    );
};

const PhotoSonicDisplayGeneratedImages: React.FC = () => {
    // const { data: activeSpace } = useGetActiveSpace();
    const {organization : activeSpace} = useOrganization()
    const [isGenerating] = useAtom(aiImagesLoadingState);
    const [imageCount] = useAtom(aiImageCount);
    const [imageRatio] = useAtom(aiImageLoadingRatio);
    const [currentPrompt] = useAtom(currentGeneratingPrompt);

    // State to track both current and previous generation metadata
    const [generationState, setGenerationState] = useState<{
        current: { prompt: string; timestamp: number } | null;
        previous: { prompt: string; timestamp: number } | null;
    }>({
        current: null,
        previous: null
    });

    // Track generation state changes
    useEffect(() => {
        if (isGenerating && currentPrompt) {
            // Move current to previous and set new current
            setGenerationState(prev => ({
                current: {
                    prompt: currentPrompt,
                    timestamp: Date.now()
                },
                previous: prev.current // Store the previous generation
            }));
        }
    }, [isGenerating, currentPrompt]);

    // Query for images
    const { data: generatedImages, isLoading: isLoadingImages } = trpc.image.getGeneratedImages.useQuery(
        { workspaceId: activeSpace?.id || "" },
        {
            enabled: !!activeSpace?.id,
            staleTime: 0,
            // cacheTime: 0,
        }
    );

    console.log("generated images-------->", generatedImages);

    // Group images by generation
    const [currentGeneration, recentGenerations] = useMemo(() => {
        if (!generatedImages) return [null, []];

        const sortedImages = [...generatedImages].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const groups: GroupedImages[] = [];
        let currentGroup: GroupedImages | null = null;

        sortedImages.forEach((image) => {
            const imageTime = new Date(image.createdAt).getTime();
            if (
                !currentGroup ||
                image.prompt !== currentGroup.prompt ||
                Math.abs(imageTime - currentGroup.createdAt.getTime()) > 60000
            ) {
                currentGroup = {
                    prompt: image.prompt,
                    images: [image] as ImageType[],
                    createdAt: new Date(image.createdAt),
                };
                groups.push(currentGroup as GroupedImages);
            } else {
                currentGroup.images.push(image as ImageType);
            }
        });

        let current = null;
        let recent = [...groups];

        // If we're generating, try to find the current generation's group
        if (generationState.current) {
            const currentIndex = groups.findIndex(
                (group) => group.prompt === generationState.current?.prompt
            );

            if (currentIndex !== -1) {
                current = groups[currentIndex];
                recent = groups.filter((_, index) => index !== currentIndex);
            }
        }
        // If we're not generating, show the previous generation's group as current
        else if (generationState.previous) {
            const previousIndex = groups.findIndex(
                (group) => group.prompt === generationState.previous?.prompt
            );

            if (previousIndex !== -1) {
                current = groups[previousIndex];
                recent = groups.filter((_, index) => index !== previousIndex);
            }
        }
        // If neither current nor previous generation is found, show the most recent
        else if (groups.length > 0) {
            current = groups[0];
            recent = groups.slice(1);
        }

        return [current, recent];
    }, [generatedImages, generationState]);

    const renderImageGrid = useCallback(
        (images: ImageData[]) => (
            <div className="grid grid-cols-2 tb:grid-cols-4 gap-4">
                {images.map((image) => (
                    <ImageDisplay key={image.id} image={image} groupImages={images} />
                ))}
            </div>
        ),
        []
    );

    if (isLoadingImages) {
        return (
            <div className="space-y-8">
                {Array.from({ length: 4 }).map((_, index) => (
                    <PhotoSonicImageLoadingSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="relative">
                {isGenerating && (
                    <div className="space-y-4 w-full">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Current Generation</h3>
                        </div>
                        <PhotoSonicImageLoadingSkeleton resolution={imageRatio} count={imageCount} />
                    </div>
                )}

                {currentGeneration && !isGenerating && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Current Generation</h3>
                            <p className="text-sm text-xw-muted-foreground">
                                {currentGeneration.prompt}
                            </p>
                        </div>
                        {renderImageGrid(currentGeneration.images)}
                    </div>
                )}

                {recentGenerations.length > 0 && (
                    <>
                        <div className="space-y-8 mt-8">
                            <h3 className="text-lg font-medium">Recent Generations</h3>
                            {recentGenerations.map((group, index) => (
                                <div key={index} className="space-y-4">
                                    <p className="text-sm text-xw-muted-foreground">
                                        {group.prompt}
                                    </p>
                                    {renderImageGrid(group.images)}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!isGenerating && !currentGeneration && recentGenerations.length === 0 && (
                    <EmptyScreen
                        title="No Recent Generations"
                        description="Start generating more images to see them here"
                    />
                )}
            </div>
        </div>
    );
};

export default PhotoSonicDisplayGeneratedImages;