import { useState } from "react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useUploadAudioFile } from "~/hooks/misc/useUploadAudioFile";
import { ErrorToast } from "../custom-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "~/components/reusable/xw-dialog";
import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCreateUserVoice } from "~/hooks/soundverse/useUserVoices";


export const CreateUserVoice = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const { uploadAudioFile, uploading } = useUploadAudioFile();
    const { mutateAsync: createUserVoice, isLoading } = useCreateUserVoice();

    const handleSubmit = async () => {
        if (!audioFile) {
            toast.custom((t) => (
                <ErrorToast
                    t={t}
                    title=""
                    description="Please select an audio file."
                />
            ));
            return;
        }
        try {
            const audioFileKey = await uploadAudioFile(audioFile);
            await createUserVoice({
                name,
                description,
                audioFileKey,
                voiceId: `voice_${crypto.randomUUID()}`
            });
            setIsOpen(false);
            setName("");
            setDescription("");
            setAudioFile(null);
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.custom((t) => (
                <ErrorToast
                    t={t}
                    title=""
                    description="Failed to upload the audio file."
                />
            ));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="rounded-lg w-20 pt-2 px-3">
                    <div className="flex items-center justify-center gap-1 px-3">
                        <PlusIcon className="h-4 w-4" />
                        <span>Create</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="my-2">
                    <DialogTitle>Create New Voice</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Voice Name"
                    />
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Voice Description"
                    />
                    <Input
                        type="file"
                        accept="audio/*"
                        className="cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setAudioFile(e.target.files[0]);
                            }
                        }}
                    />
                    <div className="flex justify-start items-center">
                        <Button className="rounded-lg" onClick={handleSubmit} >Create Voice</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};