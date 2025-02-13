import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Copy } from "lucide-react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import useCopyToClipboard from "~/hooks/chatsonic/useCopyToClipBoard";
import { useUser } from "~/hooks/misc/useUser";
import { ErrorToast, SuccessToast } from "../custom-toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { RenderMarkdown } from "~/components/render-markdown/render-markdown";
import { Message } from "~/types/chatsonic.types";

type ChatResponseProp = {
  message: Message;
  isLastResponse: boolean;
  isRegenarating?: boolean;
  handleRegenerate?: (promptText?: string | null) => Promise<void>;
  userId: string | undefined;
};

const SourcesList = ({
  sources,
  mode,
}: {
  sources: string | undefined;
  mode: string;
}) => {
  if (mode !== "Web" || !sources) return null;

  try {
    const parsedSources =
      typeof sources === "string" ? JSON.parse(sources) : sources;

    const sourcesArray = Array.isArray(parsedSources)
      ? parsedSources
      : Object.values(parsedSources);

    return (
      <div className="mt-4 border-t border-opacity-20 pt-4">
        <p className="mb-2 text-sm text-gray-400">Sources:</p>
        <div className="grid grid-cols-2 gap-2">
          {sourcesArray.map((source, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  {source.title.length > 30
                    ? source.title.slice(0, 30) + "..."
                    : source.title}
                </CardTitle>
                <CardTitle>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xw-primary hover:text-xw-primary-hover flex items-center gap-2 text-lg transition-colors"
                  >
                    {/* <ExternalLink className="h-6 w-6" /> */}
                    {source.url.length > 30
                      ? source.url.slice(0, 30) + "..."
                      : source.url}
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error parsing sources:", error, sources);
    return null;
  }
};

function ChatResponse({
  message,
  isLastResponse,
  isRegenarating,
  handleRegenerate,
  userId,
}: ChatResponseProp) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [_, copy] = useCopyToClipboard();
  const { data: user } = useUser();

  const handleCopyToClipBoard = async () => {
    // if (message.fileIds.some((id) => id.startsWith("image_"))) {
    //   copyImage(imageRef);
    //   return;
    // }
    try {
      await copy(message.query);
      toast.custom((t) => (
        <SuccessToast t={t} title="" description="Copied to clipboard" />
      ));
    } catch {
      if (!message.query)
        toast.custom((t) => (
          <ErrorToast t={t} title="" description="No content to copy" />
        ));
      else
        toast.custom((t) => (
          <ErrorToast
            t={t}
            title=""
            description="Failed to copy to clipboard."
          />
        ));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative mb-3 flex gap-4 py-4"
    >
      <div className="relative top-2">
        <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full">
          <Avatar>
            <AvatarImage
              src={
                message.role === "user"
                  ? (user?.image ?? "")
                  : "images/ai-avatar.png"
              }
            />
            <AvatarFallback>
              {message.role === "user" ? "U" : "AI"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex w-[93%] flex-col gap-2 rounded-2xl rounded-bl-none pt-2">
        {/* <div className="flex items-center gap-2">
          <h1>Chat Sonic</h1>
          <p className="text-xs text-xw-muted">
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div> */}
        <RenderMarkdown content={message.query} />

        <SourcesList sources={message.sources} mode={message.mode || ""} />

        {/* {message.fileIds && message.fileIds.length > 0 && (
          <div className="flex gap-4">
            {message.fileIds.map((fileId) => {
              if (fileId.startsWith("image_")) {
                return <FilePrompt fileId={fileId} />;
              }
              return null;
            })}
          </div>
        )} */}

        <div className="flex items-center gap-2">
          {/* <Button size={"icon_sm"} variant={"xw_ghost"}>
            <Volume2 className="h-4 w-4" />
          </Button> */}
          {/* {isRegenarating ? (
            <div className="flex items-center gap-2 justify-center w-8 h-8">
              <Loader2 className="h-5 w-5 animate-spin" /> Generating...
            </div>
          ) : (
            <Button size={"icon_sm"} variant={"xw_ghost"} onClick={() => handleRegenerate?.()}>
              <RefreshCcw className="h-3 w-3" />
            </Button>
          )} */}
          <Button size={"sm"} variant={"ghost"} onClick={handleCopyToClipBoard}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatResponse;
