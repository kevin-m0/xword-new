"use client";

import { useEditor } from "@tiptap/react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { createEditorExtensions } from "./collab-extensionts";
import axios from "axios";
import { v4 } from "uuid";
import { toPng } from "html-to-image";
import { trpc } from "~/trpc/react";
import { getAwsUrl } from "~/lib/get-aws-url";
import { uploadFile } from "~/services/aws-file-upload";
import { TextOptions } from "../../Editor/extensions";

interface User {
    id: string;
    firstName: string;
}

interface UserStatus {
    id: string;
    name: string;
    color: string;
    status: "active" | "idle" | "offline";
    lastActive: number;
}

const renderDate = (date: string) => {
    const d = new Date(date)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const year = d.getFullYear()

    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}`
}

const generateUserColor = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

export const useCollabEditor = ({
    room,
    user,
    theme,
    canEdit
}: {
    room: string;
    user: User;
    theme: string;
    canEdit: boolean
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [versions, setVersions] = useState<any | null>(null);
    const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
    const [activeUsers, setActiveUsers] = useState<Map<number, UserStatus>>(
        new Map()
    );
    const doc = useMemo(() => new Y.Doc(), []);
    const userColor = useMemo(() => generateUserColor(user.id), [user.id]);
    const [tiptapAIResponseLoading, setTiptapAIResponseLoading] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [token, setToken] = useState("");

    const utils = trpc.useUtils();

    const { mutate: updateThumbnail } = trpc.writerx.updateThumbnail.useMutation({
        onSuccess: (data) => {
            // console.log("thumbnail: ", data);
            utils.writerx.getAllDocs.invalidate();

        },
        onError: (error) => {
            console.error("Error updating thumbnail:", error);
        }
    })

    const { mutate: saveDocContent } = trpc.writerx.saveDocContent.useMutation({
        onSuccess: (data) => {
            utils.writerx.getAllDocs.invalidate();
        },
        onError: (error) => {
            console.error("Error updating document content:", error);
        }
    });

    const userData: UserStatus = useMemo(
        () => ({
            id: user.id,
            name: user.firstName,
            color: userColor,
            status: "active",
            lastActive: Date.now(),
        }),
        [user.id, user.firstName, userColor]
    );

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const { data } = await axios.get("/api/getToken/ai");
                setToken(data);
            } catch (error: any) {
                console.error("Error fetching token:", error.message);
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (!room) return;

        const newProvider = new TiptapCollabProvider({
            name: room,
            appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID || "",
            token: process.env.NEXT_PUBLIC_TIPTAP_TOKEN || "",
            document: doc,
        });

        setProvider(newProvider);

        return () => {
            newProvider.destroy();
        };
    }, [room, doc]);

    const editor = useEditor(
        {
            extensions: [
                ...createEditorExtensions(token, setTiptapAIResponseLoading),
                Collaboration.configure({ document: doc }),

                ...(provider
                    ? [
                        CollaborationCursor.configure({
                            provider: provider,
                            user: userData,
                        }),
                        // CollaborationHistory.configure({
                        //     provider,
                        //     onUpdate: (data) => {
                        //         // Update versions when the document is changed
                        //         console.log(data)
                        //         setVersions(data.versions)  // Storing version history in state
                        //     },
                        // }),
                    ]
                    : []),
            ],
            onUpdate: async ({ editor }) => {

                const text = editor.getText();
                saveDocContent({ docId: room, content: text });

                if (!editor.view.dom) {
                    console.error("Editor DOM is null or undefined.");
                    return;
                }
                const loadImages = async () => {
                    const images = editor.view.dom.querySelectorAll("img");
                    const imagePromises = Array.from(images).map(img =>
                        new Promise((resolve) => {
                            if (img.complete) {
                                resolve(null);
                            } else {
                                img.onload = () => resolve(null);
                                img.onerror = () => {
                                    console.warn(`Failed to load image: ${img.src}`);
                                    resolve(null);
                                };
                            }

                            // Set crossorigin attribute for external images
                            if (img.src.startsWith('http')) {
                                img.crossOrigin = 'anonymous';
                            }
                        })
                    );

                    await Promise.all(imagePromises);
                };

                try {
                    await loadImages();

                    const dataUrl = await toPng(editor.view.dom, {
                        quality: 1.0,
                        backgroundColor: theme === "light" ? "#fff" : "#000",
                        style: {
                            padding: "10px",
                            color: "#fff",
                        },
                        filter: (node) => {
                            // Skip nodes that might cause issues
                            if (node instanceof HTMLElement) {
                                const className = node.className || '';
                                return !className.includes('ProseMirror-separator');
                            }
                            return true;
                        },
                        imagePlaceholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                    });

                    if (dataUrl) {
                        const blob = await fetch(dataUrl).then((res) => res.blob());
                        const file = new File([blob], `${v4()}.png`, { type: 'image/png' });
                        let fileName = v4();
                        const imageUrl = getAwsUrl(fileName) as string;
                        await uploadFile(file, fileName);
                        updateThumbnail({ docId: room, image: imageUrl });
                    }
                } catch (error) {
                    console.error("Error creating thumbnail:", error);
                }
            },
            editable: canEdit,
        },
        [provider, userData, doc, token]
    );


    const handleRevert = useCallback(
        async (versionId: number, versionData: any) => {
            // if (!editor || !provider) return;
            console.log("Reverting to version:", versionId, versionData);

            try {
                console.log("Reverting to version:", versionId, versionData);

                // Get version name for the revert message
                const versionName = versionData?.name || `Version ${versionId}`;

                // Execute revert command
                editor?.commands.revertToVersion(
                    versionId,
                    `Revert to ${versionName}`,
                    `Unsaved changes before revert to ${versionName}`
                );



                // Force refresh version history

            } catch (error) {
                console.error("Error reverting version:", error);
                throw new Error(`Failed to revert to version ${versionId}`);
            }
        },
        [editor]
    );


    useEffect(() => {
        setIsMounted(true);
    }, []);

    return {
        editor,
        activeUsers,
        tiptapAIResponseLoading,
        options: { text: selectedText, textLength: 20, textLengthUnit: "characters" } as TextOptions,
        selectedText,
        isMounted,
        handleRevert
    };
};