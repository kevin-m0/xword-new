import { Skeleton } from "~/components/ui/skeleton";

const ChatSonicSidebarLoader = () => (
  <div className="flex flex-col gap-2">
    {/* Simulating the "New Chat" button */}
    <Skeleton className="h-8 w-full" />
    {/* Search bar */}

    {/* Section separators */}
    <Skeleton className="h-5 w-32" />

    {/* Collapsible content skeleton */}
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>

    {/* Section separators */}
    <Skeleton className="h-5 w-32" />

    {/* Collapsible content skeleton */}
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>

    {/* Section separators */}
    <Skeleton className="h-5 w-32" />

    {/* Collapsible content skeleton */}
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  </div>
);

export default ChatSonicSidebarLoader;
