# Standalone website source repository

Move the editable Sapphire Star Codex website from the application monorepo to
https://github.com/eurekaffeine/sapphire-star-codex, as requested by the owner.
The destination currently serves compiled output from `gh-pages`; source should
live on `main` (global) and `china-version` (Simplified Chinese China edition).

Publish only website source and already-public optimized assets. Preserve the
private app history, datasets, raw captures and historical evidence in this repo.
Retire duplicate source/CI after both editions build in the destination. Preserve
the live Pages deployment and its branch settings during this source migration.
