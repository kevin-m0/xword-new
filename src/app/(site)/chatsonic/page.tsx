import React from "react";
import NewChatComponent from "~/app/_components/chatsonic/NewChatComponent";
import { api } from "~/trpc/server";
import { generateUUID } from "~/utils/utils";

const Page = async () => {
  const id = generateUUID();

  const chats = await api.chatsonic.fetchAllChats();

  return (
    <NewChatComponent
      key={id}
      sessionId={id}
      messages={[]}
      chat={[]}
      chats={chats}
    />
  );
};
export default Page;
