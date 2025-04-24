"use client";

import { useState, useEffect, useRef } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import type { OrganizationCustomRoleKey } from "@clerk/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useXWAlert } from "~/components/reusable/xw-alert";
import EmptyScreen from "~/components/reusable/EmptyScreen";
import { Loader2 } from "lucide-react";

type SelectRoleProps = {
  memberId: string;
  currentRole: string;
  onRoleChange: (memberId: string, newRole: string) => Promise<void>;
  isDisabled: boolean;
};

const SelectRole = ({
  memberId,
  currentRole,
  onRoleChange,
  isDisabled,
}: SelectRoleProps) => {
  const { organization } = useOrganization();
  const [roles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const isPopulated = useRef(false);

  useEffect(() => {
    if (isPopulated.current) return;
    organization?.getRoles({ pageSize: 20, initialPage: 1 }).then((res) => {
      isPopulated.current = true;
      setRoles(res.data.map((role) => role.key as OrganizationCustomRoleKey));
    });
  }, [organization?.id, organization]);

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={(value) => onRoleChange(memberId, value)}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role">{currentRole}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {roles.map((roleKey) => (
          <SelectItem key={roleKey} value={roleKey}>
            {roleKey}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const MemberRoles = () => {
  const { user } = useUser();
  const { isLoaded, memberships } = useOrganization({
    memberships: { pageSize: 10 },
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useXWAlert();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setIsUpdating(true);
    try {
      const membership = memberships?.data?.find((mem) => mem.id === memberId);
      if (membership) {
        await membership.update({ role: newRole });
      }

      await memberships?.revalidate?.();

      showToast({
        title: "Role updated",
        message: "The role has been updated for the member.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(true);
    try {
      const membership = memberships?.data?.find((mem) => mem.id === memberId);
      if (membership) {
        await membership.destroy();
      }

      await memberships?.revalidate?.();

      showToast({
        title: "Member removed",
        message: "The member has been removed from the organization.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-4">
      {memberships?.data && memberships?.data?.length === 0 && (
        <EmptyScreen
          title="No members"
          description="You have no members in this organization."
        />
      )}
      {memberships && memberships.data && memberships.data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships?.data?.map((mem) => (
                <TableRow key={mem.id}>
                  <TableCell>
                    {mem.publicUserData.identifier}{" "}
                    {mem.publicUserData.userId === user?.id && "(You)"}
                  </TableCell>
                  <TableCell>{mem.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <SelectRole
                      memberId={mem.id}
                      currentRole={mem.role}
                      onRoleChange={handleRoleChange}
                      isDisabled={isUpdating}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMember(mem.id)}
                      disabled={
                        isUpdating || mem.publicUserData.userId === user?.id
                      }
                    >
                      {isRemoving && mem.publicUserData.userId === user?.id ? (
                        <Loader2 className="animate-spin" />
                      ) : null}
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div>
            <Button
              variant={"ghost"}
              disabled={
                !memberships?.hasPreviousPage || memberships?.isFetching
              }
              onClick={() => memberships?.fetchPrevious?.()}
            >
              Previous
            </Button>

            <Button
              variant={"ghost"}
              disabled={!memberships?.hasNextPage || memberships?.isFetching}
              onClick={() => memberships?.fetchNext?.()}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
