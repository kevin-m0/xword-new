import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from "@tiptap/extension-image";
import { Extensions } from "@tiptap/core";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { createLowlight, common } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';



import { v4 } from "uuid";

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
import { SlashCommands } from '../editor/newEditor/NewEditorCommandSlash';

const configureLowlight = () => {
    const lowlight = createLowlight(common);
    lowlight.register('html', html);
    lowlight.register('css', css);
    lowlight.register('js', js);
    lowlight.register('ts', ts);
    return lowlight;
};

export const createEditorExtensions = (token: string, setTiptapAIResponseLoading: (loading: boolean) => void): Extensions => {
    const lowlight = configureLowlight();

    return [
        StarterKit.configure({
            history: false,
        }),
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
                class: "rounded-md p-5 bg-xw-sideber text-white"
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
                    if (htmlContent) return false;
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
                class: 'list-none flex flex-col gap-1',
            },
        }),
        TaskItem.configure({
            HTMLAttributes: {
                class: "flex gap-2 flex-wrap"
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
            onError() {
                setTiptapAIResponseLoading(false);
            },
            appId: process.env.NEXT_PUBLIC_APP_ID!,
            autocompletion: true,
            token: process.env.NEXT_PUBLIC_TIPTAP_TOKEN!,
            baseUrl: `https://${process.env.NEXT_PUBLIC_APP_ID!}.collab.tiptap.cloud`,
        }),
        Underline,
    ];
};