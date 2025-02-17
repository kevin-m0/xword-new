import { redirect } from "next/navigation";
import React from "react";
import PhotoSonicComponent from "~/app/_components/photosonic/PhotoSonicComponent";
import { getUser } from "~/utils/clerk-utility";

const Page: React.FC = async() => {
    const user = await getUser();
    if (!user) redirect("/sign-in");
    return (
        <div >
            <PhotoSonicComponent userId={user.id} />
        </div>
    );
};

export default Page;
