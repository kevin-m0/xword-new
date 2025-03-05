'use client';

import React from 'react';
import { useAtom } from 'jotai';
import PhotoSonicForm from './PhotoSonicForm';
import PhotoSonicRealtimeComponent from './PhotoSonicRealtimeComponent';
import PhotoSonicMobileForm from './PhotoSonicMobileForm';
import PhotoSonicDisplay from './PhotoSonicDisplay';
import { PHOTO_SONIC_MODE, photoSonicModeAtom } from '~/atoms/photosonicAtom';

interface PhotoSonicComponentProps {
    userId: string;
}

const PhotoSonicComponent: React.FC<PhotoSonicComponentProps> = ({ userId }) => {
    const [photoSonicMode] = useAtom(photoSonicModeAtom);

    console.log("userId--------------------->", userId);

    return (
        <div className="flex flex-col tb:flex-row h-screen w-full overflow-hidden">
            <div className="tb:hidden flex justify-between items-center gap-2 px-5 py-3">
                <h1 className="text-2xl font-semibold mb-2">Text To Image</h1>
                <div>
                    <PhotoSonicMobileForm userId={userId} />
                </div>
            </div>

            {photoSonicMode === PHOTO_SONIC_MODE.Simple && <PhotoSonicDisplay />}
            {photoSonicMode === PHOTO_SONIC_MODE["Real Time"] && <PhotoSonicRealtimeComponent />}
            
            <div className="hidden tb:flex max-w-sm w-full h-full bg-xw-background border-l border-xw-secondary overflow-y-auto xw-scrollbar">
                <PhotoSonicForm userId={userId} />
            </div>
        </div>
    );
};

export default PhotoSonicComponent;
