import { useMemo, useCallback } from "react";
import { useOrganizationList } from "@clerk/nextjs";

export const useOrgList = () => {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
      keepPreviousData: true,
    },
  });

  // Ensure setActive is always a function to prevent issues
  const safeSetActive = useCallback(
    (org: { organization: string }) => {
      if (setActive) {
        setActive(org);
      }
    },
    [setActive]
  );

  // Memoize userMemberships data to prevent unnecessary re-renders
  const membershipsData = useMemo(() => userMemberships?.data || [], [userMemberships?.data]);

  return {
    isLoaded,
    setActive: safeSetActive,
    userMemberships: membershipsData,
    revalidate: userMemberships?.revalidate,
  };
};
