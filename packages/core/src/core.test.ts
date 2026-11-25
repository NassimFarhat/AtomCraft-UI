import { describe, expect, it } from "vitest";
import { cn, dataAttr, getInitials } from "./index";

describe("cn", () => {
  it("keeps truthy class names only", () => {
    expect(cn("ac-button", false, undefined, null, "", "custom")).toBe("ac-button custom");
  });
});

describe("dataAttr", () => {
  it("returns an empty string when true and undefined when false", () => {
    expect(dataAttr(true)).toBe("");
    expect(dataAttr(false)).toBeUndefined();
  });
});

describe("getInitials", () => {
  it.each([
    ["Nassim Farhat", "NF"],
    ["  ada   lovelace byron ", "AL"],
    ["Plato", "P"],
    ["", ""],
  ])("%s -> %s", (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});
