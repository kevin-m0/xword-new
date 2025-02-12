"use client"

import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/utils/utils'

type Position =
    | 'top-center'
    | 'right-top'
    | 'right-center'
    | 'right-bottom'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
    | 'left-bottom'
    | 'left-center'
    | 'left-top'

type ColorVariant = 'white' | 'green'

interface TooltipContextType {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined)

interface TooltipProviderProps {
    children: React.ReactNode
}

export const TooltipProvider = ({ children }: TooltipProviderProps) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </TooltipContext.Provider>
    )
}

interface TooltipContentProps {
    position?: Position
    variant?: ColorVariant
    children: React.ReactNode
    className?: string
}

export const TooltipContent = ({
    position = 'top-center',
    variant = 'white',
    children,
    className
}: TooltipContentProps) => {
    const context = useContext(TooltipContext)
    if (!context) throw new Error('TooltipContent must be used within TooltipProvider')
    const { isOpen } = context

    if (!isOpen) return null

    const baseStyles = cn(
        'absolute z-50',
        variant === 'white' ? 'bg-white' : 'bg-[rgba(235,249,238,1)]',
        'p-3 rounded-md text-sm text-gray-800',
        'shadow-sm',
        'whitespace-normal',
        'max-w-[250px]',
        getPositionStyles(position),
        className
    )

    return (
        <div className={baseStyles}>
            {children}
            <div className={getPointerStyles(position, variant)} />
        </div>
    )
}

interface TooltipTriggerProps {
    children: React.ReactNode
    className?: string
}

export const TooltipTrigger = ({ children, className }: TooltipTriggerProps) => {
    const context = useContext(TooltipContext)
    if (!context) throw new Error('TooltipTrigger must be used within TooltipProvider')
    const { setIsOpen } = context

    return (
        <div
            className={cn("relative inline-flex", className)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {children}
        </div>
    )
}

// Helper functions
const getPositionStyles = (position: Position): string => {
    const positions = {
        'top-center': '-translate-x-1/2 -translate-y-1 left-1/2 bottom-[100%] mb-1',
        'right-top': 'left-[100%] top-0 ml-2',
        'right-center': 'left-[100%] top-1/2 -translate-y-1/2 ml-2',
        'right-bottom': 'left-[100%] bottom-0 ml-2',
        'bottom-right': 'top-[100%] right-0 mt-2',
        'bottom-center': 'top-[100%] left-1/2 -translate-x-1/2 mt-2',
        'bottom-left': 'top-[100%] left-0 mt-2',
        'left-bottom': 'right-[100%] bottom-0 mr-2',
        'left-center': 'right-[100%] top-1/2 -translate-y-1/2 mr-2',
        'left-top': 'right-[100%] top-0 mr-2'
    }
    return positions[position]
}

const getPointerStyles = (position: Position, variant: ColorVariant): string => {
    const baseStyles = cn(
        'absolute w-2 h-2',
        variant === 'white' ? 'bg-white' : 'bg-[rgba(235,249,238,1)]',
        'rotate-45'
    )

    const positions = {
        'top-center': 'bottom-[-4px] left-1/2 -translate-x-1/2',
        'right-top': 'left-[-4px] top-3',
        'right-center': 'left-[-4px] top-1/2 -translate-y-1/2',
        'right-bottom': 'left-[-4px] bottom-3',
        'bottom-right': 'top-[-4px] right-3',
        'bottom-center': 'top-[-4px] left-1/2 -translate-x-1/2',
        'bottom-left': 'top-[-4px] left-3',
        'left-bottom': 'right-[-4px] bottom-3',
        'left-center': 'right-[-4px] top-1/2 -translate-y-1/2',
        'left-top': 'right-[-4px] top-3'
    }

    return `${baseStyles} ${positions[position]}`
}
