import { trpc } from "~/trpc/react";

export const useUserVoices = () => {
    const { data, isLoading, error } = trpc.audio.getUserVoices.useQuery();
    return { data, isLoading, error };
};

export const useCreateUserVoice = () => {
    const utils = trpc.useUtils();

    const mutation = trpc.audio.createUserVoice.useMutation({
        onSuccess: () => {
            utils.audio.getUserVoices.invalidate();
        },
    });

    return {
        mutateAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
    }
};

export const useDeleteUserVoice = () => {
    const utils = trpc.useUtils();

    return trpc.audio.deleteUserVoice.useMutation({
        onSuccess: () => {
            utils.audio.getUserVoices.invalidate();
        },
    });
};