"use client";

import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  BarChart2,
  Globe,
  Video,
  PlaneTakeoff,
  AudioLines,
} from "lucide-react";
import useDebounce from "~/hooks/use-debounce";

interface Action {
  id: string;
  label: string;
  icon: JSX.Element;
  description?: string;
  short?: string;
  end?: string;
}

const allActions: Action[] = [
  {
    id: "1",
    label: "AI Storyboard",
    icon: <PlaneTakeoff className="h-4 w-4 text-blue-500" />,
    description: "Generate",
    short: "⌘K",
    end: "Agent",
  },
  {
    id: "2",
    label: "VideoVerse",
    icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
    description: "Video Editor",
    short: "",
    end: "Command",
  },
  {
    id: "3",
    label: "Screen Studio",
    icon: <Video className="h-4 w-4 text-purple-500" />,
    description: "gpt-4o",
    end: "Application",
  },
  {
    id: "4",
    label: "Talk to Jarvis",
    icon: <AudioLines className="h-4 w-4 text-green-500" />,
    description: "gpt-4o voice",
    end: "Active",
  },
  {
    id: "5",
    label: "Translate",
    icon: <Globe className="h-4 w-4 text-blue-500" />,
    description: "gpt-4o",
    end: "Command",
  },
];

function ActionSearchBar({ actions = allActions }: { actions?: Action[] }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 200);

  const filteredActions = debouncedQuery
    ? actions.filter((action) =>
        action.label
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase().trim()),
      )
    : actions;

  return (
    <div className="">
      <div className="relative flex w-full flex-col items-center">
        <div className="sticky top-0 z-10 w-full max-w-sm bg-background pb-1 pt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="h-12 rounded-lg py-1.5 pl-3 pr-9 text-sm focus-visible:ring-offset-0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                  >
                    <Send className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                  >
                    <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="mt-1 w-full rounded-md border bg-white shadow-sm dark:border-gray-800 dark:bg-black"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  height: { duration: 0.4 },
                  opacity: { duration: 0.2 },
                }}
              >
                <motion.ul>
                  {filteredActions.map((action) => (
                    <motion.li
                      key={action.id}
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-zinc-900"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        {action.icon}
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {action.label}
                        </span>
                        {action.description && (
                          <span className="text-xs text-gray-400">
                            {action.description}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {action.short && <span>{action.short}</span>}
                        <span>{action.end}</span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="mt-2 flex justify-between border-t border-gray-100 px-3 py-2 text-xs text-gray-500 dark:border-gray-800">
                  <span>Press ⌘K to open commands</span>
                  <span>ESC to cancel</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ActionSearchBar;
