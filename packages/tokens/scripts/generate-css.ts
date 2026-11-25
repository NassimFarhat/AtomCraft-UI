import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderTokensCss } from "../src/css";
import { renderDtcgJson } from "../src/dtcg";

const here = dirname(fileURLToPath(import.meta.url));

const outputs = [
  [resolve(here, "../../css/src/tokens.css"), renderTokensCss()],
  [resolve(here, "../tokens.json"), renderDtcgJson()],
] as const;

for (const [target, content] of outputs) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
  console.warn(`Generated ${target}`);
}
