'use client';

import React, { useState, KeyboardEvent, useEffect } from 'react';
import { XWInput } from './XWInput';
import XWSecondaryButton from './XWSecondaryButton';
import { X } from 'lucide-react';

interface XWSelectTagsProps {
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    disabled?: boolean;
}

const XWSelectTags: React.FC<XWSelectTagsProps> = ({
    value,
    onChange,
    placeholder = 'Type and press enter...',
    maxTags = 10,
    disabled = false
}) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [tags, setTags] = useState<string[]>(value || []);

    useEffect(() => {
        if (value) {
            setTags(value);
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();

            if (tags.length >= maxTags) {
                return;
            }

            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                onChange?.(updatedTags);
                setInputValue('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        onChange?.(updatedTags);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <XWInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled || tags.length >= maxTags}
            />

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <XWSecondaryButton
                            key={index}
                            size="sm"
                            onClick={() => removeTag(tag)}
                            disabled={disabled}
                            className2="justify-start"
                        >
                            {tag}
                            <X className="h-3 w-3" />
                        </XWSecondaryButton>
                    ))}
                </div>
            )}
        </div>
    );
};

export default XWSelectTags;
