import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
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
for (const page of (await readdir(site)).filter((file) =>
  file.endsWith(".html"),
)) {
  const source = new URL(page, site);
  const content = await readFile(source, "utf8");
  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${page}`);
  for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll("&amp;", "&");
    if (/^[a-z]+:/i.test(value)) continue;
    const target = new URL(value, source);
    await access(target);
    if (target.hash) {
      const targetHtml = await readFile(target, "utf8");
      assert(
        targetHtml.includes(`id="${target.hash.slice(1)}"`),
        `Missing anchor ${page} -> ${value}`,
      );
    }
  }
  for (const match of content.matchAll(/<img\b([^>]+)>/g)) {
    assert(/\balt=/.test(match[1]), `Image missing alt in ${page}`);
    assert(
      /\bwidth=/.test(match[1]) && /\bheight=/.test(match[1]),
      `Image dimensions missing in ${page}`,
    );
  }
  assert(
    content.includes("noindex, nofollow"),
    `Preview must not be indexed: ${page}`,
  );
}
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
