import { cn, dataAttr } from "@atomscraft/core";
import type { CSSProperties, HTMLAttributes } from "react";
import { Badge } from "../../atoms/badge";
import { CopyButton } from "../copy-button";

export type CodeBlockProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The source to display. Kept as text, so copying returns it unchanged. */
  code: string;
  /** Shown as a badge, and set as `data-language` for an external highlighter. */
  language?: string;
  /** File name shown in the header. */
  filename?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  /** Wraps long lines instead of scrolling them. */
  wrap?: boolean;
  /** Scrolls beyond this many lines. */
  maxLines?: number | undefined;
};

type HeaderProps = {
  code: string;
  filename: string | undefined;
  language: string | undefined;
  copyable: boolean;
};

function CodeBlockHeader({ filename, language, copyable, code }: HeaderProps) {
  if (filename === undefined && language === undefined && !copyable) return null;
  return (
    <div className="ac-code-block__header">
      {filename !== undefined && <span className="ac-code-block__filename">{filename}</span>}
      {language !== undefined && (
        <Badge size="sm" variant="outline">
          {language}
        </Badge>
      )}
      {copyable && <CopyButton value={code} className="ac-code-block__copy" />}
    </div>
  );
}

/**
 * Read-only source listing with an optional header and copy button.
 *
 * It does not highlight syntax: that needs a grammar bundle, and AtomCraft ships
 * no dependencies. Run your own highlighter over the text and style it through
 * the `data-language` hook when you need colours.
 */
export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  copyable = true,
  wrap = false,
  maxLines,
  className,
  style,
  ...props
}: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");
  const limit = maxLines === undefined ? {} : ({ "--_max-lines": maxLines } as CSSProperties);

  return (
    <div
      {...props}
      data-slot="code-block"
      data-language={language}
      data-wrap={dataAttr(wrap)}
      className={cn("ac-code-block", className)}
      style={{ ...style, ...limit }}
    >
      <CodeBlockHeader filename={filename} language={language} copyable={copyable} code={code} />
      <pre className="ac-code-block__pre" data-numbered={dataAttr(showLineNumbers)} tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <span key={index} className="ac-code-block__line">
              {`${line}\n`}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
