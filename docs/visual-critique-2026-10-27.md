# Visual critique and fixes — 27 October 2026

This review starts from the deployed `7e241c6` build. The previous pass improved structure, but several parts still look like isolated demos: the hero's oversized plinth, barely visible metadata, an unrelated photograph competing with the work, generic project diagrams and a timeline with hidden history. The fix is to finish the existing design, not change its palette again.

Keep the marine background (#101d28), steel surfaces (#233b49), slate text (#b8cbd1), off-white (#edf2ef), copper (#d2a585) and muted green (#abc4b6). IBM Plex remains the reading face. Stronger 13–16 px supporting text, distinct page/section/project hierarchy, compact left-aligned layouts. The signature remains the robot and record player; all other graphics explain actual work. No arbitrary counters or invented product screens.

| Component | Visual criticism | Fix / improvement | State |
| --- | --- | --- | --- |
| Header / identity | Thin mark and small two-line name disappear; current section is a faint underline. | Stronger signature, clearer selected link and an explicit menu surface on phones. | Implemented |
| Hero typography | Intro, role and links form several disconnected bands. | Tighten vertical rhythm, simplify the secondary name line and group actions. | Implemented |
| Hero 3D composition | Large dark slab outweighs the robot and record; empty corners look like a model viewer. | Replace the slab with fitted instrument platforms, enlarge subjects and refine camera framing. | Implemented |
| Robot | Smooth body and featureless wheels read as a toy. | Add restrained panel seams, sensor surround, wheel treads/hardware and believable lid interior. | Implemented |
| Record player / motion controls | Generic equalizer bars and tiny controls; the active state is weak. | Improve record/arm construction and use clearer physical focus plus readable controls. | Implemented |
| Songtradr panel | Stock performance photo competes with the professional story and makes the panel too tall. | Narrow the image, compress the panel and emphasize role/date and actual scope. | Implemented |
| Starship introduction / image | Image crop cuts the subject; heading/photo weight is uneven. | Reframe the photo and align the introduction with its real-world context. | Implemented |
| Starship scope / 3D model | Important controls look like faint text; the model hides behind an extra click and has no local labels. | Integrate the model with named selections and a stable, readable explanation. | Implemented |
| Partner identities | Arbitrary logo tile dimensions and no visible text for symbol-only logos. | Consistent brand spaces, complete marks and clear partner names. | Implemented |
| Recommendations | Attribution is too small; short and long quotes feel unbalanced. | Stronger author hierarchy, consistent spacing and restrained separation. | Implemented |
| Project filtering | Search looks like a decorative underline; filtering gives little feedback. | Recognizable search field, legible category controls and result feedback. | Implemented |
| Project tiles | External-link arrows misleadingly open dialogs; image frames vary in quality. | Clear “View project” affordance, consistent framing and readable date/type. | Implemented |
| Project illustrations | Same three symbols stand in for unrelated engineering concepts. | Draw distinct diagrams for routing, networking, encryption, branch environments and physics. | Implemented |
| Project sheets | The sticky header already exists, but is taller than needed; screenshots are difficult to inspect at full size. | Preserve the sticky title/close row, reduce its height, add full-image links and separate image from explanation. | Implemented |
| Handpan / torque / agent interactions | Sparse controls and generic presentation obscure their useful parts. | Clarify what can be manipulated; align controls and live feedback with the project sheet. | Implemented |
| Career timeline | A nested scroll box hides early jobs; selected content sits far below the clicked item on mobile. | Show the full rail; sticky detail on desktop and inline expansion on mobile. | Implemented |
| Habitat entrance | Destination buttons change the URL but not the picture. | Provide actual destination previews and a clear selected-destination entrance. | Implemented |
| Contact / footer | Three equal link rows lack a primary contact action; motion control floats below the footer. | Clear LinkedIn contact action, quieter secondary links and integrated motion control. | Implemented |
| Static reading document | No persistent orientation on a long page; giant image/story blocks interrupt reading rhythm. | Add a compact contents strip and tighten images, headings and timeline presentation. | Implemented |
| Loading / failure screens | Station loader has white text on a pale background; fallback has unreadable buttons and incomplete full-screen coverage. | Own their colors/layout explicitly and use one coherent loading component. | Implemented |
| Station introduction / map / HUD | Stacked indigo pill overrides are inconsistent with the homepage; introduction repeats the landing pitch. | Compact orientation panel, readable map labels, coherent controls and fewer overlays. | Implemented |
| Habitat scene / physical exhibits | Broad leaves made the tree read as clustered discs; two exhibit captions floated against dark table edges. The existing architecture, robot and daylight already form a coherent scene. | Smaller, more varied canopy leaves; smoother, narrower planting; physical backing plates for the Parviz and agent captions. Preserve the existing buildings and lighting. | Implemented and visually reviewed |

Verification scope: production build and manual desktop/mobile visual review. No test suites, accessibility audits or performance benchmarks.

## Review findings during implementation

- Desktop screenshots caught an accidental shared CSS selector change that removed the page width; corrected before release.
- Partner logo frames now use `contain`, because a wider frame with `cover` clipped the Uber Eats mark. Text names remain visible beneath each brand.
- The station did eventually load, with its five districts and actual Parviz CAD visible. Its previous 20-second timeout incorrectly treated slow initialization as failure. A delayed loading message now preserves the pending scene; actual WebGL/chunk failures still show a fallback.
- Arrival, delivery, workshop, agent lab and garden were visually inspected. New local destination screenshots are honest in-game captures. The arrival preview was refreshed after the foliage changes.
- The full career rail exposes the early roles. Mobile expands the selected story beside its year, rather than putting all stories below the entire rail.

Production build passes. Desktop/mobile visual review and deployment confirmation are recorded below when completed. No test suites or audits were run.

The final scene review confirmed finer foliage and preserved daylight. A root loading-error boundary also prevents a failed lazy import (for example, from a tab open during a new deployment) from leaving a blank page.
