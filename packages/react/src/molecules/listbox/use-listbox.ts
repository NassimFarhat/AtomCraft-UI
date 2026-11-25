import { includesText } from "@atomcraft/core";
import { useId, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useControllableState, useFloatingLayer } from "../../hooks";
import type { FloatingLayerOptions } from "../../hooks";
import { findSelectable, isSelectable } from "./types";
import type { ListOption } from "./types";

export type UseListboxOptions = FloatingLayerOptions & {
  options: readonly ListOption[];
  /** Selected values. One entry for a single-choice list. */
  values?: readonly string[] | undefined;
  defaultValues?: readonly string[];
  onValuesChange?: ((values: string[]) => void) | undefined;
  multiple?: boolean | undefined;
  /** Filters the options. Leave empty for a list that is not searchable. */
  query?: string | undefined;
  disabled?: boolean | undefined;
};

const OPEN_KEYS = new Set(["ArrowDown", "ArrowUp", "Enter", " "]);

/** Adds or removes a value, which is what choosing an option does in a multiple list. */
const toggleValue = (values: readonly string[], value: string): string[] =>
  values.includes(value) ? values.filter((current) => current !== value) : [...values, value];

/** Options left after the query, which also decides what the keyboard walks. */
function useVisibleOptions(options: readonly ListOption[], query: string): ListOption[] {
  return useMemo(
    () =>
      query.trim() === ""
        ? [...options]
        : options.filter((option) => includesText(option.label, query)),
    [options, query],
  );
}

/**
 * State shared by Combobox, MultiSelect and SelectMenu: the popup layer,
 * the filtered options, the active option and the selection.
 */
export function useListbox({
  options,
  values,
  defaultValues = [],
  onValuesChange,
  multiple = false,
  query = "",
  disabled = false,
  ...layerOptions
}: UseListboxOptions) {
  /** The list opens under the control and lines up with it, like a native select. */
  const layer = useFloatingLayer({ align: "start", ...layerOptions });
  const [selected, setSelected] = useControllableState<readonly string[]>({
    value: values,
    defaultValue: defaultValues,
    onChange: onValuesChange as ((value: readonly string[]) => void) | undefined,
  });
  const baseId = useId();
  const visible = useVisibleOptions(options, query);
  const [requestedIndex, setActiveIndex] = useState(-1);
  /** Derived, so a shrinking list can never point past its last option. */
  const activeIndex = Math.min(requestedIndex, visible.length - 1);

  const isSelected = (value: string) => selected.includes(value);

  const select = (option: ListOption) => {
    if (!isSelectable(option)) return;
    setSelected(multiple ? toggleValue(selected, option.value) : [option.value]);
    if (!multiple) layer.close();
  };

  /** Moves the active option, wrapping around and skipping disabled ones. */
  const move = (step: 1 | -1, from = activeIndex) => {
    const target = from + step;
    const wrapped = target < 0 ? visible.length - 1 : target >= visible.length ? 0 : target;
    const next = findSelectable(visible, wrapped, step);
    setActiveIndex(
      next === -1 ? findSelectable(visible, step === 1 ? 0 : visible.length - 1, step) : next,
    );
  };

  const open = (step: 1 | -1 = 1) => {
    layer.setOpen(true);
    move(step, step === 1 ? -1 : visible.length);
  };

  const api = {
    ...layer,
    listId: `${baseId}-list`,
    optionId: (index: number) => `${baseId}-option-${index}`,
    visible,
    activeIndex,
    setActiveIndex,
    selected,
    setSelected,
    isSelected,
    select,
    move,
    open,
  };

  return { ...api, handleKeyDown: (event: KeyboardEvent) => handleKey(event, api, disabled) };
}

type ListboxApi = {
  isOpen: boolean;
  visible: readonly ListOption[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  close: (returnFocus?: boolean) => void;
  select: (option: ListOption) => void;
  move: (step: 1 | -1, from?: number) => void;
  open: (step?: 1 | -1) => void;
};

/** APG listbox keys: open with arrows, walk the options, choose with Enter. */
function handleKey(event: KeyboardEvent, api: ListboxApi, disabled: boolean): void {
  if (disabled) return;
  if (!api.isOpen) {
    if (!OPEN_KEYS.has(event.key)) return;
    event.preventDefault();
    api.open(event.key === "ArrowUp" ? -1 : 1);
    return;
  }
  const actions: Readonly<Record<string, () => void>> = {
    ArrowDown: () => api.move(1),
    ArrowUp: () => api.move(-1),
    Home: () => api.move(1, -1),
    End: () => api.move(-1, api.visible.length),
    Escape: () => api.close(),
    Enter: () => {
      const option = api.visible[api.activeIndex];
      if (option) api.select(option);
    },
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
}

export type Listbox = ReturnType<typeof useListbox>;
