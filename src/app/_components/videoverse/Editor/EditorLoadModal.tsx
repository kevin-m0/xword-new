import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export function EditorLoadModal({
  isOpen,
  message = "Adding B-roll...",
}: LoadingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] bg-black">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-center text-sm font-medium text-muted-foreground">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
