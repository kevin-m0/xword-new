import React, { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '~/components/ui/skeleton';
import { getAwsUrl } from '~/lib/get-aws-url';
import { trpc } from '~/trpc/react';
import DropAssetsBox from '~/app/_components/media/DropAssetsBox';

interface NewImageUploadProps {
    onImageUploaded: (imageUrl: string) => void; // Changed to accept only a single image URL
    selectedImages: string[];
}

const NewImageUpload: React.FC<NewImageUploadProps> = ({ onImageUploaded, selectedImages }) => {
    const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null); // Store only the image key

    const { data: assets, isLoading: assetsLoading, isError: assetsError } = trpc.assets.getAllMediaAssets.useQuery();

    const handleImageClick = (src: string) => {
        setSelectedImageKey(src); // Store the selected image key
        onImageUploaded(src);
    };

    const renderImages = () => {
        if (assetsLoading) {
            return Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square" />
            ));
        }

        if (assetsError || !assets?.images || assets.images.length === 0) {
            return <p className="col-span-3 text-center text-red-500">No images found.</p>;
        }

        return assets.images.map((image: any, index) => (
            <Image
                key={index}
                src={getAwsUrl(image.imageKey) || ''}
                height={300}
                width={300}
                sizes='100vh'
                alt={`Image ${getAwsUrl(image.imageKey) || ''}`}
                onClick={() => handleImageClick(getAwsUrl(image.imageKey) as string)}
                className={`cursor-pointer aspect-square rounded-lg focus:border focus:border-xw-primary object-cover hover:opacity-85 transition-all duration-300 ${selectedImages.includes(getAwsUrl(image.imageKey) as string) ? 'border-2 border-xw-primary' : '' }`}
            />
        ));
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Upload Section */}
            <DropAssetsBox />

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-5">{renderImages()}</div>
        </div>
    );
};

export default NewImageUpload;
