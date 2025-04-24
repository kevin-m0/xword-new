import { useAtom } from "jotai";
import { Ghost, Loader } from "lucide-react";
import { EditorContent, Editor } from "@tiptap/react";
// import { TextOptions } from "~lib/extension-ai";
import { yjsProviderLoading } from "~/atoms";
import NewEditorBubbleMenu from "./NewEditorBubble";
import { TextOptions } from "~/app/_components/Editor/extensions";

const NewEditorTextContainer = ({
    editor,
    selectedText,
    options,
    isLoading,
    isEditable,
    theme
}: {
    editor: Editor;
    selectedText: string;
    options: TextOptions;
    isLoading: boolean;
    isEditable: boolean;
    theme: string;
}) => {
    // Getting loading state of Yjs provider from global context.
    const [yjsLoading] = useAtom(yjsProviderLoading);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const content = e.dataTransfer.getData("text/plain");
        const imageUrl = e.dataTransfer.getData("text/uri-list");
        if (imageUrl) {

            editor.chain().focus().setImage({ src: imageUrl }).run();
            return;
        }
        if (content) {
            editor
                .chain()
                .focus("end")
                .insertContentAt(editor.state.selection.anchor, content)

                .run();
            editor.commands.selectTextblockEnd();
        }

    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

    };

    return (
        <div
            className="flex-1 flex flex-col overflow-hidden "
            onClick={() => {
                isEditable && editor.commands.focus();
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {yjsLoading ? (
                <div className="items-center justify-center flex h-full w-full pb-5">
                    <div className="flex items-center justify-center">
                        <Ghost className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-center">
                        <Loader className="h-4 w-4 animate-spin mr-3" />
                        <span>Hold tight, loading your data!</span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 py-5 px-5 overflow-auto xw-scrollbar ">
                    {editor && (
                        <NewEditorBubbleMenu
                            editor={editor}
                            selectedText={selectedText}
                            options={options}
                            isLoading={isLoading}
                        />
                    )}
                    <EditorContent
                        className={`tiptap `}
                        data-theme={theme}
                        editor={editor} />
                </div>
            )}
        </div>
    );
};

export default NewEditorTextContainer;
