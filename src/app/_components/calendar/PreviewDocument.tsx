import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import SocialPostPreviewComponent from "../newflow/social-flow/SocialPostPreviewComponent";

export function PreviewDocument({ doc }: { doc: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Doc</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document</DialogTitle>
          {/* <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription> */}
        </DialogHeader>
        <div className="grid h-[80vh] gap-4 overflow-y-scroll py-4">
          <SocialPostPreviewComponent
            postImage={doc.thumbnailImageUrl}
            postContent={doc.content}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
