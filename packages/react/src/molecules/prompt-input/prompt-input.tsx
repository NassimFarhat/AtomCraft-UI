import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { FormEvent, FormHTMLAttributes, KeyboardEvent, TextareaHTMLAttributes } from "react";
import { Button } from "../../atoms/button";
import { Textarea } from "../../atoms/textarea";
import { useControllableState } from "../../hooks";

export type PromptInputProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  onSubmit?: ((value: string, event: FormEvent<HTMLFormElement>) => void) | undefined;
  inputLabel: string;
  submitLabel: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  rows?: number;
  enterToSubmit?: boolean;
  inputProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

/** Multi-line prompt composer that emits text and submit events without owning the conversation. */
export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  {
    value,
    defaultValue = "",
    onValueChange,
    onSubmit,
    inputLabel,
    submitLabel,
    placeholder,
    disabled = false,
    loading = false,
    rows = 3,
    enterToSubmit = true,
    inputProps,
    className,
    ...formProps
  },
  ref,
) {
  const [text, setText] = useControllableState({ value, defaultValue, onChange: onValueChange });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!disabled && !loading && text.trim()) {
      onSubmit?.(text, event);
      setText("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    inputProps?.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (
      enterToSubmit &&
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      {...formProps}
      data-slot="prompt-input"
      className={cn("ac-prompt-input", className)}
      onSubmit={submit}
    >
      <Textarea
        {...inputProps}
        ref={ref}
        aria-label={inputLabel}
        placeholder={placeholder}
        rows={rows}
        value={text}
        disabled={disabled || loading}
        className="ac-prompt-input__control"
        onChange={(event) => {
          inputProps?.onChange?.(event);
          setText(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <Button type="submit" loading={loading} disabled={disabled || !text.trim()}>
        {submitLabel}
      </Button>
    </form>
  );
});
