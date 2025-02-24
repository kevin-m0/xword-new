import axios from "axios";
import { Extensions } from "@tiptap/core";
import { useEditor, Editor } from "@tiptap/react";
import { useEffect, useState, useMemo } from "react";
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
    BubbleMenu,
    TiptapAi,
    OrderedList,
    ListItem,
    BulletList,
    FileHandler,
    Dropcursor,
    Heading,
    Paragraph,
    Text,
    TextOptions,
    ResizableImageExtension,
    SnippetExtension,
    RootBlock,
    CommentsKit,
    Markdown,
    LoaderExtension,
    TextStyle,
    Color,
    Blockquote,
    Bold,
    Italic,
    Strike,
    Underline,
    Superscript,
    Subscript,
    Highlight,
    CharacterCount,
} from "~/components/Editor/extensions";
import { common, createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { SlashCommands } from "./NewEditorCommandSlash";
import { v4 } from "uuid";
import { toPng } from "html-to-image";
import Image from "@tiptap/extension-image";
import { trpc } from "~/trpc/react";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { saveEditorContentToLocalStorage } from "~/utils/utils";
import { getAwsUrl } from "~/lib/get-aws-url";
import { uploadFile } from "~/services/aws-file-upload";

type useNewEditorOptions = {
    id: string;
    content: string;
    hasWriteAccess: boolean;
};

export const useNewEditor = ({ id, content, hasWriteAccess }: useNewEditorOptions) => {
    const lowlight = createLowlight(common);

    lowlight.register('html', html);
    lowlight.register('css', css);
    lowlight.register('js', js);
    lowlight.register('ts', ts);

    const { showToast } = useXWAlert();
    const utils = trpc.useUtils();

    const { mutate: updateThumbnail } = trpc.writerx.updateThumbnail.useMutation({
        onSuccess: (data) => {
            console.log("thumbnail: ", data);
            utils.writerx.getAllDocs.invalidate();

        },
        onError: (error) => {
            console.error("Error updating thumbnail:", error);
            showToast({
                title: "Error",
                message: error.message,
                variant: "error",
            });
        }
    })

    const { mutate: updateDocContent } = trpc.editor.updateDocument.useMutation({
        onSuccess: (data) => {
            utils.writerx.getAllDocs.invalidate();
        },
        onError: (error) => {
            console.error("Error updating document content:", error);
            showToast({
                title: "Error",
                message: error.message,
                variant: "error",
            });
        }
    });

    const { mutate: saveDocContent } = trpc.writerx.saveDocContent.useMutation({
        onSuccess: (data) => {
            utils.writerx.getAllDocs.invalidate();
        },
        onError: (error) => {
            console.error("Error updating document content:", error);
            showToast({
                title: "Error",
                message: error.message,
                variant: "error",
            });
        }
    });

    const [selectedText, setSelectedText] = useState("");
    const [, setLastLine] = useState("");
    const [accessRights, setAccessRights] = useState(false);

    const [token, setToken] = useState("");
    const [tiptapAIResponseLoading, setTiptapAIResponseLoading] =
        useState<boolean>(false);

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


    const baseExtensions: Extensions = [
        StarterKit,
        Image.configure({
            HTMLAttributes: {
                class: "rounded-md p-5 bg-xw-sideber max-w-full h-auto",
                alt: () => `image-${v4()}`,
                loading: "lazy",
            },
            allowBase64: true,
            inline: false,
        }),
        CodeBlockLowlight.configure({
            HTMLAttributes: {
                class: " rounded-md p-5 bg-xw-sideber text-white"
            },
            lowlight,
        }),
        Placeholder.configure({
            placeholder: "Type / For Commands...",
            emptyNodeClass:
                'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
        }),
        Blockquote,
        Bold,
        BubbleMenu.configure({
            element:
                typeof document !== "undefined"
                    ? (document.querySelector(".menu") as HTMLElement)
                    : null,
        }),
        BulletList.configure({
            HTMLAttributes: {
                class: "list-disc ml-4 pl-2",
            },
        }),
        CharacterCount.configure(),
        Color,
        CommentsKit,

        // Document,
        Dropcursor,
        Link.configure({

            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
            protocols: ['http', 'https'],
            linkOnPaste: true,
            HTMLAttributes: {
                target: '_blank',
                rel: 'noopener noreferrer',
            },
            shouldAutoLink: (url) => {
                return url.startsWith('http://') || url.startsWith('https://');
            },
        }),
        FileHandler.configure({
            allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
            onDrop: (currentEditor, files, pos) => {
                files.forEach((file) => {
                    const fileReader = new FileReader();

                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        currentEditor
                            .chain()
                            .insertContentAt(pos, {
                                type: "image",
                                attrs: {
                                    src: fileReader.result,
                                },
                            })
                            .focus()
                            .run();
                    };
                });
            },
            onPaste: (currentEditor, files, htmlContent) => {
                files.forEach((file) => {
                    if (htmlContent) {
                        return false;
                    }

                    const fileReader = new FileReader();

                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        currentEditor
                            .chain()
                            .insertContentAt(currentEditor.state.selection.anchor, {
                                type: "image",
                                attrs: {
                                    src: fileReader.result,
                                },
                            })
                            .focus()
                            .run();
                    };
                });
            },
        }),
        Heading.configure({
            levels: [1, 2, 3],
        }),
        Highlight.configure({
            multicolor: true,
        }),
        Italic,
        ListItem,
        SlashCommands,
        LoaderExtension,
        OrderedList.configure({
            HTMLAttributes: {
                class: "list-decimal ml-4",
            },
        }),
        Markdown,
        Paragraph,
        ResizableImageExtension,
        RootBlock,
        SnippetExtension,
        Strike,
        Subscript,
        Superscript,
        Text,
        TextStyle,
        TaskList.configure({
            HTMLAttributes: {
                class: ' list-none flex flex-col gap-1 ',
            },
        }),
        TaskItem.configure({
            HTMLAttributes: {
                class: " flex gap-2 flex-wrap"
            },
            nested: true,
        }),
        TiptapAi.configure({
            onLoading() {
                setTiptapAIResponseLoading(true);
            },
            onSuccess() {
                setTiptapAIResponseLoading(false);
            },
            appId: process.env.NEXT_PUBLIC_APP_ID!,
            autocompletion: true,
            token: token,
        }),
        Underline,
    ];

    const editor = useEditor(
        {
            editable: hasWriteAccess,
            editorProps: {
                attributes: {
                    class: 'focus:outline-none w-full bg-xw-background',
                },
            },
            extensions: baseExtensions,
            content: content ? content : {},
            onSelectionUpdate: ({ editor }) => {
                const { view, state } = editor;
                const { from, to } = view.state.selection;
                const text = state.doc.textBetween(from, to, "");
                setSelectedText(text);
            },
            onUpdate: async ({ editor }) => {

                const editorContentList = editor
                    .getText()
                    .split("\n")
                    .filter((item) => item !== "");

                const endLine = editorContentList[editorContentList.length - 1];

                setLastLine(endLine as string);
                const { view, state } = editor;

                const { from, to } = view.state.selection;
                const text = state.doc.textBetween(from, to, "");

                setSelectedText(text);
                saveEditorContentToLocalStorage(editor as Editor, id);

                const updatedContent = JSON.stringify(editor.getJSON());

                updateDocContent({ id: id, content: updatedContent });
                // const onlyText = editor.getText();
                // saveDocContent({ docId: id, content: onlyText });

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
                        backgroundColor: "#000",
                        style: {
                            padding: "10px",
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
                        updateThumbnail({ docId: id, image: imageUrl });
                    }
                } catch (error) {
                    console.error("Error creating thumbnail:", error);
                }
            },
            onFocus: ({ editor }) => {
                const editorContentList = editor
                    .getText()
                    .split("\n")
                    .filter((item) => item != "");
                const endLine = editorContentList[editorContentList.length - 1];
                setLastLine(endLine as string);

                const { view, state } = editor;
                const { from, to } = view.state.selection;
                const text = state.doc.textBetween(from, to, "");

                setSelectedText(text);
            },
            // onBlur: ({ editor }) => {
            //     if (!isUpdating) handleUpdateThumbnail(id, editor as Editor, 0);
            // },
        },
        [token]
    ) as Editor;

    useEffect(() => {
        if (accessRights === true) {
            hasWriteAccess ? editor.setEditable(true) : editor.setEditable(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessRights, hasWriteAccess]);

    useEffect(() => {
        const retrievePasteAndRemoveItem = (key: string) => {
            const data = localStorage.getItem(key);
            if (data && data.length > 0 && editor) {
                editor.chain().focus().insertContent(data).run();
                localStorage.removeItem(key);
            }
        };
        try {
            if (editor) {
                setAccessRights(true);
                retrievePasteAndRemoveItem("AIResponse");
                retrievePasteAndRemoveItem("keywordContent");
                retrievePasteAndRemoveItem("mergedContent");
            }
        } catch (err) {
            console.error(err);
        }
    }, [editor]);

    const options = useMemo(() => {
        let options = {
            text: selectedText,
            textLength: 20,
            textLengthUnit: "characters",
        } as TextOptions;
        return options;
    }, [selectedText]);

    return { editor, options, tiptapAIResponseLoading, selectedText };
};

