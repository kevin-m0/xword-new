import { FC } from "react";
import { useAtom } from "jotai";

import {
  aiPreview,
  aiPreviewLoading,
  contentInputAtom,
  contentResponseAtom,
  promptLoadingAtom,
} from "~/atoms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";
import { trpc } from "~/trpc/react";
import TopLoader from "~/components/loaders/top-loader";
import { Button } from "~/components/ui/button";
import { SuccessToast } from "../../custom-toast";

type ResponseComponentProps = {};

const ResponseComponent: FC<ResponseComponentProps> = () => {
  const [contentResponse] = useAtom(contentResponseAtom);
  const [contentInput] = useAtom(contentInputAtom);
  const [promptLoading] = useAtom(promptLoadingAtom);
  const [aiResponse] = useAtom(aiPreview);
  const [isLoading] = useAtom(aiPreviewLoading);
  const { data: defaultSpace } = useGetActiveSpace();

  const router = useRouter();

  const { mutate: createDocument } = trpc.document.createDocument.useMutation({
    onSuccess(data) {
      // storing the ai response in local storage
      localStorage.setItem("AIResponse", aiResponse ?? "");

      toast.custom((t) => (
        <SuccessToast
          t={t}
          title=""
          description="Redirecting to the document"
        />
      ));

      router.push(`/document/${data?.id}`);
    },
  });

  return (
    <>
      {promptLoading ? (
        <div className="bg-opacity-0">
          <div className="flex h-64 w-full flex-col items-center justify-center">
            <TopLoader />
          </div>
        </div>
      ) : (
        contentResponse && (
          <div className="flex flex-col gap-y-6 rounded-xl bg-[#191a1d] px-6 py-4">
            <div className="mt-4 text-2xl">
              <span className="font-bold">Prompt: </span>
              {contentInput || ""}
            </div>
            <div className="mt-2 text-lg">{contentResponse || ""}</div>
            <Button
              onClick={() => {
                if (!defaultSpace) return;

                // createDocument({
                //   title: "AI Generated Document",
                //   spaceId: defaultSpace?.id,
                // });
              }}
              disabled={isLoading}
              variant={"default"}
            >
              Open in WriterX
            </Button>
          </div>
        )
      )}
    </>
  );
};

export default ResponseComponent;
