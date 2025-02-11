import React, { useState } from "react";
const buildShortCutIndex = (keys: Set<string>) => Array.from(keys).join("+");
import { shortCutContext } from "../contexts/shortCutContext";
export const ShortCutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [shortCutMap, addShortCutMap] = useState<Map<string, () => void>>(
    new Map()
  );
  const registerListner = (
    shortCutKey: Set<string>,
    eventHandler: () => void
  ) => {
    const shortCut = buildShortCutIndex(shortCutKey);
    addShortCutMap(shortCutMap.set(shortCut, eventHandler));
  };

  const triggerListner = (heldKeys: Set<string>, e: KeyboardEvent) => {
    const listner = shortCutMap.get(buildShortCutIndex(heldKeys));
    if (listner) {
      e.preventDefault();
      listner();
    }
  };

  const removeListner = (shortKeys: Set<string>) => {
    const shortcut = buildShortCutIndex(shortKeys);
    if (shortCutMap.has(shortcut)) {
      shortCutMap.delete(shortcut);
    }
  };
  return (
    <shortCutContext.Provider
      value={{ registerListner, removeListner, triggerListner }}
    >
      {children}
    </shortCutContext.Provider>
  );
};
