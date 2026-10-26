# Implementation plan and acceptance

## Build strategy

Prove the atmosphere, movement and physical reading system in one polished area, then expand using the same kit. Do not spend the first implementation session constructing five empty sectors. The first slice is a real deliverable and the foundation of the final portfolio.

No measured performance, browser validation, implemented features, or passed tests are claimed by this document.

## First playable slice

Approximately 30 × 28 m: arrival terrace at +3 m, a broad 18 m-or-longer ramp descending to the systems yard, a short return path, and one overhead structure with at least 4.5 m clear space. The rest of the settlement is represented by coherent distant silhouettes, not walkable unfinished rooms. Railings/planters naturally bound the slice; do not advertise dead destination links.

Required elements:

1. Full opening composition: wheeled robot, dome ribs, planet overhead, soft daylight, layered buildings, greenery and worn industrial surfaces.
2. Working camera-relative movement, collision, a traversable ramp, camera obstruction handling, reset and touch input.
3. A physical identity sign and physical directory. Show functional destinations only; future sectors are scenery, not broken controls.
4. The **Delivery systems** exhibit using the copy in `brief.md`: a tabletop route with moving miniature delivery robot, partner/platform/status objects, restrained signal motion, and an explicit illustrative caption.
5. Three or four readable physical boards for the project, including a real GitHub or LinkedIn link. One longer story split across boards proves that the world can carry meaningful prose.
6. Stable inspection camera, return to exploration, keyboard focus handling, portrait reading layout and reduced motion.
7. Direct exhibit hash link, Back/Forward, static semantic reading output, and working fallback for failed rendering.
8. At least one finished lived-in vignette: workbench, mug, jacket, tool tray and plants. No need for bespoke animated NPCs.

An optional pause/resume switch on the delivery model is the slice's small interaction. Information never depends on activating it. The superseded planning prompt's “interactive terminal” is satisfied by the inspectable physical exhibit/link board; it is not a reason to add a screen modal against the interview decision.

## Ordered work

### Phase 0 — Foundation and content

- Read the complete doc set and inspect the current worktree/instructions.
- Resolve compatible stable dependencies, scaffold TypeScript/Vite/React, add scripts and a lockfile.
- Create typed public content for identity and the delivery exhibit, with source references and no fabricated claims.
- Generate the static semantic reading document early, so content and links can be tested independently of graphics.
- Keep the README accurate about what now runs.

Exit: clean typecheck/build; static content usable without WebGL. This is infrastructure, not completion of the slice.

### Phase 1 — Composition and traversal blockout

- Author arrival/platform/ramp/bridge geometry, safe anchors and simplified collision shapes.
- Implement wheeled caretaker, input, fixed-step movement and wide third-person camera.
- Add dome and planet in their final compositional relationship; frame the opening view now.
- Test ramp seams, rails, corners, camera passage under the overhead structure and recovery.

Exit: robot reaches every slice destination without clipping or getting stuck. Planet is visible overhead from default spawn. Do not decorate a flawed layout.

### Phase 2 — Physical reading and real exhibit

- Build physical sign components with SDF labels and transformed DOM boards.
- Use actual identity and delivery copy immediately, including long paragraphs and links.
- Implement focus/leave states, neighboring-board actions, portrait poses, keyboard semantics and touch behavior.
- Add hash-route hydration, Back/Forward and accessible mode transitions.
- Build and animate the illustrative delivery model, with optional physical pause switch.

Exit: the full exhibit can be understood, navigated and linked without a floating text modal or unreadably small text.

### Phase 3 — Finished art and slice verification

- Replace blockout forms with the consistent modular art kit; refine robot, plants, railing profiles, props and machinery.
- Tune daylight, contact shading, material contrast, dome transparency and planet detail.
- Complete graceful loading/failure states, quality settings, reduced motion and hidden-tab behavior.
- Run the checks below against a production build; capture and inspect screenshots.
- Correct the largest visual/readability defects before adding more features.
- Record actual results and limits in `docs/implementation-status.md`.

