# Architecture and decisions

Status: implementation proposal, not an implemented or benchmarked system. Official documentation consulted on 24 October 2026; links are listed below. Resolve exact compatible package versions at implementation time and commit a lockfile when committing is later authorized.

## Chosen stack

| Concern | Choice | Reason |
| --- | --- | --- |
| Build / language | Vite, TypeScript strict mode, npm | Small static application with a familiar build and no server runtime |
| Application shell | React and React DOM | Semantic controls, content rendering, error/fallback states |
| Rendering | Three.js through React Three Fiber | Scene composition alongside React without a separate engine export/runtime |
| Scene helpers | Selected Drei helpers | Text, asset loading and physical HTML panels; avoid importing unnecessary systems |
| Collision | Rapier through React Three Rapier | Kinematic controller, robust ramps and stacked surfaces; no dynamic vehicle simulation |
| State | Small typed store/reducer plus imperative refs | Discrete navigation/inspection state separate from frame-rate transforms |
| World content | Typed, serializable data modules | Reuse across world panels, static fallback, routes and validation |
| Styling | Plain CSS or CSS modules | Small utility shell; no UI kit/card system |
| Verification | TypeScript, Vitest for logic, Playwright for browser flows | Focus on failure-prone movement, routes, reading and fallback |
| Hosting | GitHub Pages, static `dist/` | No backend requirement |

The consulted stable Fiber installation guidance pairs Fiber 9 with React 19. Use a mutually compatible stable React/Fiber/Drei/Rapier set; verify peer dependencies before installing. Avoid alpha/WebGPU migration as part of this project. WebGL2 is the rendering baseline; unsupported devices receive the semantic view.

### Decision 1: Web-focused 3D rather than an exported game engine

Three.js + Fiber keeps browser semantics, links, loading, and fallback within the same app. Vanilla Three.js is viable but would require manual integration of the same UI/content lifecycle. Godot or Unity would offer broad game tooling we do not need while complicating semantic text and payload management. Revisit only if the project becomes a substantial game with authored levels and behaviors beyond this brief.

### Decision 2: Narrow physics scope

Use one kinematic position-based body with a capsule or rounded simple collider that matches the robot's approximate envelope. Wheels, tool arms, and suspension are visual children, not individual rigid bodies. Static simplified colliders cover decks, ramps, walls, rails and major equipment. Keep decorative cables, leaves, glass, and background models out of the physics world.

Use Rapier's character-controller shape queries to calculate allowed translation before applying the next kinematic position. Simply setting a kinematic target does not itself provide desired move-and-slide behavior. Add gravity/ground following and modest ground snap explicitly; slope limit roughly 20 degrees for a world whose authored ramps target under 10 degrees. No automatic stair climbing is necessary. Tune collision offset to avoid visible hovering.

Run movement/collision on a fixed timestep (initially 1/60 s), cap catch-up steps after stalls, and interpolate visuals. Camera and character animation use time-based damping. Free visual rotation must not rotate the movement collider into snagging corners. Test ground detection on both sides of a ramp seam and above/below a bridge.

A heightmap-only controller was rejected because the same horizontal coordinates can contain stacked walkable surfaces. Full dynamic wheel physics was rejected because it introduces tipping, friction tuning, and unreliable navigation without serving the portfolio.

Use static ramps in v1. Moving lifts would require explicit platform support and tests; they are deferred. Rapier WASM must be served from the app's own asset bundle, loaded with clear error handling, and counted in the critical download budget.

### Decision 3: Two text rendering techniques, one physical design

- Short architectural labels: SDF text using Drei Text, aligned to a real sign surface. Self-host the font, preload required glyphs, and verify any worker/font dependency loads locally.
- Reading boards and real links: Drei `Html transform`, aligned flush with a modeled plaque or inset display. Its implementation is DOM, but its presentation remains a physical world object. Use perspective, back-face checks, explicit visibility, and selected occluders. Do not use the fullscreen mode or camera-facing floating cards.
- Canvas-texture text is acceptable for decorative identifiers but not essential reading: it complicates selection, link semantics and high-resolution rendering.

