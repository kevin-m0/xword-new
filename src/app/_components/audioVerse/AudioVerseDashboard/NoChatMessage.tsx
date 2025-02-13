import { Rocket } from "lucide-react";
const NoChatMessage = () => {
    return (
        <div className="flex items-center justify-center pt-12 relative z-10">
            <div>
                <div className="flex items-center justify-center">
                    <Rocket className="h-10 w-10 text-gray-600" />
                </div>
                <span className="text-gray-400 text-sm">
                    Your chats will appear here.
                </span>
            </div>
        </div>
    );
};

export default NoChatMessage;
