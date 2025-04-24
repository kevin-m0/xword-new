import { useEditor, Editor } from "@tiptap/react";
import { editorExtensions } from "../EditorExtention";

export const useEditorInstance = (initialContent = "") => {
    const editor = useEditor({
        extensions: editorExtensions,
        content: initialContent,
    });

    return editor;
};
