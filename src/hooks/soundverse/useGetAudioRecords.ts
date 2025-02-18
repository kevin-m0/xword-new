import { trpc } from "~/trpc/react";
import { useGetActiveSpace } from "../workspace/useGetActiveSpace";


const useGetAudioRecords = () => {
    const { data: defaultSpace } = useGetActiveSpace();
    const { data: generatedAudios, refetch, isLoading } = trpc.audio.getAudioRecords.useQuery(
        { workspaceId: defaultSpace?.id },
        { enabled: !!defaultSpace?.id } 
    );

    return { generatedAudios, refetch, isLoading };
};

export default useGetAudioRecords;
