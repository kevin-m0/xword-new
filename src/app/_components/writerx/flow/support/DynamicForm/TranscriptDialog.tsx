import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
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
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-b from-gray-900 to-black border border-gray-800/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">
            Edit Transcript
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            className="w-full min-h-[350px] p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700/50 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-lg leading-relaxed resize-none"
            placeholder="Your transcript text..."
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700 hover:border-gray-600 transition-all duration-300 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={onDone}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};