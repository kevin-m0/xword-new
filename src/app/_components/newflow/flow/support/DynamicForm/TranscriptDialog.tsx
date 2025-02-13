import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Check, X } from "lucide-react";

interface TranscriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onDone: () => void;
}

export const TranscriptDialog = ({
  open,
  onOpenChange,
  transcript,
  onTranscriptChange,
  onDone,
}: TranscriptDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-gray-800/50 bg-gradient-to-b from-gray-900 to-black shadow-2xl sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-2xl font-bold text-transparent">
            Edit Transcript
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            className="min-h-[350px] w-full resize-none rounded-xl border-2 border-gray-700/50 bg-gray-900/50 p-4 text-lg leading-relaxed text-gray-200 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="Your transcript text..."
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 border-gray-700 bg-gray-800 px-5 py-2.5 text-gray-200 transition-all duration-300 hover:border-gray-600 hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={onDone}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-white transition-all duration-300 hover:from-indigo-500 hover:to-violet-500"
          >
            <Check className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
