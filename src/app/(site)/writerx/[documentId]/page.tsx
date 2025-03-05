import React from "react";
import { auth } from "@clerk/nextjs/server";
import DocumentContentLoader from "~/app/_components/writerx/tiptap-editor/DocumentContentLoader";

type Params = Promise<{ documentId: string }>;

const Page = async({params} :{params: Params}) => {
    const {documentId} = await params;
    return (
        <div className="h-screen overflow-hidden">
            <AuthWrapper docId={documentId} />
        </div>
    );
};

// Separate the async logic into a child component
const AuthWrapper = async ({ docId }: { docId: string }) => {
    const authData = await auth();
    const orgId = authData?.orgId;

    if (!orgId) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                Authentication failed. Please try again.
            </div>
        );
    }

    return <DocumentContentLoader orgId={orgId} docId={docId} />;
};

export default Page;