'use client';

import React from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardHeader } from '~/components/ui/card';

const SelectTemplateSkeleton = () => {
    return (
        <div className='p-3 space-y-4'>
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className='bg-xw-sidebar-two border-none shadow-none'>
                    <CardHeader className='p-3 grid grid-cols-1 tb:grid-cols-4'>
                        <Skeleton className="h-7 w-2/3 mb-4" />

                        <div className="tb:col-span-3 grid grid-cols-2 tb:grid-cols-3 gap-4">
                            {Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map((_, btnIndex) => (
                                <Skeleton
                                    key={btnIndex}
                                    className="h-9 w-full"
                                />
                            ))}
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};

export default SelectTemplateSkeleton;
