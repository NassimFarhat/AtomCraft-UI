import { describe, expect, it, vi } from "vitest";
import { computePosition } from "./position";
import { findTypeaheadMatch, getNextIndex } from "./navigation";
import { getPageItems } from "./pagination";
import { createStore } from "./store";

const viewport = { width: 1000, height: 800 };
const floating = { width: 200, height: 100 };

describe("computePosition", () => {
  it("centers below the anchor by default", () => {
    const anchor = { x: 400, y: 100, width: 100, height: 40 };
    expect(computePosition(anchor, floating, viewport)).toEqual({ x: 350, y: 148, side: "bottom" });
  });

  it("flips to the top when there is no room below", () => {
    const anchor = { x: 400, y: 740, width: 100, height: 40 };
    expect(computePosition(anchor, floating, viewport).side).toBe("top");
  });

  it("shifts inside the viewport on the cross axis", () => {
    const anchor = { x: 0, y: 100, width: 40, height: 40 };
    expect(computePosition(anchor, floating, viewport, { padding: 8 }).x).toBe(8);
  });

  it("aligns to the start edge", () => {
    const anchor = { x: 400, y: 100, width: 100, height: 40 };
    expect(computePosition(anchor, floating, viewport, { align: "start" }).x).toBe(400);
  });
});

describe("getNextIndex", () => {
  it.each([
    ["ArrowDown", 0, 1],
    ["ArrowUp", 0, 4],
    ["Home", 3, 0],
    ["End", 1, 4],
  ])("vertical %s from %i goes to %i (looping)", (key, from, to) => {
    expect(getNextIndex(from, 5, key)).toBe(to);
  });

  it("inverts horizontal arrows in RTL", () => {
    expect(getNextIndex(1, 5, "ArrowLeft", { orientation: "horizontal", dir: "rtl" })).toBe(2);
  });

  it("stops at the ends without loop", () => {
    expect(getNextIndex(4, 5, "ArrowDown", { loop: false })).toBe(4);
  });

  it("ignores other keys", () => {
    expect(getNextIndex(0, 5, "a")).toBeUndefined();
  });
});

describe("findTypeaheadMatch", () => {
  const labels = ["Edit", "Duplicate", "Delete", "Archive"];

  it("finds the next item starting with the query, after the current one", () => {
    expect(findTypeaheadMatch(labels, "d", 1)).toBe(2);
    expect(findTypeaheadMatch(labels, "d", 2)).toBe(1);
  });

  it("returns undefined without a match", () => {
    expect(findTypeaheadMatch(labels, "z", 0)).toBeUndefined();
  });
});

describe("getPageItems", () => {
  it.each([
    [1, 5, [1, 2, 3, 4, 5]],
    [1, 10, [1, 2, 3, 4, 5, "ellipsis-end", 10]],
    [5, 10, [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]],
    [10, 10, [1, "ellipsis-start", 6, 7, 8, 9, 10]],
  ])("page %i of %i", (current, total, expected) => {
    expect(getPageItems(current, total)).toEqual(expected);
  });
});

describe("createStore", () => {
  it("notifies subscribers and supports updater functions", () => {
    const store = createStore(1);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.set((value) => value + 1);
    expect(store.get()).toBe(2);
    unsubscribe();
    store.set(5);
    expect(listener).toHaveBeenCalledOnce();
  });
});
