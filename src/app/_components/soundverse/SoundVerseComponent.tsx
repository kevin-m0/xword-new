"use client"
import React from 'react';

import AudioBox from './AudioBox';
import { Loader2 } from "lucide-react";
import { VOICE_IMAGES } from '~/lib/system-voices';
import { generateShortTitle } from '~/utils/utils';
import useGetAudioRecords from '~/hooks/soundverse/useGetAudioRecords';
import SoundVerseForm from './SoundVerseForm';
import SoundVerseMobileForm from './SoundVerseMobileForm';
import AudioDefaultScreen from './AudioDefaultScreen';

const SoundVerseComponent = () => {
  const { generatedAudios, refetch, isLoading } = useGetAudioRecords();

  const voiceImageKeys = Object.keys(VOICE_IMAGES);
  console.log("vk----------------->",voiceImageKeys);
  
  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <div className=" tb:flex w-[60%] bg-xw-sidebar">
        <div className="w-full h-full">
          <SoundVerseForm refetchGeneratedAudios={refetch} />
        </div>
      </div>

      <div className="flex-1 flex flex-col w-[40%] p-5">
        <div className="tb:hidden p-3 flex items-center justify-end gap-2">
          <SoundVerseMobileForm refetchGeneratedAudios={refetch} />
        </div>

        {isLoading ? (
          <div className='h-screen flex items-center justify-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[100vh] scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin">
            {generatedAudios && generatedAudios.length > 0 ? (
              generatedAudios.map((audio, index) => {
                const personaId = audio.personaId ?? "";
                const personaImage =
                    personaId in VOICE_IMAGES
                        ? VOICE_IMAGES[personaId]
                        : VOICE_IMAGES[voiceImageKeys[index % voiceImageKeys.length] as keyof typeof VOICE_IMAGES];
                
                  
                return (
                  <div
                    key={audio.id}
                    className="bg-xw-background p-1 rounded-lg shadow-md"
                  >
                    <AudioBox
                      audioId={audio.id}
                      name={generateShortTitle(audio.text)}
                      avatar={personaImage}
                      script={audio.text}
                      audioKey={audio.audioKey}
                      hideMetadata={false}
                      onAudioDeleted={() => {
                        refetch();
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <AudioDefaultScreen />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundVerseComponent;
