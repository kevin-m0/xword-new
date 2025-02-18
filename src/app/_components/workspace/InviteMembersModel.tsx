"use client";

import React, { useState, KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import { Plus, X } from "lucide-react";

interface InviteMember {
  email: string;
  role: string;
}

const InviteMembersModel = ({ trigger }: { trigger: React.ReactNode }) => {
  const [members, setMembers] = useState<InviteMember[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const handleAddMember = () => {
    if (email && !members.find((m) => m.email === email)) {
      setMembers([...members, { email, role }]);
      setEmail("");
      setRole("member");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMember();
    }
  };

  const removeMember = (email: string) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const updateMemberRole = (email: string, newRole: string) => {
    setMembers(
      members.map((m) => (m.email === email ? { ...m, role: newRole } : m)),
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-xw-sidebar">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold">
            Invite Members
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription className="text-xw-muted">
          Securely share assets, prompts, and credits. Members will be invited
          via email, and you can send up to 25 invitations at once. More details
        </DialogDescription>

        <div className="flex flex-col gap-5">
          {members.length > 0 && (
            <div className="flex flex-col gap-2">
              {members.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 rounded-md border border-xw-secondary px-2 py-1">
                    <span className="text-sm">{member.email}</span>
                    <button
                      onClick={() => removeMember(member.email)}
                      className="text-xw-muted hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      updateMemberRole(member.email, value)
                    }
                  >
                    <SelectTrigger className="w-fit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                className="w-full"
                placeholder="Enter email addresses"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <XWSecondaryButton onClick={handleAddMember}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </XWSecondaryButton>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="default" size="sm">
            Invite Members
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersModel;
