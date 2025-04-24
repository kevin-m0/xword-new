import { useEffect } from "react";

export const useKeyboardShortcut = (
  keys: string[],
  callback: (event: KeyboardEvent) => void,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        callback(event); // Pass the event to the callback
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};
