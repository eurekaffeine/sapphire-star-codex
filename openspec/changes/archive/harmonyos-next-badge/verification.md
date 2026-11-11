# Verification — 2026-11-11

The NEXT WebP is unchanged from Pocket Gallery China, pinned at commit
`1d8d4b551b424d170d403c6bd03b4b23075014a8`, Git blob
`26211233b82bad72a0723ba9a04c4cfdbb061546`, SHA-256
`363ec257662fd058c8856b3c25a62616272211769b96a6b631656914c4d8bdad`.
It is a regular Git asset, not an LFS pointer.

`npm run audit:stores` passed the 21-page build, asset integrity validation,
32 locale/viewport/theme download states and eight availability pages. Checks
cover the original ratio, loaded image, accessible NEXT labels, readable white
surface in either theme, two correct store targets, keyboard order and overflow.
Fresh mobile light and desktop dark captures were visually inspected.

Source PR #5 merged as `9e6d5b2`; its CI passed. Published gh-pages revision
`b5a21749450943ff20a64ff451151319e8976f4c` passed Pages deployment run
`42952700535`. All four live homepages use the NEXT image and the existing correct
HarmonyOS product URL. The live WebP SHA-256 matches the original source exactly.
A fresh live dark-mode browser capture confirms loaded 464×70 artwork, proportional
rendering and the readable white badge surface. Evidence is stored locally under
`.codex/audit-evidence/harmonyos-next/`.
