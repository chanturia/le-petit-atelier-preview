import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import {
  servicesFor,
  validPhone,
  athensDate,
} from "../site/assets/care-data.js";

assert.equal(servicesFor("dog").length, 3);
assert.equal(servicesFor("cat").length, 3);
assert(
  !servicesFor("dog", "short").some((service) => service.id === "haircut"),
);
assert(
  !servicesFor("cat", "short").some((service) => service.id === "haircut"),
);
assert(servicesFor("dog", "curly").some((service) => service.id === "haircut"));
assert(validPhone("+30 216 202 6495"));
assert(validPhone("2162026495"));
assert(!validPhone("1234"));
assert(!validPhone("abc2162026495"));
assert.equal(athensDate(new Date("2026-10-16T22:30:00Z")), "2026-10-17");
assert.equal(athensDate(new Date("2026-01-16T21:30:00Z")), "2026-01-16");

const site = new URL("../site/", import.meta.url);
const html = await readFile(new URL("index.html", site), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate HTML IDs");
for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith("#"))
    assert(ids.includes(value.slice(1)), `Missing anchor: ${value}`);
  else if (!/^[a-z]+:/i.test(value)) await access(new URL(value, site));
}
for (const match of html.matchAll(/<img\b([^>]+)>/g)) {
  assert(/\balt=/.test(match[1]), "Image missing alt");
  assert(
    /\bwidth=/.test(match[1]) && /\bheight=/.test(match[1]),
    "Image dimensions missing",
  );
}
assert(html.includes("noindex, nofollow"), "Preview must not be indexed");
assert(
  /id="demo-fields"[^>]*disabled/.test(html),
  "No-JS form must be disabled",
);
const app = await readFile(new URL("assets/app.js", site), "utf8");
assert(
  !/\bfetch\s*\(|localStorage\.|sessionStorage\.|sendBeacon\s*\(/.test(app),
  "Preview must not transmit or persist form data",
);
console.log(
  "PASS: care filtering, phone validation, Athens dates, local assets, anchors, images, and demo safeguards.",
);
