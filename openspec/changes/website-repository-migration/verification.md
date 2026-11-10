# Source import verification — 2026-11-10

Global source snapshot: MonsterHunterDex `acd4f161c` (website subdirectory only).
China source snapshot: MonsterHunterDex `2664d0ec6` (separate branch).
Destination baseline: existing `main` commit `5ed15f5`.
Pages baseline: `gh-pages` commit `04ba591fe783be682f044131abd1c8e64b04cbcc`.

The global standalone checkout passes `npm ci` (0 vulnerabilities) and `npm run
build`: 21 HTML pages, internal links/anchors, global base, store/QR contracts and
20 localized native screenshots. All 44 public files match the original snapshot
byte-for-byte. Contributor/spec docs are excluded from rendered pages and search.

The optional image generator now requires an explicit app checkout path and uses
the published capture manifest, retaining the current iOS Builder source. Normal
builds use only checked-in assets. Browser audit evidence stays inside the checkout
under ignored `.codex/audit-evidence/`. CI builds source, without deploying.

Application history, native source, datasets and raw captures are not imported.