Exit: all first-slice acceptance gates pass or unresolved limitations are specifically documented. This is the intended first implementation handoff endpoint; do not call it the full finished station.

### Phase 4 — Expand the settlement

After the slice passes, extend the loop and courtyard with three additional sector groups using the same components. Use substantiated older projects where recent project descriptions are unavailable. Build the career garden with sourced history and public profile links. Populate the robotics/agent areas with verified content or transparently illustrative objects; omit unverified public case studies.

Every new sector must meet the same route, collision, physical-text and accessibility checks. Add the map destinations only when they work. Maintain open dome-facing circulation; no corridor maze. Optional lifts and sound remain lower priority than complete content and performance.

### Phase 5 — Release readiness

Check all public copy and links, asset attribution, final full-world budgets, root-path deployment assumptions, no-JavaScript output, social metadata and production build. Prepare deployment workflow and instructions. Report readiness; do not push or publish without an instruction authorizing it.

## Targets to measure

These are initial engineering budgets, not promises. Measure the first slice and again after sector expansion. Record device, browser, viewport, DPR, build mode, cold/warm cache and test route with every result.

| Metric | Desktop target | Mobile / low tier target |
| --- | --- | --- |
| First controllable scene | ≤5 s cold load at 20 Mbps, 80 ms RTT | ≤8 s cold load at 10 Mbps, 100 ms RTT on an actual representative phone |
| Critical compressed transfer | ≤6 MiB including JS, WASM, fonts and first scene | ≤4 MiB via lower-resolution assets and deferred detail |
| Total initial full-world asset transfer | ≤18 MiB, lazy secondary assets | ≤12 MiB; never fetch desktop-only assets automatically |
| Sustained frame rate after warmup | 60 fps target; p95 frame interval ≤20 ms on M1 Pro class hardware | 30 fps target; p95 ≤40 ms on measured phone |
| Visible triangles | ≤250k starting budget | ≤100k |
| Typical draw calls | ≤180 | ≤100 |
| Textures | Mostly ≤1K, selective 2K | Mostly ≤512 px, selective 1K |
| Decoded texture estimate | ≤128 MiB | ≤64 MiB |
| Active transformed DOM boards | ≤8 near/visible, usually 1 in focused reading | ≤4 near/visible, 1 in focused reading |
| Device pixel ratio cap | 1.5 initially, lower if necessary | 1.0 initially |
| Shadow maps | One limited 1024–2048 map | 512–1024 or simple contact treatment |

“Decoded texture estimate” is not a claim about total GPU/JS memory. Account for mipmaps and report methodology. If the environment lacks reliable GPU timing/memory APIs, report frame intervals, geometry/draw counters and texture estimates separately. Do not invent GPU measurements.

The 4 MiB mobile transfer budget is intentionally demanding for 3D + WASM. Measure first. If it cannot be achieved without hurting the approved experience, document the dominant bytes and an evidence-based revision rather than silently missing it or replacing the scene with a flat page.

Low quality removes plant density, background props, dome reflections, secondary particles and shadow resolution first. It retains the planet, major dome ribs, robot silhouette, wayfinding, all content and physical reading. Dynamic quality must not oscillate visibly; select conservatively and change after a sustained threshold. Touch viewport emulation is not mobile GPU performance evidence.

## Observable acceptance checklist

### Design and content

- [ ] Opening screenshot visibly contains robot, terraced settlement, glass-dome structure and a large blue planet above buildings.
- [ ] The scene is bright, open and industrial; most primary traversal is outdoors under the dome.
- [ ] At least one scene is art-finished beyond default primitive blockout.
- [ ] Owner identity, delivery-platform responsibility and public contact links are correct and easy to locate.
- [ ] No invented professional results, unfinished-project success claims, private data or dead CV action.
- [ ] Portfolio prose stays on physical objects in world mode. Only utilities use screen overlays.

### Traversal and camera

