# Moshe's orbital research station

A playable third-person portfolio for Mohsen “Moshe” Esmaeili. Drive a wheeled maintenance robot through an open terraced engineering settlement beneath a glass dome, with a blue ocean planet overhead. Portfolio content lives on physical signs.

The original phases 0–3 slice is now extended into a connected five-destination settlement: **Arrival**, **Delivery systems**, **Robotics workshop**, **Agent lab**, and **Career and contact**. Four additional ramps connect the 0 / 3 / 6 m terraces, with a courtyard shortcut. The featured exhibits cover Starship Delivery-as-a-Service, Parviz, Mechlib and smart-subagents, grounded in the CV, public LinkedIn and source repositories. Recent private projects are not published.

The five-destination station now has a full surface, foliage, machinery and robot art pass. Its dark orbital exterior includes stars, a finite pressure hull, exposed trusses, solar wings and thermal radiators. Daylight remains soft and bright inside the glass dome.

## Run locally

Use Node **22.12 or later** (Node 22 is pinned in `.nvmrc`).

```sh
npm ci
npm run dev
```

Development: `http://127.0.0.1:5173`. Keep this tab open: Vite refreshes it as source changes are saved. To run the production build:

```sh
npm run build
npm run preview -- --port 4173
```

Production preview: `http://127.0.0.1:4173`. Static reading view: `/reading.html`. Direct exhibit: `/#/exhibit/delivery-systems`. Root hosting uses Vite base `/`.

## Controls

- **WASD / arrows:** drive relative to the camera. **Drag:** look around.
- **Q / E:** orbit; **E near a sign:** inspect. **Page Up / Page Down:** tilt. **R:** recenter.
- Click or tap a physical sign to inspect. Use its **Next board / Previous board** controls to read the story; **Escape / Leave sign** returns to the robot.
- Portrait/touch layouts have a movement thumb control. Drag the remaining view to look.
- **Station controls** contains safe transfers to every destination, named camera buttons, quality, reduced motion, and exhibit-model pause. **Read portfolio** opens a separate semantic reading document.

No mandatory tasks, sound, account, backend, contact form, or runtime CDN. Public profile links are on the arrival and final project boards. No CV download is advertised.

## Current visual release

The 26 October artwork includes dark orbital space, stars, solar wings, differentiated rubber/enamel/metal, and local reflection lighting. The ocean planet has sheared cloud fronts, a day/night terminator, cloud shading and ocean glint. Habitat modules have recessed glazing, pressure doors, panel joints and roof services. Physical bevels and a bolted, braced garden pergola complete the construction pass. All assets remain local and distributable.

`npm run build` runs the strict TypeScript check, regenerates the static reading document, and creates the production bundle. Test suites, accessibility audits and performance benchmarks were deliberately not rerun for this art pass. Older results in `docs/validation` describe earlier builds.

## Deployment

`.github/workflows/pages.yml` builds and publishes to **https://m-esm.github.io/** on pushes to `master`, with an optional manual trigger. The repository Pages source is configured to **GitHub Actions**. Deployment uses the official Pages artifact and OIDC workflow, without browser test suites or budget checks.

The first SSH push reached GitHub as `11ed538`. Its Linux build failed because the lockfile omitted Rollup's Linux native package; the pinned package and official integrity were added in `7972b9e`, and that workflow succeeded. Earlier visual changes were published through the signed-in GitHub editor; current releases use SSH from an isolated checkout. The complete visual build at `21f2229` has deployed successfully and was visually confirmed at https://m-esm.github.io/. See [implementation status](docs/implementation-status.md) for the observed deployment.

For future SSH releases, run `npm run deploy:github`. It builds, fetches the SSH origin, commits the project files, merges remote history without rewriting it, rebuilds after a merge, and pushes `master`. Existing staged work or merge conflicts stop the release for review. The original checkout has read-only Git metadata. Current releases preserve its working files and publish from a separate checkout of remote master over SSH.

## Design documents

1. [Brief and evidence](docs/brief.md)
2. [World and art direction](docs/world-concept.md)
3. [Experience design](docs/experience-design.md)
4. [Architecture](docs/architecture.md)
5. [Build plan and acceptance](docs/implementation-plan.md)
6. [Implementation handoff](docs/implementation-handoff.md)

The interview decisions remain authoritative: **open settlement under glass, soft daylight, wheeled robot, free exploration, physical portfolio text**. A separate static reading view supplies equivalent content without JavaScript or WebGL. Asset provenance is in [the asset ledger](docs/asset-ledger.md).


## Editorial portfolio upgrade

The reading document now presents a full delivery-platform case study, a conceptual flow diagram, historical project profiles, and a direct contact section. The playable station has a dismissible introduction and a diagrammatic destination map. All prose derives from the existing approved brief; no new metrics or private project claims were added. Run `npm run build` to regenerate the reading document after editorial changes. This upgrade was pushed over SSH as `8307e77`; its Pages build and deployment succeeded, and the public reading page was verified.

## Featured-work and 3D release

The workshop now contains the actual Parviz CAD assembly with click-to-explode presentation, streamed from a local asset when approached. Its lighter loading/error model is original; the full model retains source geometry and credits. A working software spike and an unassembled mechanical CAD design are described separately. Mechlib has a mechanical demonstration and a direct gallery link. Smart subagents replaces the generic agent story with a concrete quota/worktree/verification exhibit.

A new fabrication roof, structural bracing, computing pavilion, regional paving, deck-panel construction, courtyard basin, task lighting and better arrival views give the five districts stronger visual identity. The reading page adds source CAD imagery, named integration work, a short attributed LinkedIn recommendation and earlier platform experience. See [content evidence](docs/content-evidence-2026-10-26.md) and [asset credits](public/assets/licenses/project-credits.html).

The featured-work release was pushed over SSH as `85a183e`. [Pages run 40390948872](https://github.com/m-esm/m-esm.github.io/actions/runs/40390948872) succeeded, and both the public workshop and reading page were visually confirmed. Production build passed; test suites, audits and benchmarks were skipped as requested.

## Habitat expansion

The station now includes a kinetic orbital sculpture west of arrival (click to pause/resume), a service docking hall behind arrival, and a glazed hydroponics wing beside the garden. These original environmental additions extend the settlement around its five portfolio destinations. The dock and nursery are scenery beyond the safety rails.

## Reading page and rendering finish

The generated `reading.html` is a Vite entry with static portfolio prose and progressively enhanced, inline 3D delivery/agent diagrams. `npm run build` regenerates it from the content and CSS sources. The page includes a dated chronology and two attributed LinkedIn recommendation excerpts. Public-project year labels denote repository creation, while the approximate DaaS transition is identified explicitly. The world adds ambient contact shading and antialiasing in standard quality mode; low quality retains direct rendering.

The career chronology now branches between professional and independent work, with dated project cards, source links, original explanatory glyphs and credited Parviz/Mechlib images.
