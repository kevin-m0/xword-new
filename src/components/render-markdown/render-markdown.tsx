import React from "react";
import "katex/dist/katex.min.css";
import { cn } from "~/utils/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { preprocessLaTeX } from "./process-latex";
export const RenderMarkdown = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  if (!content || content.length === 0) return null;
  return (
    <div
      className={cn(
        "prose prose-table:border-collapse prose-table:border-white prose-table:border prose-th:p-2 prose-th:border prose-th:border-white prose-td:p-2 prose-td:border prose-td:border-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm prose-p:text-base prose-ul:text-sm prose-ol:text-sm prose-li:text-sm prose-li:pl-0 prose-pre:bg-black prose-pre:rounded-sm prose-tr:border prose-tr:border-white prose-pre:max-w-full w-full max-w-full",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {preprocessLaTeX(content) ?? content}
      </Markdown>
    </div>
  );
};
