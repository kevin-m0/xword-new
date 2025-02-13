import { FC } from "react";
import { useAtom } from "jotai";
import {
  contentResponseAtom,
  contentInputAtom,
  promptLoadingAtom,
} from "@/atoms";
import TopLoader from "../skeletons/top-loader";
import { Button } from "../ui/button";
import { aiPreview, aiPreviewLoading } from "@/atoms";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { useGetActiveSpace } from "../../app/(site)/(dashboard)/_hooks/workspace/useGetActiveSpace";
import { useRouter } from "next/navigation";
import { SuccessToast } from "../ui/custom-toast";

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
          <div className="flex flex-col items-center justify-center w-full h-64">
            <TopLoader />
          </div>
        </div>
      ) : (
        contentResponse && (
          <div className="bg-[#191a1d] px-6 py-4 rounded-xl flex flex-col gap-y-6">
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
              variant={"primary"}
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
