import { CreateOrganization } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <CreateOrganization afterCreateOrganizationUrl={"/dashboard"} />
    </div>
  );
};

export default Page;
