import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderTokensCss } from "./css";

const cssRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../css/src");
const componentDir = join(cssRoot, "components");
const sheets = [
  ...readdirSync(componentDir).map((file) => join(componentDir, file)),
  join(cssRoot, "reset.css"),
  join(cssRoot, "utilities.css"),
];

const defined = new Set(renderTokensCss().match(/--ac-[a-z0-9-]+(?=:)/g));
const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(/i;

describe.each(sheets.map((path) => [path.slice(cssRoot.length + 1), readFileSync(path, "utf8")]))(
  "%s",
  (_, css) => {
    it("only uses tokens that exist", () => {
      const used = css.match(/var\(--ac-[a-z0-9-]+/g)?.map((match) => match.slice(4)) ?? [];
      expect(used.filter((name) => !defined.has(name))).toEqual([]);
    });

    it("contains no raw color: colors come from tokens", () => {
      const lines = css.split("\n").filter((line) => RAW_COLOR.test(line));
      expect(lines).toEqual([]);
    });
  },
);
