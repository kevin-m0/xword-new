import React, {
	useEffect,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from "react";
import { keyBoardContext } from "../contexts/keyBoardContext";
import { shortCutContext } from "../contexts/shortCutContext";

type KeyBordProviderProps = {
	children: React.ReactNode;
};

export const KeyBordProvider: React.FC<KeyBordProviderProps> = ({
	children,
}) => {
	const { triggerListner } = useContext(shortCutContext);
	const keysRef = useRef<Set<string>>(new Set());

	const clearKeys = useCallback(() => {
		keysRef.current.clear();
	}, []);

	const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
	const clearKeysTimeout = useCallback(() => {
		if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
		timeoutIdRef.current = setTimeout(clearKeys, 1000);
	}, [clearKeys]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			keysRef.current.add(e.key?.toLowerCase());
			triggerListner(keysRef.current, e);
			clearKeysTimeout();
		},
		[triggerListner, clearKeysTimeout]
	);

	const handleKeyUp = useCallback(
		(e: KeyboardEvent) => {
			keysRef.current.delete(e.key?.toLowerCase());
			clearKeysTimeout();
		},
		[clearKeysTimeout]
	);

	useEffect(() => {
		const handleKeyDownWrapped = (e: KeyboardEvent) => handleKeyDown(e);
		const handleKeyUpWrapped = (e: KeyboardEvent) => handleKeyUp(e);
		window.addEventListener("keydown", handleKeyDownWrapped);
		window.addEventListener("keyup", handleKeyUpWrapped);
		window.addEventListener("blur", clearKeys);
		window.addEventListener("mousedown", clearKeysTimeout);
		window.addEventListener("mousemove", clearKeysTimeout);

		return () => {
			window.removeEventListener("keydown", handleKeyDownWrapped);
			window.removeEventListener("keyup", handleKeyUpWrapped);
			window.removeEventListener("blur", clearKeys);
			window.removeEventListener("mousedown", clearKeysTimeout);
			window.removeEventListener("mousemove", clearKeysTimeout);
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current);
				timeoutIdRef.current = null;
			}
		};
	}, [handleKeyDown, handleKeyUp, clearKeys, clearKeysTimeout]);

	const contextValue = useMemo(() => ({}), []);

	return (
		<keyBoardContext.Provider value={contextValue}>
			{children}
		</keyBoardContext.Provider>
	);
};
