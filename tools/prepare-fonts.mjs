import { mkdir, writeFile } from "node:fs/promises";
const destination = new URL("../site/assets/fonts/", import.meta.url);
await mkdir(destination, { recursive: true });
const url =
  "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800;900&family=GFS+Neohellenic:ital@1&display=swap";
const response = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36",
  },
});
if (!response.ok) throw new Error(`Font CSS: ${response.status}`);
const css = await response.text();
const blocks = css.match(/\/\*[^*]+\*\/\s*@font-face\s*\{[^}]+\}/g) || [];
const kept = blocks.filter((block) =>
  /\/\* (?:greek|greek-ext|latin|latin-ext) \*\//.test(block),
);
if (!kept.length) throw new Error("No Greek or Latin font faces found");
const downloaded = new Map();
let output =
  "/* Google Fonts, self-hosted. See OFL licenses in this directory. */\n";
for (const block of kept) {
  const remote = block.match(/url\(([^)]+)\)/)[1];
  let filename = downloaded.get(remote);
  if (!filename) {
    filename = `font-${downloaded.size + 1}.woff2`;
    const font = await fetch(remote);
    if (!font.ok) throw new Error(`Font file: ${font.status}`);
    await writeFile(
      new URL(filename, destination),
      Buffer.from(await font.arrayBuffer()),
    );
    downloaded.set(remote, filename);
  }
  output += block.replace(remote, `./${filename}`) + "\n";
}
await writeFile(new URL("fonts.css", destination), output);
for (const family of ["notosans", "gfsneohellenic"]) {
  const license = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,
  );
  if (!license.ok) throw new Error(`License: ${family} ${license.status}`);
  await writeFile(
    new URL(`${family}-OFL.txt`, destination),
    await license.text(),
  );
}
console.log(`Saved ${downloaded.size} font files and both licenses.`);
