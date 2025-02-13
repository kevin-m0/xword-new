import { Skeleton } from "~/components/ui/skeleton";
import React from "react";

const FlowInitialSkeleton = () => {
  return (
    <div className="mb-4 space-y-4">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-12 w-[80%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-7 w-1/4" />
        <Skeleton className="h-20 w-full" />

        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
};

export default FlowInitialSkeleton;
