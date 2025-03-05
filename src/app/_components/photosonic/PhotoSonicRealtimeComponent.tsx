'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { isGeneratingRealtimeImageAtom, realTimeImageAtom } from '~/atoms/photosonicAtom';
import AIIcon from '~/icons/Ai';
// import { isGeneratingRealtimeImageAtom, realTimeImageAtom } from '@/atoms';
// import AIIcon from '@/icons/Ai';

const PhotoSonicRealtimeComponent = () => {
    const [realtimeImage] = useAtom(realTimeImageAtom);
    const [isGenerating] = useAtom(isGeneratingRealtimeImageAtom);

    // Determine current state
    const hasImage = !!realtimeImage;
    const isLoading = isGenerating;
    const isIdle = !isGenerating && !hasImage;

    // console.log("Realtime Image:", realtimeImage);
    // console.log("Is Generating:", isGenerating);


    return (
        <div className="flex-1 w-full h-full bg-xw-background-secondary p-6">
            <div className="h-full w-full relative rounded-lg border border-xw-secondary bg-xw-background">
                {/* Loading State */}
                {isLoading && (
                    <div
                        className="h-full w-full flex items-center justify-center"
                        aria-live="polite"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-xw-muted">Generating...</p>
                        </div>
                    </div>
                )}

                {/* No Image State */}
                {isIdle && (
                    <div
                        className="h-full w-full flex items-center justify-center"
                        aria-live="polite"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <AIIcon className="h-8 w-8 text-primary" />
                            <p className="text-xw-muted">
                                Start typing to generate an image...
                            </p>
                        </div>
                    </div>
                )}

                {/* Generated Image State */}
                {hasImage && !isLoading && (
                    <div className="h-full w-full relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src={realtimeImage}
                                alt="Generated Image"
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-300"
                                quality={100}
                                priority={true}
                                onError={(e) => {
                                    e.currentTarget.src = '/fallback-image.png'; // Fallback for errors
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoSonicRealtimeComponent;
