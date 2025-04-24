"use client";
import { CreateOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/dashboard"); // Redirect for unauthenticated users
    }
  }, [user, router]);

  if (!user) return null; // Prevent rendering before redirect

  return (
    <div className="flex h-screen items-center justify-center">
      <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
    </div>
  );
};

export default Page;
