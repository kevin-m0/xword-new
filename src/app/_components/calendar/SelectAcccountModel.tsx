"use client";

import React from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { socialAccountsAtom, selectedAccountAtom } from "~/atoms/calendarAtoms";
import {
  isFacebookConnectedAtom,
  isInstagramConnectedAtom,
  isLinkedInConnectedAtom,
  isTwitterConnectedAtom,
  isYoutubeConnectedAtom,
} from "~/atoms";

const SelectAccountModel = () => {
  const [socialAccounts] = useAtom(socialAccountsAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const [isTwitterConnected] = useAtom(isTwitterConnectedAtom);
  const [isLinkedInConnected] = useAtom(isLinkedInConnectedAtom);
  const [isInstagramConnected] = useAtom(isInstagramConnectedAtom);
  const [isFacebookConnected] = useAtom(isFacebookConnectedAtom);
  const [isYoutubeConnected] = useAtom(isYoutubeConnectedAtom);

  console.log(
    isFacebookConnected,
    isInstagramConnected,
    isLinkedInConnected,
    isTwitterConnected,
    isYoutubeConnected,
  );

  return (
    <div className="grid grid-cols-2 gap-5">
      {socialAccounts.map((account, index) => {
        const connectionStatus: Record<string, boolean> = {
          X: isTwitterConnected,
          LinkedIn: isLinkedInConnected,
          Instagram: isInstagramConnected,
          Facebook: isFacebookConnected,
          Youtube: isYoutubeConnected,
        };

        const isDisabled = !connectionStatus[account.name];

        return (
          <div
            key={index}
            className={`flex items-center gap-4 rounded-lg border border-dashed bg-black p-5 ${
              isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            } ${
              selectedAccount === account.value
                ? "border-dashed border-xw-primary bg-xw-secondary"
                : "border-xw-secondary"
            }`}
            onClick={() => {
              if (!isDisabled) {
                setSelectedAccount(account.value);
              }
            }}
          >
            <Image
              src={account.image}
              alt={account.name}
              width={40}
              height={40}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{account.name}</h3>
              <p className="text-sm text-xw-muted">
                {!isDisabled ? account.username : "Not Available"}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                !isDisabled
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {!isDisabled ? "Connected" : "Not Connected"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SelectAccountModel;
