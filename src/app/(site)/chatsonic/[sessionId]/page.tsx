import React from "react";
import NewChatComponent from "~/app/_components/chatsonic/NewChatComponent";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

const Page = async (props: { params: Promise<{ sessionId: string }> }) => {
  const params = await props.params;
  const { sessionId } = params;

  const chat =
    (await db.sonicChat.findFirst({
      where: {
        id: sessionId,
      },
    })) ?? [];

  const messages = await db.sonicMessage.findMany({
    where: {
      sessionId: sessionId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const chats = await api.chatsonic.fetchAllChats();

  return (
    <NewChatComponent
      sessionId={sessionId}
      messages={messages}
      chat={[chat]}
      chats={chats}
    />
  );
};
export default Page;
