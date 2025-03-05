"use client"
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { WriterXProvider } from '~/app/_context/writerX-context';
import EmptyScreen from '~/components/reusable/EmptyScreen';
import { Button } from '~/components/ui/button';
import { trpc } from '~/trpc/react';
import GeneralDocumentComponent from './GeneralDocumentComponent';
import { IDocument } from '~/types/docs.types';

const DocumentContentLoader = ({ orgId, docId }: { orgId: string; docId: string }) => {

    const { data, isLoading } = trpc.writerx.getSingleDoc.useQuery({
        id: docId as string,
        workSpaceId: orgId || "",
    });

    if (!data && !isLoading) {
        return (
            <EmptyScreen
                title="No Data Found"
                description="We are having trouble fetching data. Please try again. You can go back to the home dashboard."
                action={
                    <Link href="/writerx">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
                        </Button>
                    </Link>
                }
            />
        );
    }
    return (
        <WriterXProvider>
            {!isLoading && <GeneralDocumentComponent doc={data as IDocument} />}
            {isLoading && (
                <div className="h-dvh w-full flex flex-col items-center justify-center">
                    <Loader2 size={64} className="animate-spin" />
                </div>
            )}
        </WriterXProvider>
    );
}

export default DocumentContentLoader


