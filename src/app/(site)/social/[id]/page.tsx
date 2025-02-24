'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';
import { trpc } from '~/trpc/react';
import SocialFlowDesign from '~/app/_components/writerx/social-flow/SocialFlowDesign';

const Page = ({ params }: { params: { id: string } }) => {
    const { organization } = useOrganization(); 
    const orgId = organization?.id  || ""; 

    const { data, isLoading } = trpc.writerx.fetchSocialDocument.useQuery(
        { id: params.id, spaceId: orgId },
        { enabled: !!orgId }
    );

    console.log("data------------->", data);
    
    return (
        <div>
            {isLoading && !data ? (
                <div className='h-dvh w-full flex flex-col items-center justify-center'>
                    <Loader2 className='h-12 w-12 animate-spin' />
                </div>
            ) : (
                <SocialFlowDesign doc={data} loading={isLoading} />
            )}
        </div>
    );
};

export default Page;
