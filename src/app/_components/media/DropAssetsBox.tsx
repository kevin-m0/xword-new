'use client';

import { useOrganization } from '@clerk/nextjs';
import React, { useCallback, useState } from 'react';
import { useXWAlert } from '~/components/reusable/xw-alert';
import XWDropBox from '~/components/reusable/XWDropBox';
import { uploadToS3 } from '~/lib/upload-to-s3';
// import { useGetActiveSpace } from '~/hooks/workspace/useGetActiveSpace';
import { uploadFile } from '~/services/aws-file-upload';
import { trpc } from '~/trpc/react';

const DropAssetsBox = () => {
    const [localFile, setLocalFile] = useState<File | null>(null); // Single file state
    const { showToast } = useXWAlert();
    const utils = trpc.useUtils();
    // const { data: defaultSpace } = useGetActiveSpace();
    const { organization: defaultSpace } = useOrganization();

    const { mutate: addAudioAsset } = trpc.assets.addMediaAudioAsset.useMutation({
        onSuccess: () => {
            utils.assets.getAllMediaAssets.invalidate();
            showToast({
                title: 'Success!',
                message: 'Asset added successfully',
                variant: 'success',
            });
        },
        onError: (error) => {
            console.error('Error adding asset:', error.message);
            showToast({
                title: 'Error',
                message: error.message,
                variant: 'error',
            });
        },
    });

    const { mutate: addImageAsset } = trpc.assets.addMediaImageAsset.useMutation({
        onSuccess: () => {
            utils.assets.getAllMediaAssets.invalidate();
            showToast({
                title: 'Success!',
                message: 'Image asset added successfully',
                variant: 'success',
            });
        },
        onError: (error) => {
            console.error('Error adding image asset:', error.message);
            showToast({
                title: 'Error',
                message: error.message,
                variant: 'error',
            });
        },
    });

    const handleFileChange = useCallback(
        async (file: File | null) => {
            if (!file) return;

            setLocalFile(file);

            try {
                // const fileKey = crypto.randomUUID();

                if (file.type.startsWith('audio/')) {
                    const res = await uploadToS3(file);
                    const fileKey = res.fileKey.split('/')[1] as string;
                    addAudioAsset({
                        audioKey: fileKey,
                        text: file.name,
                        workspaceId: defaultSpace?.id || '',
                    });
                } else if (file.type.startsWith('image/')) {
                    const res = await uploadToS3(file);
                    const fileKey = res.fileKey;
                    addImageAsset({
                        imageKey: fileKey,
                        workspaceId: defaultSpace?.id || '',
                    });
                } else {
                    throw new Error('Unsupported file type');
                }
            } catch (error) {
                console.error('Upload error:', error);
                showToast({
                    title: 'Upload Failed',
                    message: 'There was an error uploading your file.',
                    variant: 'error',
                });
            } finally {
                setLocalFile(null);
            }
        },
        [addAudioAsset, addImageAsset, defaultSpace?.id, showToast]
    );

    return (
        <div className="flex flex-col gap-6 w-full mx-auto">
            <XWDropBox
                title="Drag & Drop Your Audio or Image File"
                acceptTypes={{ 'audio/*': [], 'image/*': [] }}
                description=".mp3, .wav, .aac, .jpg, .png, .jpeg, etc. are supported"
                value={localFile}
                onFileChange={handleFileChange}
                replacable={false}
            />
        </div>
    );
};

export default DropAssetsBox;