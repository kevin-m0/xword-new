import React, { useState, useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { audioVoiceStyleIdAtom, audioVoiceStyleNameAtom } from '~/atoms';
import { UserVoice } from '@prisma/client';
// import { useDeleteUserVoice, useUserVoices } from '../../_hooks/soundve/rse/useUserVoices';
import { Loader2, Search, Trash2 } from 'lucide-react';
import { useDeleteUserVoice, useUserVoices } from '~/hooks/soundverse/useUserVoices';
import { backgroundColors } from '~/lib/system-voices';
// import { backgroundColors } from "../../_lib/system-voices";

interface SystemVoiceType {
    id: string;
    name: string;
    description: string;
}

const UserVoices: React.FC = React.memo(() => {
    const [voiceStyleId, setVoiceStyleId] = useAtom(audioVoiceStyleIdAtom);
    const [voiceStyleName, setVoiceStyleName] = useAtom(audioVoiceStyleNameAtom);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: userVoiceModels = [], isLoading: isLoadingUserVoices } = useUserVoices();
    const deleteUserVoice = useDeleteUserVoice();

    // Memoized handler to prevent unnecessary re-renders
    const handleModelSelection = useCallback((voice: SystemVoiceType | UserVoice) => {
        setVoiceStyleId("voiceId" in voice ? voice.voiceId : voice.id);
        setVoiceStyleName(voice.name);
    }, [setVoiceStyleId, setVoiceStyleName]);

    const handleDeleteUserVoice = useCallback((id: string) => {
        deleteUserVoice.mutate(
            { id },
            {
                onError: (error) => console.error("Failed to delete voice:", error.message),
                onSuccess: () => console.log("Voice deleted successfully."),
            }
        );
    }, [deleteUserVoice]);

    // Filter user voices based on search input
    const filteredUserVoices = useMemo(() =>
        userVoiceModels.filter(voice =>
            voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voice.description.toLowerCase().includes(searchTerm.toLowerCase())
        ), [userVoiceModels, searchTerm]
    );

    // Compute initials **outside** `.map()`
    const voiceInitialsMap = useMemo(() => {
        return new Map(filteredUserVoices.map(voice => [
            voice.id,
            voice.name.split(" ").map(word => word[0]).join("").toUpperCase()
        ]));
    }, [filteredUserVoices]);

    return (
        <>
            <div className="mb-4">
                <div className="flex ps-3 py-1 rounded-md border-2 border-gray-500 overflow-hidden mx-auto font-[sans-serif]">
                    <Search className="pt-2" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search voices..."
                        className="w-full outline-none bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 text-white-600 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 tb:grid-cols-1 gap-5 pb-2">
                {isLoadingUserVoices ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                ) : filteredUserVoices.length === 0 ? (
                    <p className="flex justify-center items-center text-xw-muted">
                        Sorry! No user voices found.
                    </p>
                ) : (
                    <div className="grid grid-cols-2">
                        {filteredUserVoices.map((voice, index) => {
                            const initials = voiceInitialsMap.get(voice.id) || "";
                            const backgroundColor = backgroundColors[index % backgroundColors.length];
                            const selected = voiceStyleName === voice.name || voiceStyleId === voice.id;

                            return (
                                <div
                                    key={voice.id}
                                    onClick={() => handleModelSelection(voice)}
                                    className={`rounded-lg transition-all ${selected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-xw-background scale-95 backdrop-blur-sm" : "bg-xw-card hover:bg-xw-secondary-hover"}`}
                                >
                                    <div className="w-[100%] flex items-center gap-5 p-3 rounded-lg">
                                        {/* Initials Avatar */}
                                        <div className={`rounded-full h-12 w-12 flex items-center justify-center text-white font-bold ${backgroundColor}`}>
                                            {initials}
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-1 items-center justify-between">
                                            <div>
                                                <p>{voice.name}</p>
                                                <h1 className="text-sm text-xw-muted">{voice.description}</h1>
                                            </div>
                                            <Trash2
                                                className="w-6 h-6 cursor-pointer text-gray-400 hover:text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteUserVoice(voice.id);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
});

// Add a display name for debugging
UserVoices.displayName = "UserVoices";

export default UserVoices;
