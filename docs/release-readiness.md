# Release notes

26 October 2026. Publication explicitly authorized by the owner. This instruction supersedes older planning documents prohibiting commits and deployments.

## Build and hosting

- Node 22.12+; `.nvmrc` pins major 22. Install using `npm ci`.
- `npm run build` checks TypeScript, regenerates reading content and builds Vite output. Test suites, accessibility audits and benchmarking are deliberately omitted from this visual release.
- Target: https://m-esm.github.io/ with Vite base `/`. Hash routes need no server rewrites. `/reading.html` remains a separate static document.
- Local fonts, their license, procedural geometry/textures and bundled WASM are included. No new runtime CDN, API key or backend is required.

## Publishing workflow

`.github/workflows/pages.yml` runs on pushes to `master` and manual dispatch. It installs locked dependencies, builds, uploads `dist`, and deploys the official Pages artifact with Pages/OIDC permissions. Repository Pages source was changed to GitHub Actions on 26 October.

The SSH source push reached GitHub as `11ed538`. Its first runner build failed on a missing Linux Rollup native package. The pinned lockfile repair in `7972b9e` completed a successful Pages workflow. The new art pass and readiness fixes have since been published through the signed-in GitHub editor; the complete-art deployment for `21f2229` succeeded, including its Linux build and Pages deployment. The live public scene was inspected and its application entry-point hash matches the local production build. Local Git metadata is still read-only in the agent session. See the latest entry in `implementation-status.md` for the final observed deployment state.

## Known limitations

The large world/WASM chunk still raises Vite's advisory chunk-size warning. New artwork has not received device, accessibility or performance certification. Earlier passing checks and measurements apply to the earlier build. Fresh CV, exact current-role dates and recent public-safe case studies remain source-content gaps. The workshop and agent-routing models are illustrations.

## SSH release command

Run `npm run deploy:github` in a normal terminal. It builds first, fetches the SSH origin, commits the scoped project files, merges remote history without rewriting it, rebuilds if the merge changed HEAD, and pushes master. It refuses a different branch/remote or pre-existing staged changes. Conflicts and build failures stop publication; it never force-pushes.
