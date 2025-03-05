import React, { useCallback, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone';
import { Download, FileKey, Loader2, Paperclip, Repeat } from 'lucide-react';
import { toast } from "sonner";
import { useAtom } from 'jotai';
import { audioVoiceStyleIdAtom, audioVoiceStyleNameAtom, fileUrlAtom, generatedAudioKeyAtom, isGeneratingTransScriptAtom, isUploadingAtom, localFileAtom, paraTextAtom, selectedLanguageAtom, transcriptAtom, transcriptionErrorAtom } from "~/atoms/soundVerseAtom";
import { v4 as uuidv4 } from "uuid";
import { Button } from '~/components/ui/button';
import { useXWAlert } from '~/components/reusable/xw-alert';
import { trpc } from '~/trpc/react';
import { uploadFile } from '~/services/aws-file-upload';
import { uploadToS3 } from '~/lib/upload-to-s3';


const SpeechToSpeech = () => {
    const { showToast } = useXWAlert();

    const [localFile, setLocalFile] = useAtom(localFileAtom);
    const [isUploading, setIsUploading] = useAtom(isUploadingAtom);
    const [isGeneratingTransScript, setIsGeneratingTransScript] = useAtom(isGeneratingTransScriptAtom);
    const [transcriptionError, setTranscriptionError] = useAtom(transcriptionErrorAtom);
    const [generatedAudioKey, setGeneratedAudioKey] = useAtom(generatedAudioKeyAtom);
    const [transcript, setTranscript] = useAtom(transcriptAtom);
    const [paraText, setParaText] = useAtom(paraTextAtom);
    const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
    const [voiceStyleId, setVoiceStyleId] = useAtom(audioVoiceStyleIdAtom);
    const [voiceStyleName, setVoiceStyleName] = useAtom(audioVoiceStyleNameAtom);
    const [fileUrl, setFileUrl] = useAtom(fileUrlAtom);

    const { mutateAsync: getTranscription } = trpc.audio.getFileTranscription.useMutation();

    const handleReset = () => {
        setParaText("");
        setTranscript("");
        setVoiceStyleId(null);
        setVoiceStyleName("");
        setGeneratedAudioKey(null);
        setLocalFile(null);
        setTranscriptionError(false);
    };

    const handleGenerateTranscript = async () => {
        try {
            setIsGeneratingTransScript(true);
            setTranscriptionError(false);

            if (!fileUrl) {
                throw new Error("File URL is not available yet.");
            }
            const transcription = await getTranscription({
                type: "mux",
                url: fileUrl ?? "",
                languagecode: selectedLanguage,
            });
            setTranscript(transcription.transcript);
        } catch (error) {
            console.error("Transcription failed:", error);
            setTranscript("");
            setTranscriptionError(true);
            showToast({
                title: "Error",
                message: "Oops! there was an error generating transcript",
                variant: "error",
            });
        } finally {
            setIsGeneratingTransScript(false);
        }
    };
    const handleOnDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 1) {
                showToast({
                    title: "Error",
                    message: "Only a single file can be uploaded.",
                    variant: "error",
                });
                return;
            }
            // Reset everything upon new file
            handleReset();
            const file = acceptedFiles[0];
            setLocalFile(file as File);
            // const uniqueKey = uuidv4();
            // setGeneratedAudioKey(uniqueKey);

            try {
                setIsUploading(true);
                console.log("file is uploading ------------------->",);
                const response =  await uploadToS3(file as File);
                console.log("file is uploaded-----------------------]>", response);
                const fileKey = response?.fileKey.split("/")[1] as string;
                setGeneratedAudioKey(fileKey);
                setFileUrl(response.fileUrl);
                showToast({
                    title: "Success",
                    message: "File uploaded successfully!",
                    variant: "success",
                });
            } catch (error) {
                console.error(error);
                showToast({
                    title: "Error",
                    message: "Failed to upload file, Please try again.",
                    variant: "error",
                });
            } finally {
                setIsUploading(false);
            }
        },
        [handleGenerateTranscript, handleReset, showToast]
    );

    useEffect(() => {
        // Only run if the file is done uploading, we have a fileURL,
        // we haven't transcribed yet, and there's no current error
        if (
            !isUploading &&
            localFile &&
            generatedAudioKey &&
            fileUrl &&
            !transcriptionError &&
            !transcript
        ) {
            (async () => {
                try {
                    await handleGenerateTranscript();
                } catch (error) {
                    console.error("Transcription error:", error);
                }
            })();
        }
    }, [ isUploading, localFile, generatedAudioKey, fileUrl, transcriptionError, transcript]);

    return (
        <div>
            <div className="min-h-[350px] w-full flex flex-col rounded-[16px] bg-xw-background">
                <Dropzone
                    onDrop={handleOnDrop}
                    accept={{
                        "audio/mp3": [],
                        "audio/wav": [],
                        "audio/aac": [],
                        "audio/ogg": [],
                        "audio/mid": [],
                        "audio/basic": [],
                        "audio/x-mpegurl": [],
                        "audio/mpeg": [],
                    }}
                    multiple={false}
                    maxFiles={1}
                >
                    {({
                        getRootProps,
                        getInputProps,
                        isDragActive,
                        isDragReject,
                    }) => (
                        <div
                            className="py-20 w-full flex flex-col rounded-[16px] border-dashed border-xw-secondary bg-xw-background border-[2px] flex-grow"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            {!localFile && !isUploading && (
                                <div className="w-full p-5 text-center my-auto flex flex-col gap-2">
                                    <Download className="h-10 w-10 mx-auto" />
                                    <h1 className="text-2xl font-semibold">
                                        Drag & Drop your Audio files
                                    </h1>
                                    <p className="text-xw-muted">
                                        .mp3, .mp4, .wav are supported.
                                    </p>

                                    <div className="mt-5 mx-auto flex items-center gap-2">
                                        <Button variant="secondary" size="sm" className="flex gap-2">
                                            <Paperclip className="h-4 w-4" />
                                            Select Source
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {isUploading && (
                                <div className="flex flex-col items-center w-full h-full gap-2 pt-4">
                                    <p className="text-center text-xw-muted">
                                        {localFile?.name}
                                    </p>
                                    <Loader2 className="h-10 w-10 mx-auto animate-spin" />
                                    <p className="text-xl font-semibold">Uploading...</p>
                                </div>
                            )}
                            {localFile && !isUploading && (
                                <div className="flex flex-col justify-center items-center w-full h-full gap-2 pt-4">
                                    <p className="text-center text-xw-muted">
                                        {localFile.name}
                                    </p>
                                    {isGeneratingTransScript && !transcriptionError && (
                                        <>
                                            <Loader2 className="h-10 w-10 mx-auto animate-spin" />
                                            <p className="text-xl font-semibold">Transcribing...</p>
                                        </>
                                    )}
                                    {transcriptionError && (
                                        <div className="text-center text-red-400 text-sm">
                                            There was an error transcribing your file.
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 text-red-500"
                                                onClick={(e: any) => {
                                                    // Retry transcription if user wants
                                                    e.stopPropagation();
                                                    if (generatedAudioKey) {
                                                        handleGenerateTranscript();
                                                    }
                                                }}
                                            >
                                                Retry?
                                            </Button>
                                        </div>
                                    )}
                                    {!transcriptionError && transcript && (
                                        <div className="text-center text-green-400 text-sm">
                                            Transcript ready!
                                        </div>
                                    )}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReset();
                                        }}
                                        className="mt-4 gap-2"
                                    >
                                        <Repeat className="w-4 h-4" /> Reset
                                    </Button>
                                </div>
                            )}
                            {isDragReject &&
                                toast.error("File type not accepted, Sorry!")}
                        </div>
                    )}
                </Dropzone>
            </div>
        </div>
    )
}

export default SpeechToSpeech
