import { cn } from '@/utils/utils';
import React from 'react';

interface XWButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon_sm';
    className1?: string;
    className2?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    rounded?: 'md' | 'lg' | 'full';
}

const XWButton = ({ children, disabled, className1, className2, size = 'default', type = 'button', rounded = 'lg', ...props }: XWButtonProps) => {
    const sizeClasses = {
        default: "py-2 px-4 text-sm",
        sm: "px-2 py-2 text-sm",
        lg: "px-8 py-4",
        icon: " w-10",
        "icon_sm": "h-8 w-8",
    };

    return (
        <button className={cn('xw-gradient-primary-border h-9 rounded-lg flex items-center justify-center xw-button focus:ring-1 focus:ring-offset-transparent focus:ring-xw-primary', className1,
            size === "sm" ? "h-8 p-[0.8px]" : size === "lg" ? "h-11" : size === "icon" ? "h-9 w-9 p-[0.8px]" : size === "icon_sm" ? "h-8 w-8" : "h-9"
        )}
            disabled={disabled}
            {...props}
        >
            <span
                className={
                    cn(
                        `flex-1 h-full flex items-center ring-0 bg-xw-background hover:bg-xw-sidebar hover:duration-150   justify-center gap-2 text-white ${sizeClasses[size]} rounded-lg`
                        , className2,
                        disabled ? " text-xw-muted" : "",

                    )
                }
            >
                {children}
            </span>
        </button>
    );
};

export default XWButton;

