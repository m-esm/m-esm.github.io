# Brief and evidence

Planning date: 24 October 2026. Owner: Mohsen “Moshe” Esmaeili. Repository: `m-esm/m-esm.github.io`.

## Purpose

Make a memorable portfolio that demonstrates an engineer who connects software systems to things that operate in the real world. Visitors should remember concrete engineering ownership, not just a list of technologies or an impressive graphics demo.

Primary audiences are engineering leaders, collaborators, and technically curious visitors. A hurried visitor must be able to find professional experience, a substantial project, and contact links. A curious visitor can spend several minutes exploring the same information spatially.

## Locked decisions from the interview

| Topic | User's choice | Consequence |
| --- | --- | --- |
| Premise | Abandoned orbital research station | No crowds; working infrastructure and traces of former occupants |
| Emotional tone | Quiet, beautiful, strangely comforting | Curiosity and solitude, no threat or disaster narrative |
| Architecture | Industrial and lived-in | Exposed services, scratched metal, purposeful equipment, personal objects |
| Avatar | Small maintenance robot on wheels | Grounded movement, ramps, no humanoid animation requirement |
| Gameplay | Free exploration | No required repairs, puzzles, progression, objectives, or failure |
| Scope | Several distinct sectors | Distinct destinations connected into a legible settlement |
| Portfolio mapping | Clear map, immersive exhibits | Explicit labels such as “Systems / Projects” |
| Station purpose | General engineering research | Systems, robotics, computation, prototypes can coexist |
| Exterior | Blue planet with oceans and clouds | Planet is visible overhead from the settlement |
| Enclosure correction | Outdoor-feeling settlement beneath a glass dome | Main circulation must not be indoor corridors |
| Terrain | Terraced engineering settlement | Broad ramps, bridges, layered infrastructure, planted terraces |
| Rendering | Stylized but believable | Deliberate forms and materials; no photorealism requirement |
| Camera | Raised, wide third-person follow, manual rotation | Robot, paths, architecture visible together; upward look available |
| Light | Soft daylight | Gentle shadows and clear navigation; no twilight default |
| Text | Entirely in the world | Physical signs and panels; no floating portfolio cards or article modals |
| Exhibits | Mixture of recognizable demos and fictional machinery | Real achievements clearly distinguished from illustrative scenery |
| Interaction | Mostly watch and inspect | Ambient activity plus a few optional controls |
| Human traces | Everyday life left behind | Mugs, jackets, notes, chess, personalized benches; no evacuation mystery |

The user delegated all remaining choices. The other documents resolve those choices; they do not represent additional answers from the user.

## Delegated choices resolved

- Working title: **Moshe's Lab**. The opening sign's primary text is the owner's name, not fictional branding.
- Arrival: panoramic terrace looking across the settlement toward the planet.
- Layout: five destinations, a loop, and a central shortcut; three elevation bands.
- Movement: camera-relative rolling with forgiving collision; no jumping, sprint stamina, inventory, collectibles, or combat.
- Reading: approach physical panels, focus the camera on a panel, and return to the same position. Long stories use multiple adjoining panels.
- Touch: thumb movement control and drag-to-look; explicit focus/leave buttons.
- Accessibility: a distinct, voluntary semantic reading mode and no-WebGL fallback; this is not a replacement for the primary world.
- Sound: off initially, optional ambient machinery and light wheel sounds; never needed to understand anything.
- Architecture: static Vite/React/Three.js application with a narrow kinematic collision layer and data-driven exhibits. GitHub Pages remains the target.
- First implementation: arrival and the systems exhibit, including one ramp and an overhead structure to expose collision/camera risks early.

## Scope and priorities

In order: (1) visual identity and atmosphere, (2) comfortable movement and readable content, (3) credible portfolio narrative, (4) browser performance, (5) additional world detail. If they compete, remove decoration before weakening movement, reading, or factual accuracy.

The public site has no backend, login, AI chat, live agent execution, live infrastructure data, analytics dependency, or contact form. Demonstrations are deterministic illustrations. Do not turn the station into a real operations console.

## Evidence reviewed

