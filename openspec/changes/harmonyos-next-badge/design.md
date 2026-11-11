# Design

Use `harmonyos-next-badge.webp` from Pocket Gallery China in all four global locales.
Copy the file unchanged and record its SHA-256, Git blob and pinned source commit.
Name the platform and accessible link HarmonyOS NEXT. Retain the verified
AppGallery destination, Google Play action and pending Apple badge.

The source is a wide transparent dark wordmark (464×70). Render it proportionally
at 26px high on a compact white badge surface so it remains readable in both
light and dark themes. Preserve the existing download-row spacing and link target.
Remove unused AppGallery image assets and update existing build/store checks.

Build and inspect desktop/mobile light/dark layouts, then merge through a PR and
publish the global Pages site. Verify the live asset hash and all four locale links.
