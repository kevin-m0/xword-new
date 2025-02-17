import React from 'react';
import PhotoSonicDisplayGeneratedImages from './PhotoSonicDisplayGeneratedImages';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';

const PhotoSonicDisplay: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col">
            <ScrollArea>
                <div className="flex-1 px-5 py-10 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Text To Image</h2>
                        <p className="text-sm text-xw-muted-foreground">
                            Easily create an image from scratch with our AI image generator by entering descriptive text.
                        </p>
                    </div>
                    <PhotoSonicDisplayGeneratedImages />
                </div>
                <ScrollBar />
            </ScrollArea>
        </div>
    );
};

export default PhotoSonicDisplay;

