# Verification — 2026-11-11

`npm run build` passes all six China pages, internal routes, image payloads and
existing QR/screenshot checks. It also checks the exact supplied registration
text, lookup URL and icon presence on all five content pages, plus the original
icon SHA-256. The icon is served as a regular Git asset, outside LFS.

A focused browser audit passed 40 footer states: home, FAQ, About, support and
privacy at 320/390/768/1440px in light/dark mode. Each page contains exactly one
registration link with the correct target and external-link attributes. The
36×40 icon renders at 18×20; links provide a 44px target and visible keyboard
focus, with no horizontal overflow or page/asset errors. Fresh mobile home and
desktop dark privacy footers were visually inspected.

Local evidence: `.codex/audit-evidence/china-beian/` (results and screenshots).
This change targets only china-version; it does not deploy to global Pages.
