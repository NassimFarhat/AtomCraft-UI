import { cn } from "@atomscraft/core";
import { createContext, useContext, useId } from "react";
import type { ReactNode } from "react";
import { Radio } from "../../atoms/radio";
import { useControllableState } from "../../hooks";
import type { ControlSize, Tone } from "../../types";

type RadioGroupContextValue = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  size: ControlSize;
  tone: Tone;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error("RadioGroupItem must be used inside a RadioGroup.");
  return context;
}

export type RadioGroupProps = {
  label: ReactNode;
  children: ReactNode;
  value?: string | undefined;
  defaultValue?: string;
  onValueChange?: ((value: string) => void) | undefined;
  /** Form field name. Generated when omitted. */
  name?: string;
  description?: ReactNode;
  /** `cards` turns each option into a selectable tile. */
  variant?: "list" | "cards";
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  size?: ControlSize;
  tone?: Tone;
  className?: string;
};

export function RadioGroup({
  label,
  children,
  value,
  defaultValue = "",
  onValueChange,
  name,
  description,
  variant = "list",
  orientation = "vertical",
  disabled = false,
  size = "md",
  tone = "primary",
  className,
}: RadioGroupProps) {
  const baseId = useId();
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const context = {
    name: name ?? baseId,
    value: selected,
    setValue: setSelected,
    disabled,
    size,
    tone,
  };

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        className={cn("ac-radio-group", className)}
        data-slot="radio-group"
        data-variant={variant}
        data-orientation={orientation}
        disabled={disabled}
        aria-describedby={description ? `${baseId}-description` : undefined}
      >
        <legend className="ac-radio-group__label">{label}</legend>
        {description && (
          <p id={`${baseId}-description`} className="ac-radio-group__description">
            {description}
          </p>
        )}
        <div className="ac-radio-group__items">{children}</div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
}: RadioGroupItemProps) {
  const group = useRadioGroup();
  const id = useId();
  return (
    <div className="ac-radio-group__item" data-disabled={disabled || undefined}>
      <Radio
        id={id}
        name={group.name}
        value={value}
        size={group.size}
        tone={group.tone}
        checked={group.value === value}
        disabled={disabled || group.disabled}
        aria-describedby={description ? `${id}-description` : undefined}
        onChange={() => group.setValue(value)}
      />
      <span className="ac-radio-group__text">
        <label htmlFor={id} className="ac-radio-group__item-label">
          {label}
        </label>
        {description && (
          <span id={`${id}-description`} className="ac-radio-group__item-description">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
