import { Button, IconButton } from "../../atoms/button";
import type { ButtonSize } from "../../atoms/button";
import { IconLanguages } from "../../icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../molecules/dropdown-menu";
import { useAtomCraft } from "../../provider";

export type LocaleOption = {
  /** BCP 47 tag, e.g. "fr-TN". */
  value: string;
  /** Name of the language in that language, which is what speakers recognise. */
  label: string;
};

export type LocaleSwitcherProps = {
  /** Locales to offer. Defaults to the three with built-in labels. */
  locales?: readonly LocaleOption[];
  compact?: boolean;
  size?: ButtonSize;
  className?: string;
};

const BUILT_IN: readonly LocaleOption[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
];

const languageOf = (locale: string): string => locale.split("-")[0]?.toLowerCase() ?? locale;

/** Switches the locale, and with it the text direction, on the surrounding provider. */
export function LocaleSwitcher({
  locales = BUILT_IN,
  compact = false,
  size = "sm",
  className,
}: LocaleSwitcherProps) {
  const { locale, setLocale, messages } = useAtomCraft();
  const current = locales.find((option) => languageOf(option.value) === languageOf(locale));

  return (
    <DropdownMenu align="end">
      <DropdownMenuTrigger>
        {compact ? (
          <IconButton label={messages.language} size={size} className={className}>
            <IconLanguages />
          </IconButton>
        ) : (
          <Button variant="outline" tone="neutral" size={size} className={className}>
            <IconLanguages />
            {current?.label ?? locale}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label={messages.language}>
        {locales.map((option) => (
          <DropdownMenuRadioItem
            key={option.value}
            checked={option.value === current?.value}
            onSelect={() => setLocale(option.value)}
          >
            <span lang={option.value}>{option.label}</span>
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
