# 苍蓝星图鉴 — China website

The `china-version` branch is the Simplified Chinese edition of Sapphire Star Codex.
It follows [Pocket Gallery China](https://www.pocket-gallery.cn/): Chinese content at
the site root, a link to the global website, domestic download information and the
original China-edition Alipay/WeChat support codes.

```sh
cd sapphire-star-codex
npm ci
npm run dev
npm run build
npm run preview
```

Only five content routes are generated: `/`, `/faq/`, `/others/`, `/support/` and
`/privacy/`, plus a Chinese 404 page. There is no language selector or alternate
locale payload. The app code and its supported languages are unchanged.

## Repository

This is the canonical standalone website source repository. `main` contains the
global edition, `china-version` contains this China edition, and `gh-pages` serves
the compiled global site. Run commands at this repository root; the website no
longer lives inside the app monorepo.

## Hosting

This branch is prepared for a static China host at `/`. The domain and host have
not been selected. Default builds are previews: no canonical URL or sitemap, and
`noindex` metadata plus `Disallow: /` in robots.txt.

When a domain is confirmed, build with its HTTPS origin:

```sh
SSC_SITE_ORIGIN=https://your-confirmed-domain.example npm run build
```

That value supplies canonical/social URLs, sitemap and robots.txt. It must contain
only the origin, without a path. Replace the illustrative domain with the real one;
do not publish the example. Update the privacy policy with the actual hosting
provider and add registration details only when confirmed for this site.

Publish only `.vitepress/dist/` to the chosen host. The global GitHub Pages deploy
command is deliberately absent from this regional branch. Do not copy Pocket
Gallery's domain, ICP/public-security registration or deployment credentials.

The global website remains at <https://eurekaffeine.github.io/sapphire-star-codex/>.
`.github/workflows/website.yml` validates this branch and produces a
`website-china-preview` artifact; it does not deploy either website.

## Content and assets

- `.vitepress/theme/content.ts`: Chinese metadata and landing copy.
- `.vitepress/config.mts`: root routes, Chinese search/chrome and optional host metadata.
  Chinese characters are tokenized consistently in Node and browsers so help search
  finds words inside unspaced text.
- `.vitepress/theme/store-links.json`: the verified HarmonyOS listing; iOS and
  domestic Android remain pending until their real listings are available.
- `public/screenshots/zh-Hans/`: all five native Chinese captures, with original
  provenance in `public/screenshots/manifest.json`.
- `public/support/`: exact China QR JPEGs. Their source commit, Git blobs, dimensions,
  sizes and SHA-256 are pinned in `manifest.json`; these differ from the global codes.
- `SupportPayments.vue`: original images and download links. Payments occur in the
  selected payment app; the website has no checkout, SDK or feature entitlement.
- `scripts/prepare-assets.py`: regenerate only Chinese captures using their recorded
  sources. `--refresh-branding` also rebuilds the Chinese social image; set
  `SSC_CJK_FONT` to a CJK font path off macOS. Raw captures remain in the private app repo; pass its populated checkout with
  `--source-root /path/to/MonsterHunterDex`.

Public derivatives are ordinary Git objects, outside LFS; building requires no
mobile builds or game-data checkout. See `ASSETS.md` for source/license details.

## Verification

`npm run build` checks the six-page contract, internal links/anchors, preview or
production metadata, mainland store states, original QR hashes and five framed
Chinese screenshots. `npm run audit:ux` checks desktop/mobile gallery controls,
keyboard/touch, search, themes, navigation and both QR downloads. `npm run audit:stores`
checks downloads at 320/390/768/1440px in light/dark mode.

The browser audits use installed Google Chrome by default. Alternatively, install
Playwright Chromium and set `PLAYWRIGHT_CHANNEL=chromium`. Evidence is written under
`.codex/audit-evidence/website-china-ux/` and `website-china-stores/`.
