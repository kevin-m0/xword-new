import { trpc } from "~/trpc/react";

// Custom hook to fetch the image URL
const useGetImageLink = (imageKey: string) => {
  const { data: imageUrl, isLoading } = trpc.aws.getObjectURL.useQuery(
    { key: imageKey },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  return { imageUrl, isLoading };
};

export default useGetImageLink;
