import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
        codeBlock: false,
    }),
    Underline,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
        placeholder: 'Start writing...',
    }),
    BubbleMenu,
    Color,
    TextStyle,
    Highlight.configure({
        multicolor: true,
    }),
    Image,
    Link,
    CodeBlockLowlight.configure({
        HTMLAttributes: {
            class: " rounded-md p-5"
        },
        lowlight,
    }),
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
];