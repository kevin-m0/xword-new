import { cn } from '@/utils/utils'
import React from 'react'

interface XWSidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    className?: string
}
const XWSidebarButton = ({ children, className, ...props }: XWSidebarButtonProps) => {
    return (
        <button className={cn(
            'w-full px-3 text-sm bg-transparent py-2 rounded-full flex items-center gap-2',
            `hover:border-l hover:border-l-xw-primary`,
            className
        )}
            {...props}
        >
            {children}
        </button>
    )
}

export default XWSidebarButton
