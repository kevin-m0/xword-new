import React from "react";
import { Loader } from "lucide-react";
const MessagesLoader = () => {
    return (
        <div className="flex justify-center items-center mb-2">
            <Loader className="h-4 w-4 animate-spin mt-1" />
        </div>
    );
};

export default MessagesLoader;
