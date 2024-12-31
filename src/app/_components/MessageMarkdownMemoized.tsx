import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        className={""}
        remarkPlugins={[remarkGfm, remarkMath]} // GFM and Math support
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              return (
                <CodeBlock
                  language={language}
                  value={String(children).replace(/\n$/, "")}
                  title={language}
                  {...props}
                />
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return <Table>{children}</Table>;
          },
          thead({ children }) {
            return <TableHeader>{children}</TableHeader>;
          },
          tbody({ children }) {
            return <TableBody>{children}</TableBody>;
          },
          tr({ children }) {
            return <TableRow>{children}</TableRow>;
          },
          td({ children }) {
            return <TableCell>{children}</TableCell>;
          },
          th({ children }) {
            return <TableHead>{children}</TableHead>;
          },
          a({ children, href }) {
            return (
              <Link
                href={href}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {children}
              </Link>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
