'use client';

import React from 'react';
import { BiQuestionMark } from 'react-icons/bi';
import { useAtom } from 'jotai';
import PhotoSonicRealTimeGenerationForm from './PhotoSonicRealTimeGenerationForm';
import XWTabs from '~/components/reusable/XWTabs';
import { PHOTO_SONIC_MODE, photoSonicModeAtom } from '~/atoms/photosonicAtom';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/reusable/xw-tooltip';
import { Button } from '~/components/ui/button';
import PhotoSonicImageGenerationForm from './PhotoSonicImageGenerationForm';

interface PhotoSonicFormProps {
    userId: string;
}

const PhotoSonicForm: React.FC<PhotoSonicFormProps> = ({ userId }) => {
    const [photosonicMode, setPhotosonicMode] = useAtom(photoSonicModeAtom);

    const activeTab: 'Simple' | 'Real Time' = photosonicMode === PHOTO_SONIC_MODE.Simple ? 'Simple' : 'Real Time';

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <div className="p-4 border-b border-xw-border">
                <div className="flex items-center gap-4">
                    <XWTabs
                        tabs={[
                            { id: 'Simple', label: 'Simple', icon: '' },
                            { id: 'Real Time', label: 'Real Time', icon: '' }
                        ]}
                        activeTab={activeTab}
                        onChange={(tab) => {
                            setPhotosonicMode(tab === 'Simple' ? PHOTO_SONIC_MODE.Simple : PHOTO_SONIC_MODE["Real Time"]);
                        }}
                    />
                    <TooltipProvider>
                        <TooltipTrigger>
                            <Button size="icon" className="h-7 w-7 p-0 rounded-full" variant="outline">
                                <BiQuestionMark className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent variant="white" position="right-center" className="text-sm max-w-xs mx-2">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </TooltipContent>
                    </TooltipProvider>
                </div>
            </div>

            {/* Dynamic Form Rendering */}
            <div className="flex-1 overflow-y-auto xw-scrollbar">
                {photosonicMode === PHOTO_SONIC_MODE.Simple ? (
                    <PhotoSonicImageGenerationForm userId={userId} />
                ) : (
                    <PhotoSonicRealTimeGenerationForm userId={userId} />
                )}
            </div>
        </div>
    );
};

export default PhotoSonicForm;
