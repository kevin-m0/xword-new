"use client";

import { use } from "react"; // ✅ Import `use` from React
import { useOrganization } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";

interface DocPageProps {
    params: Promise<{ documentId: string }>; // 👈 params is a Promise now
}

const DocPage = ({ params }: DocPageProps) => {
    const { organization } = useOrganization();

    // ✅ Use `use()` to unwrap params
    const { documentId } = use(params);

    const { data } = trpc.writerx.getSingleDoc.useQuery({
        id: documentId,
        spaceId: organization?.id || "",
    });

    console.log("log---------------------->", data);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Document Page</h1>
            <p className="mt-2 text-lg">Document ID: {documentId}</p>
        </div>
    );
};

export default DocPage;












// import React from 'react';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '~/components/ui/button';
// import { trpc } from '~/trpc/react';
// import EmptyScreen from '~/components/reusable/EmptyScreen';
// import { WriterXProvider } from '~/app/_context/writerX-context';
// import WriterXComponent from '~/app/_components/writerx/WriterXComponent';
// import { IDocument } from '~/types/docs.types';
// import { auth } from '@clerk/nextjs/server'
// import { notFound } from 'next/navigation';

// type PageProps = {
//     params: { documentId?: string };  // ✅ Ensure `documentId` is optional to prevent undefined error
// };

// const Page = async ({ params }: PageProps) => {
//     const { userId, orgId } = await auth();
    
//     if (!params?.documentId) {
//         return notFound();  // ✅ Properly handle missing documentId
//     }

//     const { documentId } = params; // ✅ Now it is safe to use params

//     const { data, isLoading } = trpc.writerx.getSingleDoc.useQuery({
//         id: documentId,
//         spaceId: orgId || "",
//     });

//     console.log("data------------------------>", data);
    
//     if (!data && !isLoading) {
//         return (
//             <EmptyScreen
//                 title="No Data Found"
//                 description="We are having trouble fetching data. Please try again. You can go back to the home dashboard."
//                 action={
//                     <Link href="/writerx">
//                         <Button variant="outline">
//                             <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
//                         </Button>
//                     </Link>
//                 }
//             />
//         );
//     }

//     return (
//         <WriterXProvider>
//             {!isLoading && <WriterXComponent doc={data as IDocument} />}
//             {isLoading && (
//                 <div className="h-dvh w-full flex flex-col items-center justify-center">
//                     <Loader2 size={64} className="animate-spin" />
//                 </div>
//             )}
//         </WriterXProvider>
//     );
// };

// export default Page;

// export async function generateStaticParams() {
//     return [];
// }
