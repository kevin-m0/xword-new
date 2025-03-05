import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import PhotoSonicComponent from "~/app/_components/photosonic/PhotoSonicComponent";

const Page: React.FC = async() => {
    const { userId } = await auth()

    // console.log("user---------------->", userId, orgId );
    
    if (!userId) redirect("/sign-in");
    return (
        <div >
            <PhotoSonicComponent userId={userId} />
        </div>
    );
};

export default Page;
