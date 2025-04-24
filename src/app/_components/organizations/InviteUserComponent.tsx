"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { CgUserAdd } from "react-icons/cg";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationCustomRoleKey } from "@clerk/types";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "~/components/reusable/XWSelect";
import { useXWAlert } from "~/components/reusable/xw-alert";

const InviteUserComponent = () => {
  const { isLoaded, organization, memberships, invitations } =
    useOrganization();
  const [emailAddress, setEmailAddress] = useState("");
  const [role, setRole] = useState<OrganizationCustomRoleKey | undefined>(
    undefined,
  );
  const [disabled, setDisabled] = useState(false);
  const [roles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const { showToast } = useXWAlert();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (organization) {
      organization.getRoles({ pageSize: 10 }).then((res) => {
        setRoles(res.data.map((role) => role.key as OrganizationCustomRoleKey));
      });
    }
  }, [organization]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailAddress || !role) {
      showToast({
        title: "Invalid input",
        message: "Please provide an email address and select a role.",
        variant: "error",
      });
      return;
    }

    setDisabled(true);
    try {
      await organization?.inviteMember({
        emailAddress,
        role,
      });
      setEmailAddress("");
      setRole(undefined);
      await Promise.all([
        memberships?.revalidate?.(),
        invitations?.revalidate?.(),
      ]);

      showToast({
        title: "Invitation sent",
        message: `Invitation sent to ${emailAddress}`,
        variant: "success",
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to invite user:", error);
      showToast({
        title: "Failed to invite user",
        message:
          "An error occurred while inviting the user. Please try again later.",
        variant: "error",
      });
    } finally {
      setDisabled(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <CgUserAdd className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            We will send an email invitation to the user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full rounded-md border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="font-medium">
              Role
            </label>
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as OrganizationCustomRoleKey)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((roleKey) => (
                  <SelectItem key={roleKey} value={roleKey}>
                    {roleKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={"default"}
            type="submit"
            disabled={disabled}
            className="w-full"
          >
            {disabled ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserComponent;
