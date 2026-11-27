import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Input } from "../../atoms/input";
import { Stack } from "../../layout";
import { elementRef } from "../../utils";
import { ListboxContent, useListbox } from "./index";
import type { ListOption } from "./index";

const meta = {
  title: "Molecules/Listbox",
  parameters: {
    docs: {
      description: {
        component:
          "An advanced listbox building block shared by Combobox, MultiSelect and SelectMenu. Most applications should use one of those complete controls.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const locations: ListOption[] = [
  { value: "sfax", label: "Sfax", group: "Tunisia" },
  { value: "tunis", label: "Tunis", group: "Tunisia" },
  { value: "sousse", label: "Sousse", group: "Tunisia" },
  { value: "paris", label: "Paris", group: "France" },
  { value: "lyon", label: "Lyon", group: "France" },
  { value: "marseille", label: "Marseille", group: "France", disabled: true },
];

function ListboxExample() {
  const [query, setQuery] = useState("");
  const listbox = useListbox({
    options: locations,
    defaultValues: ["tunis"],
    multiple: true,
    query,
    defaultOpen: true,
  });
  const activeId =
    listbox.isOpen && listbox.activeIndex !== -1
      ? listbox.optionId(listbox.activeIndex)
      : undefined;

  return (
    <Stack gap="3" style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Input
        aria-label="Filter locations"
        placeholder="Filter locations"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="ac-select-menu" data-slot="listbox-example">
        <button
          ref={elementRef<HTMLButtonElement>(listbox.triggerRef)}
          type="button"
          role="combobox"
          aria-label="Selected locations"
          aria-haspopup="listbox"
          aria-expanded={listbox.isOpen}
          aria-controls={listbox.isOpen ? listbox.listId : undefined}
          aria-activedescendant={activeId}
          className="ac-select-menu__trigger"
          onClick={() => (listbox.isOpen ? listbox.close() : listbox.open())}
          onKeyDown={listbox.handleKeyDown}
        >
          <span className="ac-select-menu__value">
            {listbox.selected.length} locations selected
          </span>
        </button>
        <ListboxContent listbox={listbox} multiple empty="No matching locations." />
      </div>
    </Stack>
  );
}

export const GroupedMultiSelect: Story = {
  render: () => <ListboxExample />,
};
