import CustomLoader from "~/components/loaders/custom-loader";

function ChatLoading() {
  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      <div>
        <CustomLoader />
        <p className="mt-4 text-gray-700">Getting things ready</p>
      </div>
    </div>
  );
}

export default ChatLoading;
