export interface MediaAssetImage {
    id: string;
    userId: string;
    workspaceId: string;
    imageKey: string;
    imageUrl: string | null;
    prompt: string;
    generationType?: string;
    createdAt: Date;
    User: {
        name: string;
        image: string;
    };
}

export interface MediaAssetsAudio {
    id: string;
    audioKey: string;
    text: string;
    persona: string | null;
    personaId: string | null;
    emotion: string | null;
    speed: string;
    audioScriptId: string | null;
    userId: string;
    workspaceId: string;
    createdAt: string;
    User: {
        name: string | "";
        image: string | "";
    };
}

export interface MediaProjectAudio {
    id: string;
    audioKey: string;
    text: string;
    persona: string | null;
    personaId: string | null;
    emotion: string | null;
    speed: string;
    audioScriptId: string | null;
    userId: string;
    workspaceId: string;
    createdAt: string;
    User: {
        name: string | "";
        image: string | "";
    };
}

export interface MediaProjectAudio {
    id: string;
    audioKey: string;
    text: string;
    persona: string | null;
    personaId: string | null;
    emotion: string | null;
    speed: string;
    audioScriptId: string | null;
    userId: string;
    workspaceId: string;
    createdAt: string;
    User: {
        name: string | "";
        image: string | "";
    };
}

export interface MediaProjectAudioDocs {
    id: string;
    title: string;
    createdAt: Date;
    type: string;
    createdBy: string;
    processStatus: string;
}

// Interface for the documents
export interface MediaProjectDocs {
    id: string;
    title: string;
    role: string;
    access: string;
    createdAt: Date;
    createdBy: string;
    viewCount: number;
}

export interface MediaProjectVideoDocs {
    id: string;
    title: string;
    createdAt: Date;
    videoType: string;
    processStatus: string;
    createdBy: string;
}
