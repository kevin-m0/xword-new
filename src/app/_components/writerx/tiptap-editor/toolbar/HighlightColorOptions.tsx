'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '~/components/ui/button';
import { XWDropdown, XWDropdownContent, XWDropdownItem, XWDropdownTrigger } from '~/components/reusable/xw-dropdown';

interface ColorOption {
    name: string;
    color: string;
    text: string;
}

const colorOptions: ColorOption[] = [
    { name: 'Red', color: '#FF0000', text: '#FFFFFF' },
    { name: 'Green', color: '#00FF00', text: '#000000' },
    { name: 'Blue', color: '#0000FF', text: '#FFFFFF' },
    { name: 'Yellow', color: '#FFFF00', text: '#000000' },
    { name: 'Magenta', color: '#FF00FF', text: '#FFFFFF' },
    { name: 'Cyan', color: '#00FFFF', text: '#000000' }
];

interface MulticolorHighlightProps {
    editor: Editor;
}

const HighlightColorOptions: React.FC<MulticolorHighlightProps> = ({ editor }) => {
    const [activeHighlight, setActiveHighlight] = useState<{
        color: string | null;
        textColor: string | null;
    }>({
        color: null,
        textColor: null
    });

    // Update active colors when selection changes
    const updateActiveColors = useCallback(() => {
        const attrs = editor.getAttributes('highlight');
        const textAttrs = editor.getAttributes('textStyle');

        setActiveHighlight({
            color: attrs.color || null,
            textColor: textAttrs.color || null
        });
    }, [editor]);

    useEffect(() => {
        // Listen for both selection and transaction changes
        editor?.on('selectionUpdate', updateActiveColors);
        editor?.on('transaction', updateActiveColors);

        return () => {
            editor?.off('selectionUpdate', updateActiveColors);
            editor?.off('transaction', updateActiveColors);
        };
    }, [editor, updateActiveColors]);

    // const handleColorSelect = useCallback((highlightColor: string, textColor: string) => {
    //     editor
    //         .chain()
    //         .focus()
    //         .setHighlight({ color: highlightColor })
    //         .setColor(textColor)
    //         .run();
    // }, [editor]);

    // const clearFormatting = useCallback(() => {
    //     editor
    //         .chain()
    //         .focus()
    //         .unsetHighlight()
    //         .unsetColor()
    //         .run();
    // }, [editor]);

    const handleColorSelect = useCallback((highlightColor: string, textColor: string) => {
        if (!editor) return;
    
        editor
            .chain()
            .focus()
            .setHighlight({ color: highlightColor }) // Sets highlight color
            .setMark("textStyle", { color: textColor }) // Sets text color
            .run();
    }, [editor]);

    const clearFormatting = useCallback(() => {
        if (!editor) return;
    
        editor
            .chain()
            .focus()
            .unsetHighlight() // Removes highlight
            .unsetMark("textStyle") // Removes text color
            .run();
    }, [editor]);
    

    return (
        <XWDropdown>
            <XWDropdownTrigger asChild>
                <Button
                    className="flex items-center gap-2 justify-start"
                    variant={"ghost"}
                >
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor: activeHighlight.color || '#00FF00',
                        }}
                    />
                    <span className="text-sm">
                        {activeHighlight.color
                            ? colorOptions.find(opt => opt.color === activeHighlight.color)?.name || 'Custom'
                            : 'Highlight'
                        }
                    </span>
                </Button>
            </XWDropdownTrigger>

            <XWDropdownContent className="min-w-[180px] p-2">
                {colorOptions.map(({ name, color, text }) => (
                    <XWDropdownItem
                        key={color}
                        className="flex items-center gap-2 justify-start"
                        onClick={() => handleColorSelect(color, text)}
                    >
                        <span
                            className="h-2 w-2 rounded-full"
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

export default HighlightColorOptions;