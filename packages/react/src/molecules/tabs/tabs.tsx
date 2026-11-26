import { cn } from "@atomscraft/core";
import { createContext, forwardRef, useContext, useId, useRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent } from "react";
import { useControllableState, useRovingFocus } from "../../hooks";
import { useComposedRefs } from "../../utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  orientation: "horizontal" | "vertical";
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs parts must be used inside Tabs.");
  return context;
}

const triggerId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export type TabsVariant = "line" | "pills" | "segmented";

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  value?: string | undefined;
  defaultValue: string;
  onValueChange?: ((value: string) => void) | undefined;
  orientation?: "horizontal" | "vertical";
  variant?: TabsVariant;
};

/** Tabs pattern (WAI-ARIA APG) with automatic activation: arrows move and select. */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  variant = "line",
  className,
  ...props
}: TabsProps) {
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ value: selected, setValue: setSelected, baseId, orientation }}>
      <div
        {...props}
        data-slot="tabs"
        data-orientation={orientation}
        data-variant={variant}
        className={cn("ac-tabs", className)}
      />
    </TabsContext.Provider>
  );
}

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TabsList({ className, onKeyDown, ...props }, forwardedRef) {
    const { orientation } = useTabs();
    const listRef = useRef<HTMLDivElement>(null);
    const ref = useComposedRefs(forwardedRef, listRef);
    const navigate = useRovingFocus(listRef, { orientation, loop: true });
    return (
      <div
        {...props}
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-slot="tabs-list"
        className={cn("ac-tabs__list", className)}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event);
          navigate(event);
        }}
      />
    );
  },
);

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { value: string };

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, onFocus, onClick, ...props },
  ref,
) {
  const tabs = useTabs();
  const isSelected = tabs.value === value;
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="tab"
      id={triggerId(tabs.baseId, value)}
      aria-selected={isSelected}
      aria-controls={panelId(tabs.baseId, value)}
      tabIndex={isSelected ? 0 : -1}
      data-roving-item=""
      data-state={isSelected ? "active" : "inactive"}
      data-slot="tabs-trigger"
      className={cn("ac-tabs__trigger", className)}
      onClick={(event) => {
        onClick?.(event);
        tabs.setValue(value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        tabs.setValue(value);
      }}
    />
  );
});

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & { value: string };

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, className, ...props },
  ref,
) {
  const tabs = useTabs();
  const isSelected = tabs.value === value;
  return (
    <div
      {...props}
      ref={ref}
      role="tabpanel"
      id={panelId(tabs.baseId, value)}
      aria-labelledby={triggerId(tabs.baseId, value)}
      tabIndex={0}
      hidden={!isSelected}
      data-state={isSelected ? "active" : "inactive"}
      data-slot="tabs-content"
      className={cn("ac-tabs__content", className)}
    />
  );
});
