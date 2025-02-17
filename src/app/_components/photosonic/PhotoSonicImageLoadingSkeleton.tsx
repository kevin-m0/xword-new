import { Skeleton } from "~/components/ui/skeleton";
import { Loader } from "lucide-react";

type PhotoSonicImageLoadingSkeletonProps = {
    count?: number;
    resolution?: string;
};

const PhotoSonicImageLoadingSkeleton: React.FC<PhotoSonicImageLoadingSkeletonProps> = ({
    count = 4,
    resolution = "1024x768",
}) => {
    const [width = 1024, height = 768] = resolution.split("x").map(Number);

    const aspectRatio = (height / width) * 100;

    return (
        <div>
            <div className="mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 mt-2 w-[80%]" />
            </div>
            <div className="grid grid-cols-2 tb:grid-cols-4 gap-4">
                {Array.from({ length: count }, (_, i) => (
                    <Skeleton
                        key={i}
                        className="relative rounded-lg overflow-hidden"
                        style={{ paddingTop: `${aspectRatio}%` }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader className="h-6 w-6 animate-spin text-xw-muted" />
                        </div>
                    </Skeleton>
                ))}
            </div>
        </div>
    );
};

export default PhotoSonicImageLoadingSkeleton;
