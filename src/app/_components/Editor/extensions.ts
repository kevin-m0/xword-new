import Placeholder from "@tiptap/extension-placeholder";
import BubbleMenu from "@tiptap/extension-bubble-menu";
// import TiptapAi, { TextOptions } from  "@"
import TiptapAi, { TextOptions } from "~/lib/extension-ai";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Collaboration } from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import ResizableImageExtension from "~/lib/extensions/ResizableImage";
import { SnippetExtension } from "~/lib/extensions/Snippet";
import RootBlock from "~/lib/extensions/RootBlock";
import { CommentsKit } from "@tiptap-pro/extension-comments";
import CollaborationHistory from "@tiptap-pro/extension-collaboration-history";
import LoaderExtension from "~/lib/extensions/LoaderExtension";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import CharacterCount from "@tiptap/extension-character-count";
// import { Markdown } from "tiptap-markdown";/

export {
    Placeholder,
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
    Collaboration,
    CollaborationCursor,
    RootBlock,
    CommentsKit,
    CollaborationHistory,
    LoaderExtension,
    TextAlign,
    TextStyle,
    Color,
    Blockquote,
    Bold,
    Italic,
    Strike,
    Underline,
    Subscript,
    Superscript,
    Highlight,
    CodeBlock,
    // Markdown,
    CharacterCount,
};

export type { TextOptions };
