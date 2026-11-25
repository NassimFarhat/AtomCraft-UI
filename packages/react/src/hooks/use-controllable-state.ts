import { useCallback, useEffect, useRef, useState } from "react";

export type ControllableStateOptions<T> = {
  /** Controlled value. When defined, the component never owns the state. */
  value?: T | undefined;
  /** Initial value when uncontrolled. */
  defaultValue: T;
  /** Called on every change, controlled or not. */
  onChange?: ((value: T) => void) | undefined;
};

export type SetState<T> = (next: T | ((previous: T) => T)) => void;

/** One state API for both controlled and uncontrolled components. */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): readonly [T, SetState<T>] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;
  const currentRef = useRef(current);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    currentRef.current = current;
    onChangeRef.current = onChange;
  });

  const setValue = useCallback<SetState<T>>(
    (next) => {
      const resolved =
        typeof next === "function" ? (next as (previous: T) => T)(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      currentRef.current = resolved;
      if (!isControlled) setInternalValue(resolved);
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue] as const;
}
