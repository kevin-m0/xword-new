import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useGetActiveSpace } from "~/hooks/workspace/useGetActiveSpace";

const CloudinaryUploadWidget = ({ uwConfig, setPublicId }: any) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  const [video, setVideo] = useState<any>({});

  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  const { data: defaultSpace, isLoading: isWorkspaceFetching } =
    useGetActiveSpace();

  const { mutateAsync: createVideoProject } =
    trpc.videoProject.createVideoProject.useMutation();

  const { data } = trpc.videoProject.getVideoMetadata.useQuery(
    {
      type: "mux",
      url: video.url as string,
      languagecode: "en",
    },
    {
      enabled: !!video.url,
      onSuccess: async (data) => {
        console.log(video, "video properties from cloudinary");
        const videoId = await createVideoProject({
          title: data.title,
          description: data.description,
          ytChapters: JSON.stringify(data.chapters),
          transcript: data.transcript,
          subtitles: data.subtitles,
          words: JSON.stringify(data.words),
          workspaceId: defaultSpace?.id as string,
          processStatus: "PROCESSING",
          videoType: "UPLOAD",
          videoUrl: video.url as string,
          thumbnailUrl: video.thumbnail_url as string,
          createdBy: user?.id as string,
          path: video.path as string,
          duration: video.duration as number,
        });
        router.push(`/videoverse/${videoId.id}`);
      },
    },
  );

  useEffect(() => {
    const initializeUploadWidget = async () => {
      if (window.cloudinary && uploadButtonRef.current) {
        console.log("upload widget is ready");
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error: any, result: any) => {
            if (!error && result && result.event === "success") {
              setVideo(result.info);
            }
          },
        );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener("click", handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener("click", handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicId]);

  return (
    <Button
      variant={"default"}
      size={"sm"}
      ref={uploadButtonRef}
      id="upload_widget"
      // className="cloudinary-button"
    >
      Upload Video <UploadCloud className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default CloudinaryUploadWidget;
