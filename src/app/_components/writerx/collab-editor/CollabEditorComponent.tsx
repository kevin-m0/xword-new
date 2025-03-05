"use client";

import React, { useEffect, useState } from "react";
import { useCollabEditor } from "./useCollabEditor";
import { useWriterXContext } from "~/app/_context/writerX-context";
import { trpc } from "~/trpc/react";
import NewEditorToolBar from "../editor/newEditor/NewEditorToolBar";
import WriterXSidebar from "../WriterXSidebar";
import NewEditorTextContainer from "../editor/newEditor/NewEditorTextContainer";

const CollabEditorComponent = ({
    id,
    title,
    docId,
    edit
}: {
    id: string;
    title: string;
    docId: string;
    edit: boolean
}) => {
    const { isOpen } = useWriterXContext();
    const [theme, setTheme] = useState(() =>
        localStorage.getItem("tiptap-theme") || "dark"
    );
    const { data: user } = trpc.user.getCurrentLoggedInUser.useQuery();
    const collabEditor = useCollabEditor({
        canEdit: edit,
        theme: theme,
        room: docId,
        user: {
            id: user?.id || "",
            firstName: user?.name?.split(" ")[0] || "",
        },
    });



    useEffect(() => {
        localStorage.setItem("tiptap-theme", theme);
    }, [theme]);

    if (!collabEditor?.isMounted) return null;

    const {
        editor,
        options,
        tiptapAIResponseLoading,
        selectedText,
        handleRevert
    } = collabEditor;

    return (
        <>
            {editor && (
                <div className="h-dvh flex overflow-hidden">
                    {isOpen && (
                        <div className="hidden tb:block max-w-lg w-full overflow-hidden">
                            <WriterXSidebar id={id} content={editor.getText()} />
                        </div>
                    )}
                    <div className="flex-1 flex flex-col h-dvh overflow-hidden">
                        {edit ?
                            (
                                <NewEditorToolBar
                                    editor={editor}
                                    title={title}
                                    id={id}
                                    revert={handleRevert}
                                    docId={docId}
                                    theme={theme}
                                    setTheme={setTheme}
                                />
                            )
                            :
                            (
                                <div className="flex items-center gap-2 p-5 border-b border-xw-border">
                                    <h1 className="text-xl font-semibold">{title}</h1>
                                </div>
                            )
                        }
                        <div
                            className={`overflow-y-auto xw-scrollbar w-full h-full ${theme === "light" ? "bg-white" : ""
                                }`}
                        >
                            <div className="max-w-3xl w-full mx-auto">
                                {/* <EditorContent editor={editor} /> */}
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

export default CollabEditorComponent;
