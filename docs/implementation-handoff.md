# Implementation handoff

## Recommendation

Start implementation with **GPT-6.1 Sol, High effort**, if that model is available in the coding model picker. This is a task-fit recommendation for a sustained TypeScript/3D implementation and browser iteration, not a benchmark claim. **Astra, High effort** is also a suitable choice if that is the available/preferred model; the design does not need to be reopened first. High is a sensible starting point because movement, camera state, physical DOM text, fallback and rendering interact. Higher effort is not a substitute for looking at the running scene.

Use one implementation session focused on phases 0–3 and the polished vertical slice. Later sessions can expand the station after the slice passes. Do not ask the user to re-answer the design interview.

## Repository state at handoff

- Local repository: `/Users/moshe/Desktop/myprojects/m-esm.github.io`.
- Remote: `git@github.com:m-esm/m-esm.github.io.git`.
- Branch inspected: `master`.
- Starting commit: `a56a278` (`ready for new website`).
- Before this planning task, only `.gitignore` was tracked and the worktree was clean.
- This task adds `README.md` and six documents in `docs/`; it does not scaffold the app or install packages.
- No files were deleted, committed, pushed, or deployed during planning. Git history retains the old site.
- No repository-specific `AGENTS.md` was found in the inspected ancestor chain. Check again at implementation start.

## Working rules

1. Read the full design set; `brief.md` records user decisions, the remaining docs record delegated choices. Current user choices override the older pasted planning prompt.
2. Inspect git status before any edits. Preserve user changes and `.git` history. Work only on the requested repository; external research sources are read-only.
3. Implement locally. Do not commit, push, deploy, buy assets, or change external accounts as part of this handoff.
4. Choose routine implementation details yourself. Change a documented architecture choice only for a concrete technical reason and record the reason without reopening taste questions.
5. Use real content from `brief.md`; do not fill gaps with fabricated achievements, metrics, employment dates, public availability claims, contact details or links.
6. Build one finished playable slice and validate it in a browser. Build success alone does not establish visual or gameplay quality.
7. If a dependency/network/browser permission blocks a step, use available supported alternatives and record the exact remaining limit. Do not claim an unrun test passed.
8. Update `README.md` and create `docs/implementation-status.md` with completed work, run commands, observed measurements, screenshot locations, source gaps and next tasks.

## Copyable prompt for the first implementation session

```text
Implement the first polished playable slice of my 3D portfolio in this repository.

The concept and design decisions are already settled. Read these files in order:
1. README.md
2. docs/brief.md
3. docs/world-concept.md
4. docs/experience-design.md
5. docs/architecture.md
6. docs/implementation-plan.md
7. docs/implementation-handoff.md

Then implement phases 0–3 of the plan. Do not stop at another plan or scaffold.

Core vision: a stylized but believable, industrial, lived-in orbital research
settlement with several terraces under an enormous glass dome. The space feels
outdoors, with soft daylight and a large blue ocean planet visibly overhead.
The visitor drives a small wheeled maintenance robot with a raised, wide
third-person camera. The atmosphere is quiet, beautiful and comforting.
Exploration is free: no mandatory tasks, puzzles, combat or progression.

All portfolio text in the main experience belongs to physical signs, plaques,
boards or equipment. Focus the camera on those objects for reading; do not open
floating project cards or article modals. Keep a separate accessible static
reading mode and compact utility/touch controls as specified in the docs.

The first deliverable is the arrival terrace plus the Delivery systems exhibit,
not five unfinished sectors. Include the dome, planet, finished robot and art
language, a traversable ramp, an overhead structure that exercises camera
collision, real sourced exhibit copy, readable physical boards with actual
links, keyboard/touch controls, inspection and return, deep links, reduced
motion, and a no-WebGL/no-JavaScript content fallback.

Use the documented Vite/TypeScript/React/Three.js/Fiber architecture, selected
Drei helpers and narrow Rapier kinematic collision. Verify stable dependency
compatibility and installed APIs. Keep content independent of scene code.
Use authored modular geometry and locally served assets; no purchased assets,
backend, live AI, or private infrastructure connections are needed.

Inspect git status and applicable repository instructions first. Preserve
existing work. Make routine implementation decisions autonomously and record
material deviations. Do not repeat the design questionnaire. Do not commit,
push or deploy.

Run appropriate type, build, logic and browser checks. Inspect screenshots of
the actual running scene at desktop and portrait mobile sizes. Fix visual,
camera and readability defects before calling the slice complete. Measure
performance where possible, distinguishing real hardware from emulation and
targets from results. Passing compilation is not sufficient.

Update README.md with accurate run instructions and write
docs/implementation-status.md with the completed slice, checks, observed
metrics, screenshots, limitations and the next expansion tasks. Finish with
the local preview address and a clear account of what works and what remains.
```

## Expansion-session prompt

```text
Continue implementing this portfolio from docs/implementation-status.md and
the design documents. Inspect the existing slice and its validation results
first. Fix any unmet slice acceptance criteria, then complete phases 4–5 of
docs/implementation-plan.md: expand the connected terraced settlement, add
curated source-backed exhibits and the career/contact garden, and validate
the complete world. Preserve the open glass-dome setting, daylight, wheeled
robot, free exploration and physical text. Do not invent recent project
details or turn illustrative machinery into claims of shipped work. Keep
README.md and implementation-status.md accurate. Do not commit, push or deploy.
```
