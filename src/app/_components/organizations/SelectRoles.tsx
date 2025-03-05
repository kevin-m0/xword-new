"use client";

import { useState, useEffect, ChangeEventHandler, useRef } from "react";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationCustomRoleKey } from "@clerk/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";

type SelectRoleProps = {
  fieldName?: string;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  defaultRole?: string;
};

export const SelectRole = (props: SelectRoleProps) => {
  const { fieldName, isDisabled = false, onChange, defaultRole } = props;
  const { organization } = useOrganization();
  const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const isPopulated = useRef(false);

  useEffect(() => {
    if (isPopulated.current) return;
    organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true;
        setRoles(
          res.data.map((roles) => roles.key as OrganizationCustomRoleKey),
        );
      });
  }, [organization?.id, organization]);

  if (fetchedRoles.length === 0) return null;

  return (
    <Select
      name={fieldName}
      disabled={isDisabled}
      onValueChange={onChange as any}
      defaultValue={defaultRole}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {fetchedRoles?.map((roleKey) => (
          <SelectItem key={roleKey} value={roleKey}>
            {roleKey}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