- [ ] Keyboard and touch can reach each slice sign via the ramp and return to arrival.
- [ ] Diagonal movement is normalized; motion is comparable at 30/60/120 fps.
- [ ] Robot cannot pass through rails, fall through ramp seams or collide with decorative leaves.
- [ ] Camera passes the bridge and corners without penetrating walls or losing the robot.
- [ ] Orbit does not unexpectedly snap back; recenter works; horizon remains stable.
- [ ] Blur/visibility changes clear movement so the robot does not keep driving after a tab switch.
- [ ] Out-of-bounds/reset always places the robot on a known safe anchor.

### Reading and navigation

- [ ] Focused physical body text is readable at 1440×900 and 390×844; portrait does not shrink text to fit.
- [ ] Focused boards are steady, unobstructed, high-contrast and offer a visible exit.
- [ ] A complete case study can be read across physical boards with keyboard and touch.
- [ ] Links are real anchors, selectable/focusable, and do not trigger world input.
- [ ] Inactive or occluded boards cannot steal pointer or keyboard focus.
- [ ] Direct exhibit routes work on fresh load; Back/Forward and invalid IDs behave predictably.

### Accessibility and robustness

- [ ] Semantic reading mode contains equivalent public content and links.
- [ ] Static reading content works with JavaScript disabled.
- [ ] Simulated WebGL failure, failed essential assets and context loss offer a usable fallback.
- [ ] Reduced motion disables decorative loops and animated travel/reading transitions.
- [ ] No unwanted audio before explicit activation.
- [ ] No keyboard focus trap or duplicated active content; controls have accessible names.
- [ ] Production preview has no unexpected console errors, missing assets or external runtime dependencies.

### Evidence

- [ ] Required build/typecheck/tests pass, with commands recorded.
- [ ] Screenshots of arrival, normal traversal, focused project board, portrait reading and fallback were visually inspected.
- [ ] At least a 60-second traversal/read benchmark was measured after warmup; cold-load transfer tested separately.
- [ ] The status note distinguishes real hardware tests from emulation and lists any untested browser/device.

## Useful tests

Unit tests should target actual failure-prone logic: hash parsing and unknown IDs; state transitions and focus restoration; normalized movement intent; input clearing; content references and publication filtering. Avoid tests that merely restate constant values or assert every decorative mesh exists.

Browser tests should exercise load → move → inspect → follow panel link/exit, deep-link cold load, browser history, keyboard-only controls, portrait touch, reduced motion, and failed-WebGL/static content. Inspect projected DOM bounds plus screenshots; passing DOM assertions alone does not prove 3D readability or occlusion.

Run Chromium and WebKit where supported, then manually test actual Safari/Chrome if accessible. Record any unavailable browser rather than claiming coverage. Headless/software-rendered screenshots are useful for layout but not representative GPU performance measurements.

## Principal risks and responses

| Risk | Early proof | Response if it fails |
| --- | --- | --- |
| Inconsistent or generic 3D art | Finished arrival shot before expansion | Reduce prop variety, refine silhouettes/materials, keep one coherent kit |
| Dome looks indoor or blocks the planet | Opening/default camera review | Lower glass opacity, thin ribs, open building footprints, reposition sky object |
| Physical text is hard to read | Real copy in desktop and portrait boards | Edit/split copy, adjust physical layouts and camera poses; never hide the problem behind a modal |
| Camera discomfort | Ramp/bridge/corner traversal test | Tune collision volume, clearance, damping and orbit rules before more world work |
| Heavy bundle / GPU load | Early production build and measured traversal | Reduce geometry/material count, defer detail, lower DPR/shadows, remove expensive transparency |
| Weak project story | Read static content before making exhibits | Use ownership-based CV copy; omit speculative achievements |
| Scope becomes a game | Check each feature against free exploration | Remove mandatory tasks, live agents, NPC systems, inventories and progression |
| Private research leaks into public assets | Build-time public-content validation | Ship curated records only; never import raw research datasets |
