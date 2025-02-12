"use client";

import React from "react";
import { WEB_DEFAULT_PROMPTS, NORMAL_DEFAULT_PROMPTS } from "./constants";
import Image from "next/image";
import { useUser } from "~/hooks/misc/useUser";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";

const ChatSonicDefaultScreen = ({
  mode,
  setChatInput,
}: {
  mode: string;
  setChatInput: (props: string) => void;
}) => {
  const { data: user } = useUser();
  const name = user?.name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="my-auto flex flex-col items-center justify-center gap-2 text-center">
      <Image
        src="/icons/chatmagic.svg"
        height={30}
        width={30}
        alt="chat"
        className="mx-auto mb-5"
      />
      {mode === "Normal" || mode === "Docs" ? (
        <h1 className="text-4xl font-semibold text-primary">
          Hello,{" "}
          <span className="xw-chatsonic-default-text">
            {name?.split(" ")[0]}
          </span>
          !
        </h1>
      ) : (
        <h1 className="text-4xl font-semibold text-primary">
          The web, <span className="xw-chatsonic-default-text">neatly</span>{" "}
          <span className="xw-chatsonic-default-text">arranged</span>!
        </h1>
      )}
      {mode === "Normal" || mode === "Docs" ? (
        <p className="text-xw-muted">How can I help you today?</p>
      ) : (
        <p className="text-xw-muted">
          Helping you find what matters, with a web experience that&apos;s clean
          and intuitive.
        </p>
      )}

      <div className="mt-5">
        <h1>
          {mode === "Normal" || mode === "Docs"
            ? "Ask about:"
            : "Search about:"}
        </h1>

        <div className="mt-5 flex max-w-lg flex-wrap justify-center gap-2">
          {(mode === "Web" ? WEB_DEFAULT_PROMPTS : NORMAL_DEFAULT_PROMPTS).map(
            (prompt) => (
              <XWSecondaryButton
                key={prompt}
                onClick={() => setChatInput(prompt)}
                className1="rounded-full "
                className2="rounded-full"
              >
                {prompt}
              </XWSecondaryButton>
            ),
          )}
          {/* <Button variant={"xw_ghost"} className='rounded-full'>
                        See Prompt Library
                    </Button> */}
        </div>
      </div>
    </div>
  );
};

export default ChatSonicDefaultScreen;
