import AttachIconChat from "~/icons/AttachIconChat";

function UrlPrompt({ url }: { url: string }) {
  //use id for downloading document from s3
  return (
    <div className="relative z-10 inline-flex h-[60px] w-[640px] items-center gap-2 rounded-[10px] border bg-white bg-opacity-20 px-3 py-1">
      <div className="flex h-11 w-11 items-center rounded-sm border bg-black p-[0.625rem]">
        <AttachIconChat />
      </div>
      <div className="flex flex-col overflow-hidden text-clip text-wrap">
        <div className="overflow-hidden truncate text-[16px]">{url}</div>
        <div className="text-[10px]">URL Link</div>
      </div>
    </div>
  );
}

export default UrlPrompt;
