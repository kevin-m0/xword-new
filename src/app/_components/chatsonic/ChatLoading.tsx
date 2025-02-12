import CustomLoader from "@/components/ui/custom-loader";

function ChatLoading() {
  return (
    <div className="relative z-10 flex items-center justify-center w-full h-full">
      <div>
        <CustomLoader />
        <p className="mt-4 text-gray-700">Getting things ready</p>
      </div>
    </div>
  );
}

export default ChatLoading;
