"use client";

import React from "react";
import { useAtom } from "jotai";
import {
  socialAccountsAtom,
  selectedAccountAtom,
  selectedOptionAtom,
} from "~/atoms/calendarAtoms";
import Image from "next/image";

const SelectOptionsModel = () => {
  const [socialAccounts] = useAtom(socialAccountsAtom);
  const [selectedAccount] = useAtom(selectedAccountAtom);
  const [selectedOption, setSelectedOption] = useAtom(selectedOptionAtom);

  const account = socialAccounts.find((acc) => acc.value === selectedAccount);
  const options = account?.options || [];

  return (
    <div className="grid h-full flex-1 grid-cols-2 gap-5">
      {options.map((option) => (
        <div
          key={option.id}
          className={`flex h-full flex-col items-center justify-center rounded-lg border p-10 ${
            selectedOption === option.id
              ? "border-dashed border-xw-primary bg-xw-secondary"
              : "border-dashed border-xw-secondary bg-transparent"
          } cursor-pointer`}
          onClick={() => setSelectedOption(option.id)}
        >
          <Image src={option.icon} alt={option.label} width={40} height={40} />
          <h3 className="mt-4 text-lg font-semibold">{option.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default SelectOptionsModel;
