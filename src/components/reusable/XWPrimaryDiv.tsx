import { cn } from '@/utils/utils'
import React from 'react'

interface XWPrimaryDivProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
    className?: string
    rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const XWPrimaryDiv = ({
    children,
    className,
    rounded = 'lg',
    ...props
}: XWPrimaryDivProps) => {

    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
    }

    return (
        <div
            className={cn(
                'p-[0.5px] bg-gradient-to-tr from-white/10 via-white/30 to-white/40',
                roundedClasses[rounded],
            )}
        >
            <div className={cn(
                'xw-premium-div h-full w-full',
                roundedClasses[rounded],
                className
            )}
                {...props}

            >
                {children}
            </div>
        </div>
    )
}

export default XWPrimaryDiv
