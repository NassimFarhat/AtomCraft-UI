import { Button, IconButton } from "../../atoms/button";
import { IconMonitor, IconMoon, IconSun } from "../../icons";
import { useAtomCraft } from "../../provider";
import type { ColorMode } from "../../provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../molecules/dropdown-menu";
import type { ButtonSize } from "../../atoms/button";

export type ThemeSwitcherProps = {
  /** Modes to offer, in order. */
  modes?: readonly ColorMode[];
  /** Icon-only trigger, for a dense header. */
  compact?: boolean;
  size?: ButtonSize;
  className?: string;
};

const ICONS: Readonly<Record<ColorMode, typeof IconSun>> = {
  light: IconSun,
  dark: IconMoon,
  system: IconMonitor,
};

/** Switches the colour mode on the surrounding AtomCraftProvider. */
export function ThemeSwitcher({
  modes = ["light", "dark", "system"],
  compact = false,
  size = "sm",
  className,
}: ThemeSwitcherProps) {
  const { mode, setMode, messages } = useAtomCraft();
  const names: Readonly<Record<ColorMode, string>> = {
    light: messages.lightMode,
    dark: messages.darkMode,
    system: messages.systemMode,
  };
  const Current = ICONS[mode];

  return (
    <DropdownMenu align="end">
      <DropdownMenuTrigger>
        {compact ? (
          <IconButton label={messages.theme} size={size} className={className}>
            <Current />
          </IconButton>
        ) : (
          <Button variant="outline" tone="neutral" size={size} className={className}>
            <Current />
            {names[mode]}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label={messages.theme}>
        {modes.map((option) => {
          const Glyph = ICONS[option];
          return (
            <DropdownMenuRadioItem
              key={option}
              checked={mode === option}
              icon={<Glyph />}
              onSelect={() => setMode(option)}
            >
              {names[option]}
            </DropdownMenuRadioItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
