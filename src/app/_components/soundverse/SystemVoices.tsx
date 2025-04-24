import React, { useState, useMemo, useCallback } from 'react';
// import { SYSTEM_VOICES, VOICE_IMAGES } from "../../_lib/system-voices";
import Image from 'next/image';
import { UserVoice } from '@prisma/client';
import { useAtom } from 'jotai';

import { Search } from 'lucide-react';
import { SYSTEM_VOICES, VOICE_IMAGES } from '~/lib/system-voices';
import { audioVoiceStyleIdAtom, audioVoiceStyleNameAtom } from '~/atoms/soundVerseAtom';

interface SystemVoiceType {
    id: string;
    name: string;
    description: string;
}

interface VoiceItemProps {
    voice: SystemVoiceType;
    selected: boolean;
    onSelect: (voice: SystemVoiceType) => void;
    imagePath: string;
}

const VoiceItem = React.memo(({ voice, selected, onSelect, imagePath }: VoiceItemProps) => {
    return (
        <div
            key={voice.id}
            onClick={() => onSelect(voice)}
            className={`rounded-lg ${selected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-xw-background scale-95 backdrop-blur-sm transition-all" : "bg-xw-card hover:bg-xw-secondary-hover"}`}
        >
            <div className="flex-1 w-[90%] p-3 rounded-lg flex items-center gap-5">
                <div className="rounded-full overflow-hidden flex-shrink-0">
                    <Image src={imagePath} height={50} width={50} alt="AI voice" />
                </div>
                <div>
                    <p>{voice.name}</p>
                    <h1 className="text-sm text-xw-muted">{voice.description}</h1>
                </div>
            </div>
        </div>
    );
});
// Add a display name for debugging
VoiceItem.displayName = "VoiceItem";

const SystemVoices = () => {
    const [voiceStyleId, setVoiceStyleId] = useAtom(audioVoiceStyleIdAtom);
    const [voiceStyleName, setVoiceStyleName] = useAtom(audioVoiceStyleNameAtom);
    const [searchTerm, setSearchTerm] = useState("");
    

    // Memoize filtered voices to avoid unnecessary re-filtering
    const filteredVoices = useMemo(() => {
        return SYSTEM_VOICES.filter(voice =>
            voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voice.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Memoize selection handler
    const handleModelSelection = useCallback((voice: SystemVoiceType | UserVoice) => {
        const selectedId = "voiceId" in voice ? voice.voiceId : voice.id;
        setVoiceStyleId(selectedId);
        setVoiceStyleName(voice.name);
    }, [setVoiceStyleId, setVoiceStyleName]);

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
            <div className="grid grid-cols-2 gap-3">
                {filteredVoices.map((voice, index) => {
                    const voiceImageKeys = Object.keys(VOICE_IMAGES) as (keyof typeof VOICE_IMAGES)[];
                    const imageKey = voiceImageKeys[index % voiceImageKeys.length];
                    const imagePath = VOICE_IMAGES[imageKey as string];

                    const selected = voiceStyleName === voice.name || voiceStyleId === voice.id;

                    return (
                        <VoiceItem
                            key={voice.id}
                            voice={voice}
                            selected={selected}
                            onSelect={handleModelSelection}
                            imagePath={imagePath as string}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default SystemVoices;