Prove transformed HTML early on desktop and portrait mobile. Inspect blur, depth sorting, z-index, pointer interception, and occlusion in real browsers. Use a bounded set of nearby boards, with a maximum active set defined in the budget. Don't raycast every panel against every leaf every frame. Avoid placing the backing plaque itself in a way that permanently occludes its own text; offset the panel slightly and use curated occluders.

The main sign owns a world transform, dimensions, content ID, safe reading pose and optional portrait variant. Screen-reader state follows app state rather than CSS visibility alone. If a text projection approach fails the acceptance test, fix its rendering strategy while retaining a physical board; do not silently replace it with a modal.

### Decision 4: Single connected world, reusable sector groups

One Canvas and one physics world. Define each sector as a scene group with transform, bounds, spawn anchor, content IDs and asset list. Avoid one renderer per room or unloading colliders while the robot can reach them. Initial critical bundle contains arrival, systems slice, robot, ground/collision, dome silhouette, planet and fonts. Load detail props and distant sector assets later.

Use `Suspense`/explicit loading state for assets but keep the accessible reading view independent of the 3D loader. Render broad silhouettes before secondary detail. Shared geometries/materials and instancing handle rails, repeated windows, plants and pipe fittings. Pause costly animations in distant or invisible sectors.

### Decision 5: Deterministic exhibits

Delivery robots, signal pulses and mechanical loops are local authored animations with no network calls. A seed and fixed review pose allow reproducible screenshots. Give all simulated diagrams a visible illustrative caption. A small pause/resume control may be physically mounted on the model; it is optional and never unlocks information.

No real company APIs, AI inference, API keys, backend data connectors, or live project metrics. Revisit only after a specific public requirement and appropriate hosting are agreed.

### Decision 6: Routes and semantic output are core architecture

Use a small validated hash parser, not a complex routing dependency. Separate route intent from scene readiness: load the requested destination, place the robot safely, then enter inspection. Back/Forward applies state without pushing additional entries. Invalid content IDs map to a useful default.

Generate a static semantic reading document from the same serializable content at build time. It must exist in the delivered HTML before JavaScript, with a readable link on the loading shell. Options such as `reading.html#delivery-systems` are fine for the actual static document while the app uses `/#/read/delivery-systems` as its in-app state. Keep anchors and content consistent. Test JavaScript disabled and WebGL failure separately.

Do not render the world and reading view simultaneously as competing accessible interfaces. The world can reuse actual DOM board semantics, but inactive board content must be inert and absent from the tab order. SEO metadata and social descriptions use verified professional information.

## Suggested module boundaries

| Location | Responsibility |
| --- | --- |
| `src/app/` | App entry, route/state handling, loading, error boundary, preferences |
| `src/content/` | Profile, project, career, source and publication data; no JSX/Three imports |
| `src/world/` | World composition, layout constants, sector definitions, environment |
| `src/world/sectors/` | Arrival, systems, robotics, agents, career groups |
| `src/player/` | Input mapping, kinematic movement, visual robot, follow/inspect camera |
| `src/interaction/` | Eligible panel selection, line of sight, focus transitions |
| `src/signage/` | Physical sign mesh, SDF label, transformed DOM board, read poses |
| `src/exhibits/` | Delivery model and later demonstrations |
| `src/ui/` | Small utility controls, touch controls, semantic reading view |
| `src/assets/` or `public/assets/` | Models, fonts, textures and attribution; one consistent asset strategy |
| `scripts/` | Static content generation and asset budget reporting |
| `tests/` | Route/state logic and browser scenarios |

Keep components focused. Do not put the world, controller, content and all UI into a single large `App.tsx`. Avoid building an engine framework, ECS, editor or plugin system for five sectors.

Continuous position, velocity, camera smoothing and animation values belong in refs or the physics/render loop; do not trigger a React render every frame. Discrete mode, selected exhibit and preferences are app state. One authority owns camera pose at any time.

## Content contract

