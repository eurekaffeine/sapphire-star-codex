# Website repository migration verification — 2026-11-10

Source snapshots: monorepo global `acd4f161c`, China `2664d0ec6`.
Destination: https://github.com/eurekaffeine/sapphire-star-codex.
Global source landed through PR #1 (merge `035d419`); China source is on
`china-version` at `223a2f9`. No private app history or datasets were imported.

## Standalone website validation

- Both editions: `npm ci` succeeds with 0 reported vulnerabilities.
- Global build: 21 pages; all 44 public files match the monorepo snapshot exactly.
  UX audit: 117 rendered states / 8 interaction groups; store audit: 32 layout/theme
  states and 8 availability pages. No page errors or failed assets.
- China build: 6 pages; all 20 public files match the China snapshot exactly.
  UX audit: 41 states / 9 interaction groups, including exact QR downloads; store
  audit: 8 layout/theme states and 2 availability pages. No page/asset errors.
- Contributor/OpenSpec docs are excluded from public pages and local help search.
- Runtime builds need only the source checkout and npm dependencies. Asset
  regeneration explicitly accepts a separate raw-capture source-root.

## Monorepo cleanup

Website source and its CI workflow are retired here; `sapphire-star-codex/README.md`
points to the new source branches. Native apps, data and raw captures stay here.
The launch-kit renderer now accepts `--website-root`, defaulting to a sibling
standalone checkout. Python compilation passes; the renderer's actual import setup
loads the standalone compositor and produces its expected 1368×2730 frame.
A missing checkout returns the documented actionable argparse error.

No native app code changed, so mobile builds are outside this migration's checks.
`git diff --check` passes. Source publication uses PRs; neither main is pushed directly.

## Hosting

Pages still serves `gh-pages` at `/`. The deployed revision remains
`04ba591fe783be682f044131abd1c8e64b04cbcc`; live home returns HTTP 200.
No deployment or Pages configuration change is performed. China hosting remains
unconfigured, with its noindex preview behavior retained.

Destination CI runs: global `42833662932` and China `42833922733` both succeeded.
The migration is now recorded here as an archived website change; retained raw
captures and the launch-kit renderer are owned by the private application repo.
