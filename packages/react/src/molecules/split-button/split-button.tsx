import { cn } from "@atomscraft/core";
import type { ButtonProps } from "../../atoms/button";
import { Button, IconButton } from "../../atoms/button";
import { IconChevronDown } from "../../icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";

export type SplitButtonAction = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  tone?: "neutral" | "danger";
};

export type SplitButtonProps = {
  label: string;
  onClick: () => void;
  menuLabel: string;
  actions: readonly SplitButtonAction[];
  variant?: ButtonProps["variant"];
  tone?: ButtonProps["tone"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  className?: string;
};

/** Primary action paired with a menu of related secondary actions. */
export function SplitButton({
  label,
  onClick,
  menuLabel,
  actions,
  variant = "solid",
  tone = "primary",
  size = "md",
  disabled = false,
  className,
}: SplitButtonProps) {
  return (
    <div data-slot="split-button" className={cn("ac-split-button", className)}>
      <Button variant={variant} tone={tone} size={size} disabled={disabled} onClick={onClick}>
        {label}
      </Button>
      <DropdownMenu align="end">
        <DropdownMenuTrigger>
          <IconButton
            label={menuLabel}
            variant={variant}
            tone={tone}
            size={size}
            disabled={disabled || actions.length === 0}
            className="ac-split-button__trigger"
          >
            <IconChevronDown />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              disabled={Boolean(action.disabled)}
              tone={action.tone ?? "neutral"}
              onSelect={action.onSelect}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
