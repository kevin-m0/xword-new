
'use client'
import React, { useEffect, useState } from 'react';
import { IDocument } from '~/types/docs.types';
import TiptapHeader from './TiptapHeader';
import TiptapToolBar from './toolbar/TiptapToolBar';
import TiptapEditor from './TiptapEditor';
import { trpc } from '~/trpc/react';
import { useEditorInstance } from './hooks/useEditorInstance';
import { Editor } from '@tiptap/core';


const GeneralDocumentComponent = ({ doc }: { doc: IDocument }) => {
    const { data: documentContent, error: isError } = trpc.editor.fetchDocument.useQuery({ id: doc?.docId as string });
    const editor = useEditorInstance(documentContent?.content || '');

    useEffect(() => {
        if (editor && documentContent?.content) {
            editor.commands.setContent(documentContent.content);
        }
    }, [documentContent, editor]);

    if(isError){
        return <div className="text-red-500">Failed to load document. Please try again later.</div>
    }
    return (
        <div className='flex flex-col gap-4 px-4 py-6 overflow-scroll'>
            <TiptapHeader title={doc?.title} id={doc?.id} editor={editor as Editor} />
            <TiptapToolBar editor={editor as Editor} />
            <TiptapEditor editor={editor as Editor} docId={doc?.docId as string} />
        </div>
    );
};


export default GeneralDocumentComponent;






// 'use client'
// import React, { useEffect, useState } from 'react'
// import { IDocument } from '~/types/docs.types'
// import TiptapHeader from './TiptapHeader'
// import { Editor, useEditor } from '@tiptap/react';
// import { editorExtensions } from './EditorExtention';
// import TiptapToolBar from './toolbar/TiptapToolBar';
// import TiptapEditor from './TiptapEditor';
// import { trpc } from '~/trpc/react';

// const GeneralDocumentComponent = ({ doc }: { doc: IDocument }) => {
//     const utils = trpc.useUtils();
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         setIsMounted(true); // Mark component as mounted
//     }, []);

//     const { data: documentContent, isLoading } = trpc.editor.fetchDocument.useQuery({ id: doc?.docId as string });
//     console.log("Fetched document content:", documentContent);

//     // ✅ Initialize the editor
//     const editor = useEditor({
//         extensions: editorExtensions,
//         content: documentContent?.content || '', // Load initial content
//     });

//     const { mutate: updateDocContent } = trpc.editor.updateDocument.useMutation({
//         onSuccess: () => {
//             utils.writerx.getAllDocs.invalidate();
//         },
//         onError: (error) => {
//             console.error("Error updating document content:", error);
//         }
//     });

//     // ✅ Watch for document content updates and update editor
//     useEffect(() => {
//         if (editor && documentContent?.content) {
//             console.log("Updating editor content with:", documentContent.content);
//             editor.commands.setContent(documentContent.content);
//         }
//     }, [documentContent, editor]); // Run whenever documentContent updates

//     useEffect(() => {
//         if (!editor) return;

//         const handleUpdate = () => {
//             const content = editor.getJSON();
//             console.log('Saving content:', content);
//             updateDocContent({ id: doc?.docId as string, content });
//         };

//         editor.on('update', handleUpdate);

//         return () => {
//             editor.off('update', handleUpdate);
//         };
//     }, [editor]);

//     // ✅ Prevent SSR Hydration Mismatch
//     if (!isMounted) return null;

//     return (
//         <div className='flex flex-col gap-2'>
//             <TiptapHeader title={doc?.title} id={doc?.id} editor={editor as Editor} />
//             <TiptapToolBar editor={editor as Editor} />
//             <TiptapEditor editor={editor as Editor} docId={doc?.docId as string} />
//         </div>
//     );
// };

// export default GeneralDocumentComponent;
