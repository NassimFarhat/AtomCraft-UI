import { forwardRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { IconButton } from "../../atoms/button";
import { Input } from "../../atoms/input";
import type { InputProps } from "../../atoms/input";
import { Kbd } from "../../atoms/kbd";
import { useControllableState } from "../../hooks";
import { IconSearch, IconX } from "../../icons";
import { useMessages } from "../../provider";
import { InputGroup } from "../input-group";

export type SearchFieldProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  /** Called on Enter. */
  onSearch?: ((value: string) => void) | undefined;
  /** Keyboard hint shown at the end while empty, e.g. "⌘K". */
  shortcut?: ReactNode;
};

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    value,
    defaultValue = "",
    onValueChange,
    onSearch,
    shortcut,
    size = "md",
    onKeyDown,
    className,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const [query, setQuery] = useControllableState({ value, defaultValue, onChange: onValueChange });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.key === "Enter") onSearch?.(query);
    if (event.key === "Escape" && query) {
      event.preventDefault();
      setQuery("");
    }
  };

  const end = query ? (
    <IconButton label={messages.clearSearch} size="xs" onClick={() => setQuery("")}>
      <IconX />
    </IconButton>
  ) : (
    shortcut && <Kbd>{shortcut}</Kbd>
  );

  return (
    <InputGroup size={size} start={<IconSearch />} end={end} className={className}>
      <Input
        aria-label={messages.search}
        {...props}
        ref={ref}
        size={size}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
});
