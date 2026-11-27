import { cn } from "@atomscraft/core";
import { useRef } from "react";
import { useControllableState } from "../../hooks";
import type { KeyboardEvent } from "react";

export type RatingProps = {
  value?: number | undefined;
  defaultValue?: number;
  onValueChange?: ((value: number) => void) | undefined;
  label: string;
  max?: number;
  disabled?: boolean;
  className?: string;
};

/** Integer star rating with radio semantics and keyboard selection. */
export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  label,
  max = 5,
  disabled = false,
  className,
}: RatingProps) {
  const count = Math.max(1, Math.min(10, Math.trunc(max)));
  const rootRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useControllableState({
    value,
    defaultValue: Math.max(0, Math.min(count, defaultValue)),
    onChange: onValueChange,
  });
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, score: number) => {
    const next =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? score + 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? score - 1
          : event.key === "Home"
            ? 1
            : event.key === "End"
              ? count
              : score;
    if (next === score) return;
    event.preventDefault();
    const bounded = Math.max(1, Math.min(count, next));
    setRating(bounded);
    rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${bounded}"]`)?.focus();
  };

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={label}
      data-slot="rating"
      data-disabled={disabled || undefined}
      className={cn("ac-rating", className)}
    >
      {Array.from({ length: count }, (_, index) => {
        const score = index + 1;
        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-label={`${label} ${score}`}
            aria-checked={rating === score}
            tabIndex={rating === score || (!rating && score === 1) ? 0 : -1}
            disabled={disabled}
            data-slot="rating-item"
            data-value={score}
            data-filled={score <= rating || undefined}
            className="ac-rating__item"
            onClick={() => setRating(score)}
            onKeyDown={(event) => keyDown(event, score)}
          >
            <span aria-hidden="true">★</span>
          </button>
        );
      })}
    </div>
  );
}
