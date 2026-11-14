# Sapphire Star Codex website

This repository contains the editable website source and the GitHub Pages deployment.
Website code moved here from `MonsterHunterDex/sapphire-star-codex/` on 2026-11-10.

| Branch | Purpose |
|---|---|
| `main` | Global source: fourteen languages, including Arabic RTL |
| `china-version` | China source: Simplified Chinese, mainland download information and China QR codes |
| `gh-pages` | Compiled global site served by GitHub Pages |

Live global site: <https://eurekaffeine.github.io/sapphire-star-codex/>.

## Develop

```sh
git clone https://github.com/eurekaffeine/sapphire-star-codex.git
cd sapphire-star-codex
npm ci
npm run dev
npm run build
npm run preview
```

For the China edition, check out `china-version` before building. All commands run
at repository root. Building needs only Node.js 22 and checked-in optimized assets;
no app checkout, simulator, game data or Git LFS downloads are needed.

## Source layout

- `.vitepress/`: configuration, components, styles, localized copy and store links.
- `index.md`, `faq/`, `others/`, `support/`, `privacy/`: English pages.
- Locale directories defined in `.vitepress/theme/locales.json`: fourteen matching page families.
- `public/`: original licensed assets and optimized native screenshots with manifests.
- `scripts/`: build validation, browser audits, deployment and optional asset tools.
- `openspec/`: website specification and change records, excluded from the built site.

Native apps, datasets, raw captures and historical app evidence remain in the
private MonsterHunterDex repository. This repository imports website snapshots,
not private application history. See `ASSETS.md` for asset and license provenance.

## Verify

`npm run build` validates 71 global pages, links, anchors, locale/base routing,
store availability, original QR files and all 70 matching-language screenshots.
`npm run audit:ux` verifies the responsive feature story and carousel, navigation, search, themes,
keyboard and touch. `npm run audit:stores` checks download presentation and links.
Both browser audits save ignored evidence under `.codex/audit-evidence/`.

Browser audits use Google Chrome by default. Alternatively, run
`npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`.

Asset regeneration is optional: run
`python3 scripts/prepare-assets.py --source-root /path/to/MonsterHunterDex` with
Python/Pillow and populated raw captures. `--refresh-branding` also uses the original
app icon. `prepare-iphone-frame.py` requires Apple Simulator chrome and Poppler;
its outputs are checked in, so normal builds do not need these tools.

## Publish

Source changes go through a branch and PR; never push directly to main. CI builds
PRs and both source branches and uploads artifacts. It does not publish automatically.

When global publication is requested, run `npm run deploy` from the global source.
It builds and validates, then commits only `.vitepress/dist/` onto this repository's
`gh-pages` branch. Pages continues to serve that branch at `/`; its public URL/base
remains `/sapphire-star-codex/`. The source migration does not deploy or change Pages
settings. The China branch has separate host configuration and no global deploy command.

HarmonyOS and Android link to their verified AppGallery and Google Play listings.
The App Store remains pending until its release URL is verified. Voluntary support uses the global Pocket
Gallery payment images on main and the distinct China images on china-version;
contributions never unlock app features.


## Landing scaffold

The landing page follows Pocket Gallery's centered hero, desktop sticky feature
story, mobile scroll-snap carousel, centered download badges and branded footer.
`LandingScaffold.vue` and `FeatureStory.vue` are shared by both editions; the thin
`LandingPage.vue` supplies locale/store data and the China registration slot.
The hero keeps three real overlapping phone screenshots with their original
bezels. Light-mode surfaces are white; primary rust #B8533A is from the existing
app-icon palette. Screenshot assets, payment codes and regional routes remain
owned by each branch. The current UX audit checks this story/carousel behavior,
not the retired compact tab gallery or fixed four-size landing scale.


## Expanded languages

The global site follows the app's fourteen locales: English, Japanese, Simplified
Chinese, Traditional Chinese, Korean, French, German, Spain Spanish, Latin American
Spanish, Italian, Russian, Brazilian Portuguese, Polish and Arabic. Thai is deferred.
`locales.json` defines URL, HTML language/direction, screenshot language and original
store-artwork mapping; `copy.json` contains the localized landing copy. Supporting
pages follow the same route families. Arabic controls follow RTL while native
screenshot pixels are never mirrored. The China website remains zh-Hans-only.

The 2026-11-14 screenshot set uses five newly captured native iOS views per language.
Original PNGs and UI trees are retained privately in the app checkout under
`.codex/audit-evidence/website-languages-20261114/captures/`; the public manifest
records their paths, raw/rendered hashes, dates, device and build identity.
Website translations are authored from the existing English content; professional
native-speaker review is not claimed. App game-text fallbacks remain visible as
rendered by the native app, rather than being painted over in screenshots.
