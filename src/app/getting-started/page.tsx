"use client";
import { CreateOrganization, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  const { user } = useUser();

  if (user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CreateOrganization afterCreateOrganizationUrl={"/dashboard"} />
      </div>
    );
  } else {
    redirect("/dashboard");
  }
};

export default Page;
