"use client"
import { Editor, EditorContent } from '@tiptap/react'
import React, { useEffect } from 'react'
import './styles/index.css'
import { trpc } from '~/trpc/react';


const TiptapEditor = ({ editor, docId }: { editor: Editor, docId: string }) => {
    const utils = trpc.useUtils();

    const { mutate: updateDocContent } = trpc.editor.updateDocument.useMutation({
        onSuccess: () => {
            utils.writerx.getAllDocs.invalidate();
        },
        onError: (error) => {
            console.error("Error updating document content:", error);
        }
    });
    useEffect(() => {
        if (!editor) return;

        const handleUpdate = () => {
            const content = editor.getJSON();
            console.log('Saving content:', content);
            updateDocContent({ id: docId, content });
        };

        editor.on('update', handleUpdate);

        return () => {
            editor.off('update', handleUpdate);
        };
    }, [editor]);

    return (
        <div>
            <EditorContent
                editor={editor}
                className="tiptap-editor w-full p-3 border rounded-lg bg-gray-600 focus:outline-none"
            />
        </div>
    )
}

export default TiptapEditor
