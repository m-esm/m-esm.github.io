import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
async function walk(dir) {
  let out = [];
  for (const f of await readdir(dir)) {
    const path = `${dir}/${f}`;
    if ((await stat(path)).isDirectory()) out.push(...(await walk(path)));
    else {
      const body = await readFile(path);
      out.push({ file: path, bytes: body.length, gzip: gzipSync(body).length });
    }
  }
  return out;
}
const files = await walk("dist");
const result = {
  files,
  totalBytes: files.reduce((s, x) => s + x.bytes, 0),
  totalGzipBytes: files.reduce((s, x) => s + x.gzip, 0),
};
await writeFile("docs/validation/bundle.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

// Counting every delivered file is a conservative bound on initial transfer.
if (result.totalGzipBytes > 4 * 1024 * 1024)
  throw new Error(
    "Compressed static output exceeds the 4 MiB initial mobile budget",
  );
