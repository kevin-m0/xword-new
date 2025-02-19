import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { CreateOrganizationDialog } from "~/app/_components/organizations/CreateOrganizationDialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";

const NewSidebarWorkspacePopover = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization: activeOrg } = useOrganization();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      pageSize: 5,
    },
  });

  const handleSetActive = async (organizationId: string) => {
    if (setActive) {
      try {
        await setActive({ organization: organizationId });
        toast(`Active workspace set to: ${organizationId}`);
      } catch (error) {
        console.error("Error setting active workspace:", error);
      }
    } else {
      console.error("setActive is undefined.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="ml-2 flex w-64 flex-col gap-2">
        <h1 className="p-1 text-sm text-xw-muted">Workspace</h1>
        {userMemberships?.data?.map((workspace) => (
          <div
            key={workspace.organization.id}
            onClick={() => handleSetActive(workspace.organization.id)}
            className={`flex cursor-pointer items-center justify-between rounded-md p-2 ${
              activeOrg?.id === workspace.organization.id
                ? "bg-xw-menu-hover"
                : "hover:bg-xw-menu-hover"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* <Image
                                src="/images/user2.png"
                                alt={workspace.organization.name}
                                width={30}
                                height={30}
                                className="rounded-lg"
                            /> */}
              <span className="flex h-9 w-9 flex-col items-center justify-center rounded-md bg-xw-background capitalize">
                <span>{workspace.organization?.name?.slice(0, 1)}</span>
              </span>
              <div className="flex flex-col text-left">
                <h1 className="mb-0 text-sm font-semibold">
                  {workspace.organization?.name.slice(0, 20)}
                </h1>
                <span className="mt-0 text-xs text-xw-muted">
                  members {workspace.organization?.membersCount}
                </span>
              </div>
            </div>
          </div>
        ))}

        <Separator />

        <CreateOrganizationDialog />

        <Link href="/workspace" className="w-full">
          <Button variant="outline" className="w-full">
            <Settings className="ml-2 h-4 w-4" />
            Workspace Settings
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default NewSidebarWorkspacePopover;
