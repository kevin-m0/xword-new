"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { OrganizationResource } from "@clerk/types";
import { useXWAlert } from "~/components/reusable/xw-alert";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

import { RenameOrganizationDialog } from "./RenameOrganizationDialog";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

export const CustomOrganizationSwitcher = () => {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  console.log("userMemberships: ", userMemberships);

  const { organization: activeOrg } = useOrganization();
  const { showToast } = useXWAlert();

  // For inline delete confirmation
  const [orgToDelete, setOrgToDelete] = useState<OrganizationResource | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrg = async () => {
    if (!orgToDelete) return;
    try {
      setIsDeleting(true);
      await orgToDelete.destroy();
      // If you want to switch to a different org automatically:
      //   if (userMemberships?.data?.length) {
      //     setActive({ organization: userMemberships.data[0].organization.id })
      //   }
      await userMemberships?.revalidate?.();
      showToast({
        title: "Organization deleted",
        message: `Successfully deleted ${orgToDelete.name}.`,
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        message: "Failed to delete organization. Please try again.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
      setOrgToDelete(null);
    }
  };

  if (!isLoaded) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Workspaces</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* List existing organizations */}
        {userMemberships.data?.map((mem) => {
          const org = mem.organization;
          const isActive = activeOrg?.id === org.id;

          return (
            <div
              key={mem.id}
              className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg p-1 hover:bg-xw-secondary ${isActive ? "bg-xw-primary" : ""}`}
              aria-pressed={isActive}
              onClick={() => setActive({ organization: org.id })}
            >
              <div className="ml-0 mr-auto flex items-center gap-2 px-2">
                {isActive && <CheckCircle className="h-4 w-4" />}
                <span className="">{org.name}</span>
              </div>

              {/* Popover for rename/delete */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    className="hover:bg-white/30"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex w-48 flex-col gap-1 p-2">
                  {/* RENAME */}
                  <RenameOrganizationDialog
                    organization={org}
                    onSuccess={() => userMemberships.revalidate?.()}
                  />

                  {/* DELETE */}
                  <Button
                    variant="destructive"
                    onClick={() => setOrgToDelete(org)}
                  >
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          );
        })}

        {/* Pagination Controls
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="ghost"
            disabled={
              !userMemberships.hasPreviousPage || userMemberships.isFetching
            }
            onClick={() => userMemberships.fetchPrevious()}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={
              !userMemberships.hasNextPage || userMemberships.isFetching
            }
            onClick={() => userMemberships.fetchNext()}
          >
            Next
          </Button>
        </div> */}

        {/* Divider */}
        <div className="my-2 flex justify-center border-t border-xw-border pt-2">
          {/* CreateOrganizationDialog embedded in the switcher */}
          <CreateOrganizationDialog
            afterCreate={() => userMemberships.revalidate?.()}
          />
        </div>
      </CardContent>

      {/* Inline confirmation for Delete, or use a Dialog if you prefer */}
      {orgToDelete && (
        <div className="mt-2 space-y-2 rounded-md bg-red-50 p-4 text-red-900">
          <p>
            Are you sure you want to delete <strong>{orgToDelete.name}</strong>?
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOrgToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteOrg}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
