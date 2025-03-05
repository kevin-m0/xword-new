"client"

import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Editor } from '@tiptap/core';
import { ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import React, { useState } from 'react';

const alignments = [
    { name: 'Left', Icon: AlignLeft, action: (editor: Editor) => editor.chain().focus().setTextAlign('left').run(), isActive: (editor: Editor) => editor?.isActive({ textAlign: 'left' }) },
    { name: 'Center', Icon: AlignCenter, action: (editor: Editor) => editor.chain().focus().setTextAlign('center').run(), isActive: (editor: Editor) => editor?.isActive({ textAlign: 'center' }) },
    { name: 'Right', Icon: AlignRight, action: (editor: Editor) => editor.chain().focus().setTextAlign('right').run(), isActive: (editor: Editor) => editor?.isActive({ textAlign: 'right' }) },
    { name: 'Justify', Icon: AlignJustify, action: (editor: Editor) => editor.chain().focus().setTextAlign('justify').run(), isActive: (editor: Editor) => editor?.isActive({ textAlign: 'justify' }) },
];

const TextAlignmentMenu = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = useState(false);

    const currentActiveAlignment = alignments.find(opt => opt.isActive(editor)) || alignments[0];

    return (
        <div className="relative">
            <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="gap-2 justify-start w-40">
                        {
                            currentActiveAlignment &&
                            <currentActiveAlignment.Icon className="h-4 w-4" />
                        }
                        {currentActiveAlignment?.name}
                        <ChevronDown className="h-4 w-4 ml-auto mr-0" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-56 z-[99999] flex flex-col gap-1 p-2 border-none">
                    {alignments.map(({ name, Icon, action, isActive }) => (
                        <Button
                            key={name}
                            variant="ghost"
                            className={`justify-start gap-2 ${isActive(editor) ? 'bg-xw-secondary' : ''}`}
                            onClick={() => {
                                action(editor);
                                setOpen(false);
                            }}
                        >
                            <Icon className="h-4 w-4" />
                            {name}
                        </Button>
                    ))}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TextAlignmentMenu;
