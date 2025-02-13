import { ChevronDown, ChevronRight, Send } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import AudioVerseExampleComponent from "./AudioVerseExampleComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useAtom } from "jotai";
import { promptAccordionAtom } from "~/atoms";
import XWButton from "~/components/reusable/XWButton";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";
import AIContentInput from "./AIContentInput";
import ResponseComponent from "./ResponseComponent";

const AudioVerseAIContentTab = ({ audioProject }: any) => {
  const [openItem, setOpenItem] = useAtom(promptAccordionAtom);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <AIContentInput audioProject={audioProject} />
      <ResponseComponent />

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openItem}
        onValueChange={setOpenItem}
      >
        <AccordionItem value="item-1">
          <div className="mt-5 flex items-center justify-between gap-2">
            <div className="relative">
              <AccordionTrigger>
                <XWButton className1=" relative" className2="text-sm">
                  Start With Examples
                  {!openItem ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </XWButton>
              </AccordionTrigger>
            </div>

            <div className="flex items-center gap-2">
              <XWSecondaryButton className2="text-sm">
                <Image
                  src={"/icons/collapse.svg"}
                  alt="collapse"
                  width={16}
                  height={16}
                />
                Collapse
              </XWSecondaryButton>

              <XWSecondaryButton className2="text-sm">
                <Image
                  src={"/icons/expand-arrow.svg"}
                  alt="expand"
                  width={16}
                  height={16}
                />
                Expand
              </XWSecondaryButton>

              <XWSecondaryButton className2="text-sm">
                <Image
                  src={"/icons/jump-curve.svg"}
                  alt="jump-curve"
                  width={16}
                  height={16}
                />
                Jump
              </XWSecondaryButton>
            </div>
          </div>

          <Separator />

          <AccordionContent>
            <AudioVerseExampleComponent audioProject={audioProject} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <div className="p-5 bg-xw-sidebar rounded-lg flex flex-col gap-4 border border-xw-secondary">
        <h1 className=" text-lg mb-2">One Thing to Always Do</h1>

        <p className=" text-xw-muted text-sm">
          Always keep pushing your boundaries in creativity 💪 <br /> <br />
          Regardless of how seasoned you are in your field, maintaining the
          drive to innovate will elevate your craft and inspire those around you
          🌟 <br /> <br />
          That&apos;s why, even when I feel my set is polished, I continually
          work on: <br /> <br />
          📝 Developing new material 🎤 Testing fresh ideas in front of a crowd
          📚 Learning from other greats in the industry 💡 Analyzing audience
          feedback to tweak performances <br /> <br />
          .... <br /> <br />
        </p>

        <div className=" mr-0 ml-auto flex items-center gap-2">
          <div>
            <XWSecondaryButton className2="text-sm">
              <Image src={"/icons/X.svg"} alt="stop" width={16} height={16} />
              Stop
            </XWSecondaryButton>
          </div>

          <div>
            <XWSecondaryButton className2="text-sm">
              <Image
                src={"/icons/save.svg"}
                alt="save"
                width={16}
                height={16}
              />
              Save
            </XWSecondaryButton>
          </div>

          <div>
            <XWSecondaryButton className2="text-sm">
              <Image
                src={"/icons/refresh.svg"}
                alt="reload"
                width={16}
                height={16}
              />
              Modify
            </XWSecondaryButton>
          </div>

          <div>
            <XWPremiumButton
              size="sm"
              rounded="full"
              className="flex items-center gap-2"
            >
              Open In WriterX <ChevronRight className="h-4 w-4" />
            </XWPremiumButton>
          </div>
        </div>
      </div> */}

      <div className="bg-xw-sidebar border-xw-secondary flex gap-4 rounded-lg border p-5">
        <div>
          <Image
            src={"/icons/info-fill.svg"}
            alt="info-fill"
            width={40}
            height={40}
          />
        </div>

        <div>
          <h1 className="mb-2 text-lg">
            You can now create and manage Custom Prompts
          </h1>

          <p className="text-xw-muted text-sm">
            Use Magic Chat to discover new prompt, when you save a chat it will
            generate for all of your recordings. Change the order of your
            prompts anytime, or edit the prompt to get it exactly right for your
            space.
          </p>
        </div>
      </div>

      {/* <RecurringContentComponent /> */}
    </div>
  );
};

export default AudioVerseAIContentTab;
