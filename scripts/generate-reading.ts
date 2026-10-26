import { writeFileSync } from "node:fs";
import { profile, exhibits, validateContent } from "../src/content/portfolio";
validateContent();
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const content = `<header><p>Moshe's Lab</p><h1>${esc(profile.name)}</h1><p>${esc(profile.role)}</p><p>${esc(profile.introduction)}</p></header><nav aria-label="Portfolio sections">${exhibits.map((e) => `<a href="#${e.id}">${esc(e.title)}</a>`).join(" ")}</nav><main>${exhibits.map((e) => `<section id="${e.id}"><h2>${esc(e.title)}</h2>${e.panels.map((p) => `<section id="${p.id}"><h3>${esc(p.heading)}</h3><p>${esc(p.body)}</p></section>`).join("")}${e.caption ? `<p class="caption">${esc(e.caption)}</p>` : ""}<a href="/#/exhibit/${e.id}">Visit ${esc(e.title)} in the station</a></section>`).join("")}<nav aria-label="Public profiles">${profile.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join(" ")}</nav></main>`;
const css = `@font-face{font-family:Plex;src:url('/assets/plex-sans.woff2')}*{box-sizing:border-box}body{font:20px/1.65 Plex,system-ui,sans-serif;color:#263b43;background:#e4e9e3;margin:0}article{max-width:760px;margin:auto;padding:44px 26px 80px}h1{font-size:clamp(32px,6vw,54px);line-height:1.12}h2{margin-top:64px}h3{margin-top:36px}a{color:#215875;text-underline-offset:5px;display:inline-block;padding:10px;margin-right:22px}a:focus-visible{outline:3px solid #215875;outline-offset:4px}.caption{font-size:16px;border-left:3px solid #617c57;padding-left:18px}`;
writeFileSync(
  "public/reading.html",
  `<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Mohsen Esmaeili, software engineer in Helsinki. Platforms, integrations, and delivery systems."><title>Mohsen Esmaeili · Portfolio</title><style>${css}</style><article><a href="/#/exhibit/delivery-systems">Explore station</a>${content}</article></html>`,
);
writeFileSync(
  "index.html",
  `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#cddbd9"><meta property="og:title" content="Mohsen Esmaeili · Moshe's Lab"><meta property="og:type" content="website"><meta property="og:description" content="Platforms, integrations and tools connecting software to the physical world. Explore an orbital engineering settlement."><meta name="description" content="Mohsen Esmaeili, software engineer in Helsinki. Explore platforms and delivery systems in an orbital engineering settlement."><link rel="icon" href="/favicon.svg"><title>Mohsen Esmaeili · Moshe's Lab</title></head><body><div id="root"><article style="max-width:720px;margin:40px auto;font:20px/1.6 system-ui;padding:24px"><a href="/reading.html">Read portfolio</a>${content}<p>Preparing the station. The reading view is available immediately.</p></article></div><script type="module" src="/src/main.tsx"></script></body></html>`,
);
