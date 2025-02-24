import React, { useState } from "react";
import { useNewEditor } from "./useNewEditor";
import { useEffect } from "react";
// import { IDocument } from "@/app/(site)/(dashboard)/_types/docs.types";
import NewEditorTextContainer from "./NewEditorTextContainer";
import NewEditorToolBar from "./NewEditorToolBar";
// import { useWriterXContext } from "@/app/(site)/(dashboard)/_context/writerx-context";
import WriterXSidebar from "../../WriterXSidebar";
import { IDocument } from "~/types/docs.types";
import { useWriterXContext } from "~/app/_context/writerX-context";

interface Props {
    id: string;
    content: string;
    title: string;
    doc: IDocument;
}

const WriterXNewEditorComponent = ({ content, title, id, doc }: Props) => {
    const { editor, selectedText, options, tiptapAIResponseLoading } = useNewEditor({ content: content, id: id, hasWriteAccess: true });
    const { isOpen } = useWriterXContext()
    const [theme, setTheme] = useState(() =>
        localStorage.getItem('tiptap-theme') || 'dark'
    );

    useEffect(() => {
        localStorage.setItem('tiptap-theme', theme);
    }, [theme]);

    return (
        <>
            {editor && (
                <div className='h-dvh flex overflow-hidden'>
                    {isOpen &&
                        <div className='hidden tb:block max-w-lg w-full overflow-hidden'>
                            <WriterXSidebar
                                id={doc.id}
                                content={editor.getText()}
                            />
                        </div>
                    }
                    <div className="flex-1 flex flex-col h-dvh overflow-hidden">
                        <NewEditorToolBar
                            docId={doc.docId!}
                            editor={editor}
                            title={title}
                            id={doc.id}
                            theme={theme}
                            setTheme={setTheme}
                        />
                        <div className={`overflow-y-auto xw-scrollbar w-full h-full ${theme === 'light' ? 'bg-white' : ""}`}>
                            <div className=" max-w-3xl w-full mx-auto ">
                                <NewEditorTextContainer
                                    editor={editor}
                                    selectedText={selectedText}
                                    options={options}
                                    theme={theme}
                                    isLoading={tiptapAIResponseLoading}
                                    isEditable={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WriterXNewEditorComponent;