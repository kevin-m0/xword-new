'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Download, MagnetIcon, Upload } from 'lucide-react';
import { useAtom } from 'jotai';
import { multiFlowPrompt, multiFlowStep, MultiSelectType, multiSourceSelect } from '../../../_atoms/multiFlow';
import { trpc } from '@/app/_trpc/client';
import { useXWAlert } from '../../reusable/xw-alert';
import { useGetActiveSpace } from "../../../_hooks/workspace/useGetActiveSpace";
import { Card, CardHeader } from '@/components/ui/card';
import XWSecondaryButton from '../../reusable/XWSecondaryButton';
import Dropzone from 'react-dropzone';
import { handleFileTrasncription } from '../flow/handler/transcription/transcription';
import { v4 as uuid } from 'uuid';
import { uploadFile } from '@/services/aws-file-upload';
import { getAwsUrl } from '../../../_lib/get-aws-url';
import { useOrganization } from '@clerk/nextjs';

const FlowContentSelection = () => {
    const [step, setStep] = useAtom(multiFlowStep);
    const { showToast } = useXWAlert();
    const [transcript, setTranscript] = useAtom(multiFlowPrompt);
    const [url, setUrl] = useState('');
    const [sourceType, setSourceType] = useAtom(multiSourceSelect);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const [selectedDoc, setSelectedDoc] = React.useState<string | null>(null);
    const [localFile, setLocalFile] = useState<any | null>(null);  // Track a single file

    const { organization } = useOrganization();
    const { data: docs, isLoading: isDocsLoading } = trpc.writerx.getAllDocs.useQuery({
        workspaceId: organization?.id!
    });

    console.log("Docs:", docs);

    const { mutate: handleTranscribe, isLoading } = trpc.writerx.handleTranscribe.useMutation({
        onSuccess(data) {
            console.log('Transcription Success:', data); // Log transcription data
            setTranscript(data);
            setIsTranscribing(false);
            setStep(step + 1); // Move to the next step
        },
        onError(error) {
            showToast({
                title: 'Error',
                message: error.message,
                variant: 'error'
            });
        }
    });

    const handleSubmit = () => {
        setIsTranscribing(true);
        console.log('Transcribing URL:', transcript);
        handleTranscribe({ url: url, type: 'file' });
    }

    const renderFileStatus = (file: any) => {
        if (file.isUploading) {
            return (
                <>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Uploading...
                </>
            );
        }
        return (
            <>
                <Upload className="mr-2 h-4 w-4" />
                Uploaded
            </>
        );
    };

    const handleOnDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            const currentFile = {
                key: crypto.randomUUID(),
                prompt: file.name,
                isUploading: true,
            };

            setLocalFile(currentFile);  // Set the single file to upload
            console.log(currentFile, "current file");

            try {
                let id = currentFile.key;
                await uploadFile(file, currentFile.key);
                const url = getAwsUrl(id) as string;
                const res = await handleFileTrasncription({ url: url, type: "mux" })

                setTranscript(res.transcript);
                // Update state after upload is successful
                setLocalFile((prevState: any) => ({
                    ...prevState,
                    isUploading: false,
                }));

            } catch (error) {
                console.error("Upload error:", error);
                setLocalFile(null);  // Reset the state
                showToast({
                    title: "Upload Failed",
                    message: "There was an error uploading your file.",
                    variant: "error",
                });
            }
        },
        [setTranscript, showToast]
    );

    const handleUrlTranscription = async () => {
        setIsTranscribing(true);

        try {
            let currentUrl = "";
            if (videoUrl.trim() !== "") {
                currentUrl = videoUrl;
            } else if (audioUrl.trim() !== "") {
                currentUrl = audioUrl;
            } else {
                return showToast({
                    title: "Error",
                    message: "Please enter a valid URL",
                    variant: "error"
                })
            }
            const isYoutubeUrl = currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be');


            const res = await handleFileTrasncription({ url: currentUrl, type: isYoutubeUrl ? 'youtube' : 'mux' });

            setTranscript(res.transcript);
        } catch (error) {
            console.error('Transcription error:', error);
            showToast({
                title: "Failed",
                message: "Some error occurred! Please Try Again!",
                variant: "error"
            })
        } finally {
            setIsTranscribing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl w-full mx-auto p-6 rounded-lg shadow-md">
            {/* URL Input */}
            {sourceType === MultiSelectType.url && (
                <div>
                    <div>
                        <Label htmlFor="url" className="font-medium">URL</Label>
                        <Input
                            id="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center gap-2 justify-end mt-2'>
                        <Button type="button" variant="secondary" onClick={() => setSourceType(MultiSelectType.default)}>
                            Back
                        </Button>
                        <Button
                            type='submit'
                            onClick={handleSubmit}
                            variant={"primary"}
                            disabled={!url || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Document Selection */}
            {sourceType === MultiSelectType.doc && (
                <div>
                    <div className="flex flex-col gap-2">
                        {isDocsLoading ? (
                            <p>Loading documents...</p>
                        ) : (
                            docs?.map((doc) => (
                                <Card
                                    key={doc.id}
                                    onClick={() => {
                                        setSelectedDoc(doc.id); // Update selected document
                                        setTranscript(doc.content); // Update transcript
                                    }}
                                    className={`cursor-pointer ${selectedDoc === doc.id ? 'border-xw-primary' : ''}`}
                                >
                                    <div className="p-4">
                                        <h3 className="font-medium">{doc.title}</h3>
                                        <p>{doc.content?.slice(0, 50)}{doc.content && doc.content.length > 50 ? '...' : ''}</p>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                    {/* Next Button */}
                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setSourceType(MultiSelectType.default)}>
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setStep(step + 1)}
                            disabled={!selectedDoc}

                        >
                            Next <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {sourceType === MultiSelectType.audio && (
                <div className='flex flex-col gap-2'>
                    <Dropzone onDrop={handleOnDrop} accept={{ "audio/*": [] }} multiple={false}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                className="py-10 w-full flex flex-col items-center justify-center rounded-[16px] border-dashed border-xw-secondary bg-xw-background border-[2px]"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <div className="w-full p-5 text-center my-auto flex flex-col items-center justify-center gap-4">
                                    <Download className="h-10 w-10 mx-auto" />
                                    <h1 className="text-3xl font-semibold">Drag & Drop Your Audio File</h1>
                                    <p className="text-xw-muted">.mp3, .wav, .aac etc. are supported</p>
                                    {localFile === null ? (
                                        <XWSecondaryButton>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Browse
                                        </XWSecondaryButton>
                                    ) : (
                                        <XWSecondaryButton disabled={localFile.isUploading}>
                                            {renderFileStatus(localFile)}
                                        </XWSecondaryButton>
                                    )}
                                </div>
                            </div>
                        )}
                    </Dropzone>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setSourceType(MultiSelectType.default)}>
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setStep(step + 1)}
                            disabled={!transcript}

                        >
                            Next <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>

            )}

            {sourceType === MultiSelectType.audio_url && (
                <div className='flex flex-col gap-5'>
                    <Input
                        type='text'
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        placeholder='Enter url... '
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setSourceType(MultiSelectType.default)}>
                            Back
                        </Button>
                        {!transcript ?
                            (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleUrlTranscription}
                                    disabled={isTranscribing}

                                >
                                    Transcribe<MagnetIcon className="h-4 w-4 ml-2" />
                                </Button>
                            )
                            : (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => setStep(step + 1)}
                                    disabled={isTranscribing}

                                >
                                    Next<ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}


                    </div>
                    <Card>
                        <CardHeader>
                            {transcript}
                        </CardHeader>
                    </Card>
                </div>
            )
            }


            {sourceType === MultiSelectType.video && (
                <div className='flex flex-col gap-2'>
                    <Dropzone onDrop={handleOnDrop} accept={{ "video/*": [], }} multiple={false}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                className="py-10 w-full flex flex-col items-center justify-center rounded-[16px] border-dashed border-xw-secondary bg-xw-background border-[2px]"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <div className="w-full p-5 text-center my-auto flex flex-col items-center justify-center gap-4">
                                    <Download className="h-10 w-10 mx-auto" />
                                    <h1 className="text-3xl font-semibold">Drag & Drop Your Video File</h1>
                                    <p className="text-xw-muted">.mp4, .mov etc. are supported</p>
                                    {localFile === null ? (
                                        <XWSecondaryButton>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Browse
                                        </XWSecondaryButton>
                                    ) : (
                                        <XWSecondaryButton disabled={localFile.isUploading}>
                                            {renderFileStatus(localFile)}
                                        </XWSecondaryButton>
                                    )}
                                </div>
                            </div>
                        )}
                    </Dropzone>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setSourceType(MultiSelectType.default)}>
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setStep(step + 1)}
                            disabled={!transcript}

                        >
                            Next <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>

            )}

            {sourceType === MultiSelectType.video_url && (
                <div className='flex flex-col gap-5'>
                    <Input
                        type='text'
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder='Enter url... '
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => setSourceType(MultiSelectType.default)}>
                            Back
                        </Button>
                        {!transcript ?
                            (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleUrlTranscription}
                                    disabled={isTranscribing}

                                >
                                    Transcribe<MagnetIcon className="h-4 w-4 ml-2" />
                                </Button>
                            )
                            : (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => setStep(step + 1)}
                                    disabled={isTranscribing}

                                >
                                    Next<ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}


                    </div>
                    <Card>
                        <CardHeader>
                            {transcript}
                        </CardHeader>
                    </Card>
                </div>
            )
            }


        </div >
    );
};

export default FlowContentSelection;
