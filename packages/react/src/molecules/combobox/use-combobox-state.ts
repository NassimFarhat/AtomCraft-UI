import { useRef, useState } from "react";
import { useListbox } from "../listbox";
import type { ListOption } from "../listbox";

export type ComboboxStateOptions = {
  options: readonly ListOption[];
  values?: readonly string[] | undefined;
  defaultValues: readonly string[];
  onValuesChange?: ((values: string[]) => void) | undefined;
  multiple?: boolean;
  disabled?: boolean | undefined;
};

/**
 * The typed query and the listbox it filters, shared by Combobox and MultiSelect.
 * Closing the list clears the query, so the box never keeps a stale filter.
 */
export function useComboboxState(options: ComboboxStateOptions) {
  const [query, setQuery] = useState("");
  /** The list lines up with the whole control, not with the text box inside it. */
  const rootRef = useRef<HTMLDivElement>(null);
  const listbox = useListbox({
    ...options,
    anchorRef: rootRef,
    query,
    onOpenChange: (open) => {
      if (!open) setQuery("");
    },
  });

  return {
    query,
    listbox,
    rootRef,
    /** Typing both filters the list and opens it. */
    search: (text: string) => {
      setQuery(text);
      listbox.setOpen(true);
    },
  };
}
