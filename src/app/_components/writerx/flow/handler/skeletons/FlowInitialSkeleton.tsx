import { Skeleton } from '~/components/ui/skeleton'
import React from 'react'

const FlowInitialSkeleton = () => {
    return (
        <div className=' space-y-4 mb-4'>
            <div className=' space-y-2 mb-4'>
                <Skeleton className='w-[80%] h-12' />
                <Skeleton className='w-[80%] h-4' />
            </div>
            
            <div className='flex items-center gap-2'>
                <Skeleton className='w-16 h-6' />
                <Skeleton className='w-16 h-6' />
            </div>

            <div className='space-y-2'>
                <Skeleton className='h-7 w-1/4' />
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-9 w-24' />
            </div>
        </div>
    )
}

export default FlowInitialSkeleton
