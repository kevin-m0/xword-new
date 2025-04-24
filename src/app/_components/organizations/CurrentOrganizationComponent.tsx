"use client";
import React from "react";
import { MemberRoles } from "./MemberRoles";
import { Button } from "~/components/ui/button";
import { InvitationList } from "./InvitationList";
import InviteUserComponent from "./InviteUserComponent";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useXWAlert } from "~/components/reusable/xw-alert";

const CurrentOrganizationComponent = () => {
  const [tab, setTab] = React.useState("members");
  const { organization, memberships } = useOrganization();
  const { userMemberships } = useOrganizationList({
    userMemberships: { pageSize: 100 },
  });
  // const { userMemberships, setActive } = useOrganizationList()
  const { showToast } = useXWAlert();

  const deleteOrganization = async () => {
    try {
      await organization?.destroy();

      // if (setActive) {
      //     setActive({ organization: userMemberships?.data?.[0]?.organization.id });
      // }

      await Promise.all([
        userMemberships?.revalidate?.(),
        memberships?.revalidate?.(),
      ]);

      showToast({
        title: "Organization deleted",
        message: "Organization deleted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting organization:", error);
      showToast({
        title: "Error",
        message: "Failed to delete organization. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex w-fit items-center gap-2 rounded-lg bg-xw-card p-1">
          <Button
            onClick={() => setTab("members")}
            variant={tab === "members" ? "default" : "ghost"}
          >
            Members
          </Button>
          <Button
            onClick={() => setTab("invitations")}
            variant={tab === "invitations" ? "default" : "ghost"}
          >
            Invitations
          </Button>
        </div>

        <InviteUserComponent />
      </div>
      {tab === "members" ? <MemberRoles /> : <InvitationList />}
    </div>
  );
};

export default CurrentOrganizationComponent;
