import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { DownloadCloud, ChevronLeft, ChevronRight } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { useXWAlert } from '~/components/reusable/xw-alert';
import { Button } from '~/components/ui/button';
import ShareImageComponent from './ShareImageComponent';

interface PhotoSonicImageSliderProps {
    index: number;
    images: string[];
    children: React.ReactNode;
}

const PhotoSonicImageSlider: React.FC<PhotoSonicImageSliderProps> = ({ index, images, children }) => {
    const [currentIndex, setCurrentIndex] = useState(0); // Start at 0 initially
    const [isDownloading, setIsDownloading] = useState(false);
    const { showToast } = useXWAlert();

    useEffect(() => {
        // ✅ Ensure the initial index is set correctly when the dialog opens
        if (index >= 0 && index < images.length) {
            setCurrentIndex(index);
        }
    }, [index, images.length]);

    const currentImage = images[currentIndex];

    // ✅ Download the Correct Current Image
    const downloadImage = async () => {
        if (!currentImage) return;

        setIsDownloading(true);

        try {
            const response = await fetch(currentImage);
            if (!response.ok) throw new Error('Failed to fetch image');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const filename = `image-${currentIndex + 1}-${Date.now()}.png`;

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showToast({
                title: "Success",
                message: "Image downloaded successfully",
                variant: "success"
            });
        } catch (error) {
            console.error('Failed to download image:', error);
            showToast({
                title: "Error",
                message: "Failed to download image",
                variant: "error"
            });
        } finally {
            setIsDownloading(false);
        }
    };

    // ✅ Handle Slide Navigation
    const handleSlideChange = (direction: 'next' | 'prev') => {
        setCurrentIndex((prevIndex) => {
            if (direction === 'next') {
                return (prevIndex + 1) % images.length;
            } else {
                return (prevIndex - 1 + images.length) % images.length;
            }
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-xw-sidebar min-h-[60vh] max-w-6xl w-full rounded-xl">
                {/* ✅ Carousel Container */}
                <div className="relative w-full max-w-lg mx-auto overflow-hidden">
                    <div className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {images.map((image, i) => (
                            <div key={i} className="w-full shrink-0 flex justify-center items-center">
                                <Image
                                    src={image}
                                    alt={`Image ${i + 1}`}
                                    height={400}
                                    width={400}
                                    sizes='100vh'
                                    className="h-full w-auto mx-auto"
                                    priority
                                />
                            </div>
                        ))}
                    </div>
                    {/* ✅ Navigation Buttons */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 -translate-y-1/2 left-2 z-10 rounded-full"
                        onClick={() => handleSlideChange('prev')}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 -translate-y-1/2 right-2 z-10  rounded-full"
                        onClick={() => handleSlideChange('next')}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                {/* ✅ Action Buttons */}
                <div className='flex items-center gap-2 justify-center mt-4'>
                    <ShareImageComponent />
                    <Button
                        variant={"secondary"}
                        className='gap-2'
                        disabled={isDownloading}
                        onClick={downloadImage}
                    >
                        {isDownloading ? "Downloading..." : "Download"}
                        <DownloadCloud className='h-4 w-4' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PhotoSonicImageSlider;
