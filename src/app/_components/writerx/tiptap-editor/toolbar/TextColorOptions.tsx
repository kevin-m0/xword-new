"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '~/components/ui/button';
import { XWDropdown, XWDropdownContent, XWDropdownItem, XWDropdownTrigger } from '~/components/reusable/xw-dropdown';

interface ColorOption {
    name: string;
    color: string;
}

const colorOptions: ColorOption[] = [
    { name: 'Red', color: '#FF0000' },
    { name: 'Green', color: '#00FF00' },
    { name: 'Blue', color: '#0000FF' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Magenta', color: '#FF00FF' },
    { name: 'Cyan', color: '#00FFFF' }
];

interface TextColorProps {
    editor: Editor;
}

const TextColorOptions: React.FC<TextColorProps> = ({ editor }) => {
    const [activeColor, setActiveColor] = useState<string | null>(null);

    // Update active color when selection changes
    const updateActiveColor = useCallback(() => {
        const attrs = editor.getAttributes('textStyle');
        setActiveColor(attrs.color || null);
    }, [editor]);

    useEffect(() => {
        // Listen for both selection and transaction changes
        editor?.on('selectionUpdate', updateActiveColor);
        editor?.on('transaction', updateActiveColor);

        return () => {
            editor?.off('selectionUpdate', updateActiveColor);
            editor?.off('transaction', updateActiveColor);
        };
    }, [editor, updateActiveColor]);

    const handleColorSelect = useCallback((color: string) => {
        editor
            .chain()
            .focus()
            .setColor(color)
            .run();
    }, [editor]);

    const clearFormatting = useCallback(() => {
        editor
            .chain()
            .focus()
            .unsetColor()
            .run();
    }, [editor]);

    return (
        <XWDropdown>
            <XWDropdownTrigger asChild>
                <Button
                    className=" font-semibold text-lg"
                    variant={activeColor ? "secondary" : "ghost"}
                    style={{ color: activeColor || '#FFFF00' }}
                    size={"icon"}
                >
                    A
                </Button>
            </XWDropdownTrigger>

            <XWDropdownContent className="min-w-[180px] p-2">
                {colorOptions.map(({ name, color }) => (
                    <XWDropdownItem
                        key={color}
                        className="flex items-center gap-2 justify-start"
                        onClick={() => handleColorSelect(color)}
                    >
                        <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{name}</span>
                    </XWDropdownItem>
                ))}
                <XWDropdownItem
                    className=""
                    onClick={clearFormatting}
                >
                    Clear formatting
                </XWDropdownItem>
            </XWDropdownContent>
        </XWDropdown>
    );
};

export default TextColorOptions;