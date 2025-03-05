import React from "react";
import SocialFlowDesign from "~/app/_components/writerx/social-flow/SocialFlowDesign";
import { auth } from "@clerk/nextjs/server";

type Params = Promise<{ id: string }>;

const Page = async({params} :{params: Params}) => {
    const {id} = await params;
    return (
        <div className="h-screen overflow-hidden">
            <AuthWrapper docId={id} />
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

    return <SocialFlowDesign orgId={orgId} docId={docId} />;
};

export default Page;
