# Sapphire Star Codex website

This repository is the canonical editable website source. `main` contains the
fourteen-language global edition; `china-version` contains the Simplified Chinese
China edition. `gh-pages` contains only built global output.

- Never push directly to main. Use a branch and PR, with a successful local build.
- Read `openspec/specs/website/spec.md` and the relevant change proposal, design and
  tasks before feature work. Track completed work in tasks; archive after merge.
- Build with `npm ci` and `npm run build` at repository root. Verify affected web
  behavior with the supplied browser audits and fresh screenshots.
- Keep official screenshots and store/payment assets unchanged unless explicitly
  requested. Preserve provenance and legal notices. Never invent store URLs.
- The China and global payment QR images differ. Validate the correct manifest.
- Native applications, canonical datasets, raw captures and historical app evidence
  remain in the private MonsterHunterDex repo. Do not copy its history or data here.
- Runtime builds use checked-in optimized assets, not the app monorepo. Asset
  regeneration explicitly accepts `--source-root` for a populated app checkout.
- CI builds source but does not deploy. Keep Pages on gh-pages. Publish only built
  `.vitepress/dist/` through the global deploy command when publication is requested.
- The China host/domain remains independent; never publish its build over global Pages.
