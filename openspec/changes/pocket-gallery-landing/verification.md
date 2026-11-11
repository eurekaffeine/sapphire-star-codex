# Verification — 2026-11-11

Reference source: Pocket Gallery main `b08455f5889d8ca09bbc255861e584d89a1e17bf`.
Fresh reference hero captures were compared against the new centered desktop/mobile
composition. The shared scaffold, story component and CSS match between editions;
wrappers preserve their different content, stores and footer notices.

## Results

- Global build: 21 pages, all 20 locale-matched iPhone screenshots, original badges
  and QR assets pass. China build: 6 pages, 5 matching Chinese screenshots, regional
  QR assets and the owner-provided registration record pass.
- Global UX audit: 130 rendered states and 3 interaction groups pass. China UX:
  40 rendered states and 3 groups pass. Widths: 320, 390, 768, 1024 and 1440.
- Checked three overlapping bezel-framed hero images, white page canvas and rust
  primary action; desktop scroll and keyboard chapter selection; mobile buttons,
  dots, keyboard selection and native touch swipes; vertical scrolling/pinch zoom;
  theme persistence, help search, global locale routing and regional document footers.
- Store audits: 32 global layout/theme states plus 8 availability pages, and 8 China
  states plus 2 availability pages pass. Published URLs and pending entries retain
  their correct states; original image proportions and keyboard order are preserved.
- Additional header checks at 1101, 1200 and 1280px in every global locale show no
  horizontal overflow. Narrow brand titles now shrink/ellipsize without hiding controls.
- Primary rust #B8533A is the previously analyzed icon accent and has 4.84:1 contrast
  against white. Secondary text uses the darker rust shade on its tinted surface.
- Fresh desktop/mobile, light/dark hero, story and download captures were reviewed.
  The document-only local navigation bar is hidden on landing pages so it cannot
  cover the mobile screenshot. No page or asset errors remain.
- All public image/QR files are unchanged; no tablet montage or reference app art
  was imported. No native app code or dataset was edited.

Evidence is ignored locally under `.codex/audit-evidence/pocket-scaffold/` in the
global checkout and `china-pocket-scaffold/` in the China checkout. The build remains
self-contained and requires no app checkout or simulator.
