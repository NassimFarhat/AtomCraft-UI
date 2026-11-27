import { cn } from "@atomscraft/core";
import { forwardRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent } from "react";
import { Input } from "../../atoms/input";
import { Tag } from "../../atoms/tag";
import { useControllableState } from "../../hooks";
import { formatMessage, useAtomCraft } from "../../provider";

export type TagInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "size"
> & {
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[];
  onValueChange?: ((value: string[]) => void) | undefined;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  removeLabel?: (tag: string) => string;
  size?: "sm" | "md" | "lg";
};

/** Token-entry field. Enter or comma adds a trimmed tag; Backspace removes the last tag. */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    value,
    defaultValue = [],
    onValueChange,
    onChange,
    removeLabel,
    size = "md",
    className,
    onKeyDown,
    disabled = false,
    ...props
  },
  ref,
) {
  const { messages } = useAtomCraft();
  const [tags, setTags] = useControllableState({
    value: value === undefined ? undefined : [...value],
    defaultValue: [...defaultValue],
    onChange: onValueChange,
  });
  const [draft, setDraft] = useState("");

  const addDraft = () => {
    const next = draft.trim();
    if (!next || tags.includes(next)) {
      setDraft("");
      return;
    }
    setTags((current) => [...current, next]);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraft();
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
    }
  };

  return (
    <div
      data-slot="tag-input"
      className={cn("ac-tag-input", className)}
      data-disabled={disabled || undefined}
    >
      <div className="ac-tag-input__tags">
        {tags.map((tag) => (
          <Tag
            key={tag}
            size="sm"
            disabled={disabled}
            removeLabel={
              removeLabel?.(tag) ?? formatMessage(messages.removeOption, { option: tag })
            }
            onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
          >
            {tag}
          </Tag>
        ))}
      </div>
      <Input
        {...props}
        ref={ref}
        size={size}
        disabled={disabled}
        value={draft}
        data-slot="tag-input-control"
        className="ac-tag-input__control"
        onChange={(event) => {
          setDraft(event.target.value);
          onChange?.(event);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
});
