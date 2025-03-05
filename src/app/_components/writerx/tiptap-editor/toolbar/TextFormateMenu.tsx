"client"

import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Editor } from '@tiptap/core';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const options = [
    { name: 'Paragraph', icon: 'paragraph', action: (editor: Editor) => editor.chain().focus().setNode('paragraph').run(), isActive: (editor: Editor) => editor?.isActive('paragraph') },
    { name: 'Heading 1', icon: 'h1', action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (editor: Editor) => editor?.isActive('heading', { level: 1 }) },
    { name: 'Heading 2', icon: 'h2', action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (editor: Editor) => editor?.isActive('heading', { level: 2 }) },
    { name: 'Heading 3', icon: 'h3', action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (editor: Editor) => editor?.isActive('heading', { level: 3 }) },
    { name: 'Bullet List', icon: 'bullet-list', action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(), isActive: (editor: Editor) => editor?.isActive('bulletList') },
    { name: 'Ordered List', icon: 'number-list', action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(), isActive: (editor: Editor) => editor?.isActive('orderedList') },
    { name: 'Todo List', icon: 'todo-list', action: (editor: Editor) => editor.chain().focus().toggleTaskList().run(), isActive: (editor: Editor) => editor?.isActive('taskList') },
];

const TextFormateMenu = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = useState(false);



    const currentActiveOption = options.find(opt => opt.isActive(editor)) || options[0];

    return (
        <div className="relative">
            <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="gap-2 justify-start w-40">
                        <Image
                            src={`/icons/editor/${currentActiveOption?.icon}.svg`}
                            height={16}
                            width={16}
                            alt={currentActiveOption?.name.toLowerCase() as string}
                        />
                        {currentActiveOption?.name}
                        <ChevronDown className="h-4 w-4 ml-auto mr-0" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-56 z-[99999] flex flex-col gap-1 p-2 border-none">
                    <h1 className="text-xw-muted text-sm mb-2">Text</h1>
                    {options.slice(0, 4).map(({ name, icon, action, isActive }) => (
                        <Button
                            key={name}
                            variant="ghost"
                            className={`justify-start gap-2 ${isActive(editor) ? 'bg-xw-secondary' : ''}`}
                            onClick={() => {
                                action(editor);
                                setOpen(false);
                            }}
                        >
                            <Image src={`/icons/editor/${icon}.svg`} height={16} width={16} alt={name.toLowerCase()} />
                            {name}
                        </Button>
                    ))}

                    <h1 className="text-xw-muted text-sm my-2">Lists</h1>
                    {options.slice(4).map(({ name, icon, action, isActive }) => (
                        <Button
                            key={name}
                            variant="ghost"
                            className={`justify-start gap-2 ${isActive(editor) ? 'bg-xw-secondary' : ''}`}
                            onClick={() => {
                                action(editor);
                                setOpen(false);
                            }}
                        >
                            <Image src={`/icons/editor/${icon}.svg`} height={16} width={16} alt={name.toLowerCase()} />
                            {name}
                        </Button>
                    ))}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TextFormateMenu;
