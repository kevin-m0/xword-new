import { trpc } from "~/trpc/react";

import { useOrganization } from "@clerk/nextjs";


const useGetAudioRecords = () => {
    const { organization } = useOrganization();
    const { data: generatedAudios, refetch, isLoading } = trpc.audio.getAudioRecords.useQuery(
        { workspaceId: organization?.id },
        { enabled: !!organization?.id } 
    );

    return { generatedAudios, refetch, isLoading };
};

export default useGetAudioRecords;
