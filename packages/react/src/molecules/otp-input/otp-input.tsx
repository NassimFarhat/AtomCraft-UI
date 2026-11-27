import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef, useRef } from "react";
import type { ClipboardEvent, HTMLAttributes, KeyboardEvent } from "react";
import { useControllableState } from "../../hooks";
import { useComposedRefs } from "../../utils";

export type OTPInputProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  label: string;
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  onComplete?: ((value: string) => void) | undefined;
  name?: string;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  inputMode?: "numeric" | "text";
};

/** One-time-code input with paste distribution and arrow/backspace navigation. */
export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(function OTPInput(
  {
    label,
    value,
    defaultValue = "",
    onValueChange,
    onComplete,
    name,
    length = 6,
    disabled = false,
    invalid = false,
    inputMode = "numeric",
    className,
    ...props
  },
  forwardedRef,
) {
  const count = Math.max(1, Math.min(12, Math.trunc(length)));
  const normalizedDefault = defaultValue.slice(0, count);
  const [code, setCode] = useControllableState({
    value: value?.slice(0, count),
    defaultValue: normalizedDefault,
    onChange: onValueChange,
  });
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const firstRef = useComposedRefs(forwardedRef, (node: HTMLInputElement | null) => {
    refs.current[0] = node;
  });

  const commit = (next: string, focusIndex?: number) => {
    const clipped = next.slice(0, count);
    setCode(clipped);
    if (clipped.length === count) onComplete?.(clipped);
    if (focusIndex !== undefined) refs.current[focusIndex]?.focus();
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\s/g, "");
    const chars = inputMode === "numeric" ? pasted.replace(/\D/g, "") : pasted;
    const next = code.split("");
    [...chars].slice(0, count - index).forEach((character, offset) => {
      next[index + offset] = character;
    });
    const joined = next.join("").slice(0, count);
    commit(joined, Math.min(index + chars.length, count - 1));
  };

  const onDigitKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < count - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    } else if (event.key === "Backspace") {
      if (code[index]) {
        const next = code.split("");
        next[index] = "";
        commit(next.join(""));
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (event.key === "Delete" && code[index]) {
      const next = code.split("");
      next[index] = "";
      commit(next.join(""));
    }
  };

  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      data-slot="otp-input"
      data-invalid={dataAttr(invalid)}
      className={cn("ac-otp-input", className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <input
          key={index}
          ref={index === 0 ? firstRef : (node) => (refs.current[index] = node)}
          type="text"
          inputMode={inputMode}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern={inputMode === "numeric" ? "[0-9]*" : undefined}
          maxLength={1}
          value={code[index] ?? ""}
          disabled={disabled}
          aria-label={`${label} ${index + 1}`}
          aria-invalid={invalid || undefined}
          data-slot="otp-digit"
          data-filled={dataAttr(Boolean(code[index]))}
          className="ac-otp-input__digit"
          onChange={(event) => {
            const raw = event.target.value;
            const character =
              inputMode === "numeric" ? raw.replace(/\D/g, "").slice(-1) : raw.slice(-1);
            const next = code.split("");
            next[index] = character;
            commit(next.join(""), character && index < count - 1 ? index + 1 : undefined);
          }}
          onPaste={(event) => onPaste(event, index)}
          onKeyDown={(event) => onDigitKeyDown(event, index)}
        />
      ))}
      {name && <input type="hidden" name={name} value={code} />}
    </div>
  );
});
