"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useOrganization } from "@clerk/nextjs";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { Loader2 } from "lucide-react";
import EmptyScreen from "~/components/reusable/EmptyScreen";

export const OrgInvitationsParams = {
  invitations: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const InvitationList = () => {
  const { isLoaded, invitations, memberships } = useOrganization({
    ...OrgInvitationsParams,
  });
  const [isRevoking, setIsRevoking] = useState(false);
  const { showToast } = useXWAlert();

  const handleRevokeInvitation = async (invitation: any) => {
    try {
      setIsRevoking(true);
      await invitation.revoke();

      // Revalidate both memberships and invitations data
      await Promise.all([
        memberships?.revalidate?.(),
        invitations?.revalidate?.(),
      ]);

      showToast({
        title: "Invitation Revoked",
        message: `Successfully revoked invitation for ${invitation.emailAddress}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error revoking invitation:", error);
      showToast({
        title: "Error",
        message: "Failed to revoke invitation. Please try again.",
        variant: "error",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations?.data?.length === 0 && (
        <EmptyScreen
          title="No invitations"
          description="You have not sent any invitations yet."
        />
      )}
      {invitations?.data && invitations?.data?.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.data.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.emailAddress}</TableCell>
                  <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{inv.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleRevokeInvitation(inv)}
                      disabled={isRevoking}
                    >
                      {isRevoking ? <Loader2 className="mr-2 h-4 w-4" /> : null}
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              disabled={!invitations.hasPreviousPage || invitations.isFetching}
              onClick={() => invitations.fetchPrevious()}
            >
              Previous
            </Button>

            <Button
              variant="ghost"
              disabled={!invitations.hasNextPage || invitations.isFetching}
              onClick={() => invitations.fetchNext()}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
