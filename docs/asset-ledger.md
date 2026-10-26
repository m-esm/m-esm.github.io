# Asset ledger

- **Scene, robot, props, delivery model, workshop mechanism, routing sculpture, expanded terraces, garden, dome and planet:** original authored geometry and procedural texture code in `src/`. No purchased models, photography, logos, HDRIs or generated image dependencies.
- **IBM Plex Sans and IBM Plex Mono:** IBM; SIL Open Font License 1.1. Acquired from `@fontsource/ibm-plex-sans@5.3.0` and `@fontsource/ibm-plex-mono@5.3.0`. Locally served Latin subsets; no font CDN. License: `public/assets/IBM-Plex-LICENSE.txt`. WOFF is for Troika's SDF parser; WOFF2 is for DOM text.
- **Rapier WASM:** bundled by `@dimforge/rapier3d-compat@0.19.2` through React Three Rapier. Apache-2.0; embedded in the local world chunk, with no remote runtime fetch.
- **Portfolio content:** curated from the owner-supplied CV, historical project context and owner-provided role recorded in `docs/brief.md`, and approved identity copy in `docs/brief.md`. Fictional scenery is not professional evidence. Public content lives in `src/content/portfolio.ts`.

Dependency licenses remain available in installed packages. Keep this ledger and font license when distributing the static build. No private research dataset was imported.

## Featured engineering assets — 26 October 2026

- `public/assets/projects/parviz-assembly.glb`: source CAD from `m-esm/Parviz`, `main/web/assembly.glb`, downloaded 26 October 2026. Source geometry unchanged. Renderer groups meshes for draw efficiency and exploded presentation; source vertex colors retained. Loaded only near the workshop.
- `parviz-cad.jpg`: original source CAD hero render from that repository. Not a photograph.
- Parviz Apache-2.0 license, NOTICE and third-party notices retained under `public/assets/licenses/`; public `project-credits.html` links attribution, original sources and applicable reference-mesh terms.
- `mechlib-gallery.png`: original `m-esm/mechlib` gallery screenshot, MIT license retained.
- Architecture, paving textures, gear demonstration and agent routing model are original locally generated scene assets. Font licensing unchanged.
