"use client";

import { MemoizedMarkdown } from "./MessageMarkdownMemoized";

interface MarkdownContentProps {
  content: string;
  id: string;
}

export const MarkdownContent = ({ content, id }: MarkdownContentProps) => {
  return <MemoizedMarkdown content={content} id={id} />;
};
