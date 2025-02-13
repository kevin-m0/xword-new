import { useOrganization } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";

export const useGetActiveSpace = () => {
  const { organization } = useOrganization();

  return trpc.workspace.fetchActiveSpace.useQuery({
    organizationId: organization?.id ?? "",
  });
};
