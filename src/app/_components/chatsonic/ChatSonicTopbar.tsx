import React from "react";
// import NotificationBar from '../topbar/NotificationBar'
// import UserBox from '../topbar/UserBox'

const ChatSonicTopbar = ({
  mobileSidebar,
}: {
  mobileSidebar: React.ReactNode;
}) => {
  return (
    <div className="flex w-full items-center gap-2 p-3">
      <div className="tb:hidden">{mobileSidebar}</div>
      <div className="ml-auto mr-0 flex items-center gap-2">
        {/* <NotificationBar /> */}
        {/* <UserBox /> */}
      </div>
    </div>
  );
};

export default ChatSonicTopbar;
