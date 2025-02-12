
export interface IDocument {
    id: string;
    title: string;
    role: "OWNER" | "USER";
    access: "READ" | "WRITE";
    createdAt: Date;
    updatedAt: Date;
    userId?: string;
    folderId?: string;
    organizationId?: string;
    spaceId?: string;
    isStarred: boolean;
    viewCount?: number;
    redirectId?: string;
    thumbnailImageUrl?: string;
    thumbnailImageId?: string;
    content?: string;
    docId?: string;
    isFirstOpen: boolean;
    promptId?: string;
    assetFolderId?: string;
    createdBy: string;
}
