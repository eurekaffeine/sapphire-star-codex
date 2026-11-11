# Verification — 2026-11-11

The owner supplied the published Play URL for `com.eurekaffeine.mhd`; a fresh
listing response also contains the Sapphire Star Codex name and package.

`npm run audit:stores` passed: build validation covers 21 pages and all original
assets; the browser audit covers 32 locale/viewport/theme download states and all
8 localized FAQ/About availability pages. Google Play and AppGallery have their
exact product links, external-link attributes and keyboard access. App Store stays
non-interactive. Fresh English desktop and Simplified Chinese mobile captures
were visually inspected; badge proportions and layout remain intact.

No native app or China branch changes. The China source revision before publishing
is `54d8ee855601ad930cc3535d831e5c464d833f01`.

Published through source PR #3 (merge `aa48403`) and gh-pages commit
`c8fd19c265a8d8f839fd11a0cf03a49f79ea6168`. Source CI and Pages deployment run
`42952130346` succeeded. Twelve live pages returned HTTP 200 with the exact Play
URL; all four download sections expose Google Play and AppGallery links and keep
Apple pending. A real mobile-width badge click opened the correct Play product
in a new tab; its fresh live download-section screenshot was reviewed.

Live verification output is saved locally in
`.codex/audit-evidence/google-play-release/live-results.json` and
`live-zh-hans-download.png`. The China branch remains at its original revision.
