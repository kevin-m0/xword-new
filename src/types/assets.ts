export type AssetType = 'Folder' | 'Audio' | 'Video' | 'Image' | 'Document';

export interface Asset {
    id: number;
    name: string;
    type: AssetType;
    items?: string;
    duration?: string;
    created: string;
    creator: {
        name: string;
        image: string;
    };
}

export const ASSET_TYPES: Record<AssetType, { label: string; icon: string }> = {
    Folder: {
        label: "Folder",
        icon: "/images/folder.svg"
    },
    Audio: {
        label: "Audio",
        icon: "/audio-file.svg"
    },
    Video: {
        label: "Video",
        icon: "/images/video-file.svg"
    },
    Image: {
        label: "Image",
        icon: "/images/image-file.svg"
    },
    Document: {
        label: "Document",
        icon: "/images/docs.svg"
    }
}; 