import { cn } from '@/utils/utils';
import React from 'react';

interface XWLabelProps {
    text: React.ReactNode;
    className?: string;
}

const XWLabel = ({ text, className, ...props }: XWLabelProps) => {
    return (
        <label className={
            cn("text-base font-medium text-white",
                className)
        } {...props}
        >
            {text}
        </label>
    );
};

export default XWLabel;

