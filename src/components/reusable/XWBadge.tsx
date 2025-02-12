import React from 'react';
import { cn } from '@/utils/utils';

interface XWBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

const XWBadge = ({ children, className, ...props }: XWBadgeProps) => {
    return (

        <div
            className={
                cn(
                    ` h-full w-fit px-3 py-1 text-xs text-xw-muted flex items-center ring-0 bg-xw-card  justify-center gap-2 rounded-md`
                    , className,
                    { ...props }
                )
            }
        >
            {children}
        </div>
    );
};

export default XWBadge;
