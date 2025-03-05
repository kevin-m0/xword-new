import { Editor, Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button } from '~/components/ui/button';
import { ImageSelector } from '~/app/_components/newflow/flow/support/ImageSelector/ImageSelector';

type CommandItemType = {
    title: string;
    description: string;
    command: (editor: Editor, args?: any) => void;
};

interface SuggestionListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface SuggestionListProps {
    items: CommandItemType[];
    command: (item: CommandItemType) => void;
    editor: Editor;
    onClose?: () => void;  // Changed from onExit to onClose and made optional
}

const suggestionCommands: CommandItemType[] = [
    {
        title: 'Heading 1',
        description: 'Large heading',
        command: (editor: Editor) => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
        },
    },
    {
        title: 'Heading 2',
        description: 'Medium heading',
        command: (editor: Editor) => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
        },
    },
    {
        title: 'Heading 3',
        description: 'Small heading',
        command: (editor: Editor) => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
        },
    },
    {
        title: 'Paragraph',
        description: 'Normal text',
        command: (editor: Editor) => {
            editor.chain().focus().setParagraph().run();
        },
    },
    // add todo list, number list and bullet list below
    {
        title: 'Bullet List',
        description: 'Create a bullet list',
        command: (editor: Editor) => {
            editor.chain().focus().toggleBulletList().run();
        },
    },
    {
        title: 'Number List',
        description: 'Create a number list',
        command: (editor: Editor) => {
            editor.chain().focus().toggleOrderedList().run();
        }
    },
    {
        title: 'Todo List',
        description: 'Create a todo list',
        command: (editor: Editor) => {
            editor.chain().focus().toggleTaskList().run();
        },
    },
    {
        title: 'Bold',
        description: 'Make text bold',
        command: (editor: Editor) => {
            editor.chain().focus().toggleBold().run();
        },
    },
    {
        title: 'Italic',
        description: 'Make text italic',
        command: (editor: Editor) => {
            editor.chain().focus().toggleItalic().run();
        },
    },
    {
        title: 'Underline',
        description: 'Underline text',
        command: (editor: Editor) => {
            editor.chain().focus().toggleUnderline().run();
        },
    },
    {
        title: 'Image',
        description: 'Insert an image',
        command: (editor: Editor, imageUrl?: string) => {
            if (imageUrl && imageUrl.trim() !== '') {
                editor.chain().focus().setImage({ src: imageUrl }).run();
            }
        }
    }
];

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
    const [currentCommand, setCurrentCommand] = useState<CommandItemType | null>(null);

    const closePopup = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            if (item.title === 'Image') {
                setIsImageSelectorOpen(true);
                setCurrentCommand(item);
            } else {
                props.command(item);
                closePopup();
            }
        }
    };

    const handleImageSelected = (images: string[]) => {
        if (images.length > 0 && currentCommand) {
            currentCommand.command(props.editor, images[0]);
            setIsImageSelectorOpen(false);
            closePopup();
        }
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }

            return false;
        },
    }));

    useEffect(() => setSelectedIndex(0), [props.items]);

    return (
        <div className="rounded-lg border w-48 border-xw-border bg-xw-sidebar shadow-md p-1">
            <div>
                <div className="text-xw-muted text-sm p-2">Suggestions</div>
                {props.items.length === 0 ? (
                    <div className="p-2 text-center text-xw-muted">No results found.</div>
                ) : (
                    props.items.map((item, index) => (
                        <Button
                            variant={"ghost"}
                            key={index}
                            onClick={() => selectItem(index)}
                            className={`w-full justify-start p-2 cursor-pointer ${index === selectedIndex ? 'bg-xw-secondary' : ''}`}
                        >
                            <span>{item.title}</span>
                        </Button>
                    ))
                )}

                <ImageSelector
                    open={isImageSelectorOpen}
                    onOpenChange={setIsImageSelectorOpen}
                    single={true}
                    onImagesSelected={handleImageSelected}
                />
            </div>
        </div>
    );
});

SuggestionList.displayName = 'SuggestionList';

export const SlashCommands = Extension.create({
    name: 'slash-commands',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: Editor; range: any; props: any }) => {
                    props.command(editor);
                    editor.chain().focus().deleteRange(range).run();
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                items: ({ query }: { query: string }) => {
                    return suggestionCommands.filter((item) =>
                        item.title.toLowerCase().includes(query.toLowerCase())
                    );
                },
                render: () => {
                    let component: ReactRenderer | null = null;
                    let popup: TippyInstance[] = [];

                    const onClose = () => {
                        if (popup[0]) {
                            popup[0].destroy();
                        }
                        if (component) {
                            component.destroy();
                        }
                    };

                    return {
                        onStart: (props) => {
                            component = new ReactRenderer(SuggestionList, {
                                props: {
                                    ...props,
                                    editor: this.editor,
                                    onClose: onClose,  // Pass the onClose callback
                                },
                                editor: props.editor,
                            });

                            if (props.clientRect) {
                                popup = [
                                    tippy(document.body, {
                                        getReferenceClientRect: () => props.clientRect?.() as DOMRect,
                                        appendTo: () => document.body,
                                        content: component.element,
                                        showOnCreate: true,
                                        interactive: true,
                                        trigger: 'manual',
                                        placement: 'bottom-start',
                                    }),
                                ];
                            }
                        },

                        onUpdate: (props) => {
                            if (component) {
                                component.updateProps({
                                    ...props,
                                    editor: this.editor,
                                    onClose: onClose,  // Pass the onClose callback
                                });

                                if (popup[0] && props.clientRect) {
                                    popup[0].setProps({
                                        getReferenceClientRect: () => props.clientRect?.() as DOMRect,
                                    });
                                }
                            }
                        },

                        onKeyDown: (props) => {
                            if (component?.ref) {
                                return (component.ref as SuggestionListRef).onKeyDown(props);
                            }
                            return false;
                        },

                        onExit: onClose,
                    };
                },
            }),
        ];
    },
});