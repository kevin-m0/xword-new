import { storyBoardScriptAtom } from "~/atoms";
import { Button } from "~/components/ui/button";
import { useAtom } from "jotai";
import { FC } from "react";

interface ScriptEditorProps {
  goForward: () => void;
}

const ScriptEditor: FC<ScriptEditorProps> = ({ goForward }) => {
  const [script] = useAtom<string>(storyBoardScriptAtom);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl">Generated Script</h1>
      <div className="flex items-center justify-between p-4">{script}</div>
      <Button variant={"default"} className="px-4 py-2" onClick={goForward}>
        Select Style
      </Button>
    </div>
  );
};

export default ScriptEditor;