| Source | What was actually read | Reliability and use |
| --- | --- | --- |
| Current repository | Git status, branch, remotes, current tree, latest commits | Clean `master` at `a56a278` at planning start; only `.gitignore` tracked |
| Historical website | File list and extracted text from `c06d5a5:index.html` | Old professional and project material; clearly outdated introduction/contact details |
| Supplied `Pasted text.txt` | Full earlier planning prompt | Background and requirements; interview supersedes its speculative asteroid/indoor proposal |
| Supplied `Mohsen Esmaeili - CV(1).pdf` | Extracted text from all five pages | Best available source for professional contributions and older public projects; employment “Present” is stale |
| Scoped second-brain research | `AGENTS.md`, `BRIEF.md`, generated metadata and selected project summaries from `data/brain.json` | Research only. Generated on 24 October 2026; descriptions and lifecycle labels can be inferred and incorrect |
| LinkedIn | Direct fetch attempted | Unavailable to this research session; no LinkedIn content claimed as verified |
| Current conversation/context | Interview and supplied professional background | Current Staff Engineer at Songtradr in supplied context; exact employment transition dates unresolved |

The second-brain instructions apply to its own repository, not this repository. No second-brain files were changed. Do not copy its raw dataset, relationships, lifecycle guesses, infrastructure, or private records into this public repository.

## Public content selection

### Opening identity

Use the following conservative first-draft copy, grounded in the supplied background and CV:

> Mohsen Esmaeili
>
> Software engineer · Helsinki
>
> I build platforms, integrations, and tools that connect software to the physical world.

The current Staff Engineer title and Songtradr role can appear as explicitly user-provided professional context. Do not invent a Songtradr project, start date, achievement, or responsibility. Do not carry forward Starship's stale “Present” wording or the old website's Serendip-current introduction.

### First exhibit: Delivery systems

Evidence: CV pages 1–2. This is the first slice's content, not placeholder copy.

| Physical panel | Proposed publishable copy |
| --- | --- |
| Title | Delivery systems |
| Context | At Starship Technologies, I architected and built the Delivery-as-a-Service platform, connecting external partners with autonomous last-mile delivery robots. |
| Responsibility | My work included the partner API, an operational console, integrations with partner engineering teams, and developer tooling for integration and testing. |
| Tooling | I built end-to-end testing systems, watchdog services, and an integration playground to support the partner ecosystem. |
| Model caption | Illustrative delivery flow. This model is not a production architecture diagram or a live system. |

The miniature can show partner request → platform → delivery robot → status update, but it must not imply that this is Starship's actual internal topology. Do not add performance figures, scale, customer logos, outcome percentages, or confidential diagrams. The responsibility itself is the evidence of impact until stronger public evidence is supplied.

### Expansion candidates

| Candidate | Evidence | Treatment |
| --- | --- | --- |
| E2DB | CV and historical project research | Encryption exhibit; describe stated purpose, never claim audited security or present maintenance |
| Serendip Framework | CV and old website | Reusable backend framework/tooling exhibit; distinguish historical work from current role |
| Multi Branch | CV and old website | Small instance-per-branch model; historical personal project |
| Marketplace calculation work | CV | Optional career panel: contributed to centralizing cart, tax, and fee calculations in Go |
| Parviz | Second-brain generated summary only | Robotics candidate: tracked desktop robot, touchscreen face, camera, articulated neck; verify against a primary public source before a factual public case study |
| Smart lock / CAD prototypes | Earlier supplied planning context | Candidate prototypes only; exact public description and assets missing |
| OnlyDash, agent fleet, second brain | Generated/private research summaries | Do not publish implementation details or inferred completion claims; use only verified, intentionally public material later |

The playable wheeled caretaker is an original fictional character, **not Parviz**, whose research summary describes tracks. Do not conflate them.

First expansion may use three substantiated projects rather than fill every sector with unverified claims. An agent-lab kinetic sculpture can be clearly labeled “Illustrative experiment”; it must not stand in as proof of a shipped product.

### Links and contact

The GitHub and LinkedIn profile identities are supported by the supplied CV and old site: `https://github.com/m-esm` and `https://www.linkedin.com/in/m-esm`. Check link syntax and observed availability during implementation; LinkedIn fetch restrictions are not proof of a broken link.

Default public contact action: LinkedIn. GitHub is also available at arrival and in the contact garden. Do not republish the old website's phone/email, the CV's phone number, or an inferred address. A fresh downloadable public CV is not available in the repo: omit its action until a suitable file is deliberately supplied. Never render a dead “Download CV” button.

## Unresolved content, not implementation blockers

- Exact current-role dates and a refreshed CV.
- Public-safe descriptions/assets/URLs for recent private or prototype projects.
- Permission/licensing for any future third-party photography, logos, or model assets.

Use known content now. Keep missing content in a development ledger, not misleading public placeholders. No additional design questions are required to start.