Implement an equivalent validated schema; exact identifiers may evolve, but preserve these separations:

```ts
type Publication = 'public' | 'draft';
type EvidenceKind = 'cv' | 'public-source' | 'owner-context';

interface PortfolioExhibit {
  id: string;
  title: string;
  category: 'professional' | 'personal' | 'illustration';
  publication: Publication;
  summary: string;
  panels: Array<{ id: string; heading: string; body: string }>;
  links: Array<{ label: string; href: string }>;
  evidence: Array<{ kind: EvidenceKind; reference: string }>;
  // Display a date only when sourced; never infer completion from an animation.
  period?: { label: string; source: string };
}

interface ExhibitPlacement {
  exhibitId: string;
  sectorId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  panels: Array<{
    panelId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    size: [number, number];
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
  }>;
  spawnAnchorId: string;
}
```

Keep content references public-safe: a private absolute filesystem path or raw private summary must never be shipped in a public bundle. A development evidence ledger can hold sanitized references such as “supplied CV, pp. 1–2.” Do not import the second-brain dataset at build or runtime.

Validate unique IDs, placement-to-content references, complete panel mapping, supported link protocols, and public-only inclusion at build time. Exclude draft records from generated HTML **and bundles**, not merely via conditional rendering. Render plain text or a narrowly controlled structure; do not inject unsanitized HTML from source material.

## Asset production

Start with an authored modular kit made in code: beveled platform edges, separate panel layers, repeated fasteners only where visible, pipes with fittings, rubber tires, plant silhouettes, and meaningful machine proportions. Code-generated geometry is acceptable as finished art when deliberately modeled; default primitives scattered around a plane are not.

Prefer a small coherent kit over mixed unrelated marketplace assets. If adding Blender/glTF assets later, standardize meters, +Y up, pivots, transform application, material palette, naming and collision proxies. Record source URL, author, license, changes, and attribution in an asset ledger. Use only assets that can be distributed publicly; no purchases required to complete the slice.

Serve assets locally. Favor 512–1024 px textures, selective 2K hero assets, shared material atlases where useful. Introduce mesh/texture compression only when measured savings justify decoder payload and compatibility. Avoid remote HDRIs, runtime font CDNs, fragile hotlinks, and giant background videos.

Do not use generated imagery for exact diagrams or readable sign text. Optional concept art is a reference, not a substitute for a playable scene. A low-cost procedural planet is acceptable only if it passes the art criteria; otherwise use a properly licensed locally served texture.

## Deployment and development

Repository was on `master` when inspected, with remote `git@github.com:m-esm/m-esm.github.io.git`. Recheck before configuring workflows; do not assume `main`. This is a user-root Pages site, so Vite's base is `/`, not `/m-esm.github.io/`.

Prepare a GitHub Actions workflow to install from the npm lockfile, run required checks, build static output, and publish `dist` through Pages artifacts. Check current official action versions when implementing. A manual deployment trigger is sufficient initially. Actual pushes, Pages-setting changes, and deployment remain separate from local implementation and are not authorized by this handoff.

Select a supported Node LTS compatible with the installed Vite release and pin the major in project tooling. Document scripts for `dev`, `typecheck`, `test`, `test:e2e`, `build`, and `preview`. Test the production preview, not just the dev server. No service worker initially; avoid stale asset-cache complexity.

## Official references

- [React Three Fiber installation and version pairing](https://r3f.docs.pmnd.rs/getting-started/installation)
- [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Drei Html: transform and occlusion behavior](https://drei.docs.pmnd.rs/misc/html)
- [React Three Rapier repository and usage](https://github.com/pmndrs/react-three-rapier)
- [Rapier documentation](https://rapier.rs/docs/)
- [React Three Rapier PhysicsProps](https://pmndrs.github.io/react-three-rapier/interfaces/PhysicsProps.html)
- [Vite static deployment and GitHub Pages base paths](https://vite.dev/guide/static-deploy)

These sources establish supported capabilities and integration constraints, not performance results for this project. Exact controller APIs and dependency versions must be verified against the installed release during implementation.
