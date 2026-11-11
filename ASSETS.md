# Asset and component provenance

## Store badges

Nine unchanged badge files are reused from the owner's Pocket Gallery website.
The four Apple and four Google badges retain their localized original artwork.
HarmonyOS uses the same original `harmonyos-next-badge.webp` wordmark in every
locale, replacing the former AppGallery images. Its pinned China-branch source,
Git blob, dimensions and SHA-256 are in `public/badges/manifest.json`.

The NEXT wordmark is 464×70 with transparency. It is rendered proportionally at
26px high on a compact white surface so its dark lettering remains legible in
both themes; the source pixels are not cropped or recolored. Apple/Google
rendering retains the original badges and transparent clearspace. Trademarks
remain their respective owners' property, outside Pocket Gallery's code license.

The HarmonyOS store link is copied from Pokedex-HarmonyOS's
`entry/src/main/ets/pages/moreinfo/CreatorHubPage.ets`, constant
`MONSTER_HUNTER_DEX_APP_STORE_URL`. The actual product is package
`com.eurekaffeine.monsterhunterdex`, not Pocket Gallery. The Android link is the
owner-confirmed [Google Play listing](https://play.google.com/store/apps/details?id=com.eurekaffeine.mhd)
for `com.eurekaffeine.mhd`, confirmed by the owner on 2026-11-11. The pending Apple badge has no
href or keyboard action; its accessible label retains its pending status.
Visible status labels are omitted from the homepage at the owner’s request.

The website adapts the owner's `pocket-gallery` VitePress navigation, search, themes and documentation shell. Its MIT notice is included in `public/POCKET-GALLERY-LICENSE.txt`. The current landing scaffold follows Pocket Gallery and the owner's screenshot/branding requirements.

The warm palette derives from `assets/design-tokens/tokens.json`. The app icon was derived from `apps/harmonyos/AppScope/resources/base/media/foreground.png`.

## Localized native screenshots

All five topics have separate English, Simplified Chinese, Traditional Chinese and Japanese captures. Website locale selects the matching native-language images for both hero and gallery; no English/Chinese fallback image is shared across locales. Text is not painted over a screenshot.

Raw captures and native accessibility evidence remain in the private MonsterHunterDex repo under `docs/launch-kit/captures/{en,zh-Hans,zh-Hant,ja}/`, with the updated Builder sources under `docs/launch-kit/captures/ios-builder-20261109/`. All five website topics now use the iOS development app. The obsolete HarmonyOS Builder caption is removed, consistent with the owner's request to omit routine iOS captions. Source manifests retain language, platform, game, entity and capture appearance.

The four Builder captures were taken on 2026-11-09 through the real Wilds armor-search flow, requesting Weakness Exploit level 5. A standalone XCUITest runner passed on the isolated `MHD_Website_iOS_27_2` simulator (iPhone 18 Pro Max, iOS 27.2). The manifest records the device UUID, app version, installed Debug dylib SHA-256, native image hashes and settings/UI evidence. No native app code was changed. The 1320×2868 captures are fitted into the existing website bezel; only the four Builder images were replaced. Other launch-kit outputs have not been regenerated.

Screenshots use **monster silhouettes off and game logos on**. These preferences were enabled in the actual iOS app before capturing each locale. Original simulator settings were restored after the earlier captures; the isolated Builder capture simulator retained its settings and was shut down. Game logos appear on the app surfaces that normally display them (Home and Saved), not as an added overlay on other pages.

The Saved screen uses an isolated DEBUG bookmark fixture containing real canonical references. The user's bookmarks were not changed. Build/device identity, native capture steps and visual review are recorded in the private app repo at `openspec/changes/archive/official-website/evidence/localized-captures/ledger.md`.

## One iPhone 18 Pro frame

Every hero, gallery, launch panel and video scene uses the same **iPhone 18 Pro Simulator bezel**. The installed Apple profile (`iPhone19,2`) maps to `com.apple.dt.devicekit.chrome.phone11`; its corner/edge PDFs and buttons surround the native 1206×2622 display mask at 3× scale. `public/frames/iphone-18-pro.json` records geometry and source hashes. This is presentation framing; actual capture devices and platforms are recorded separately in the manifests.

`scripts/iphone_frame.py` fits the full native screenshot proportionally inside this one frame. No app pixels are cropped, rewritten or retouched. There are no separate CSS bezels. All web images are 660×1317 with transparent outer corners. `public/screenshots/manifest.json` records all 20 image paths and their actual dimensions; build and browser checks enforce matching languages and uniform framing.

Run `scripts/prepare-assets.py --source-root /path/to/MonsterHunterDex` with Python/Pillow to regenerate the screenshot derivatives from the raw captures. `--refresh-branding` additionally regenerates the icon/social card when its original LFS icon is available. `scripts/prepare-iphone-frame.py` regenerates Apple's frame with Pillow/Poppler and the installed Simulator PDFs; PDF originals remain outside the repository.

Official game artwork and data remain CAPCOM's property. Apple's device chrome is not covered by the website's source license. Optimized public derivatives are stored outside Git LFS for Pages; raw screenshots remain LFS-managed. Canonical runtime assets and app source are unchanged.

## Benefit-card icons

The former benefit cards used three inline Lucide icons: `hard-drive-download` (offline access), `gift` (free/no ads), and `languages`. They share the original 24×24 viewBox and 2px rounded line style, rendered at 32px in the site's accent color. Adjacent headings carry the meaning, so SVGs are hidden from accessibility and are not focus targets.

Sources: `https://github.com/lucide-icons/lucide/tree/main/icons`. Exact Git blob IDs: hard-drive-download `686dec63faab86465de23e02703472b26cb25561`; gift `c33b33f6481f370fe2abb92839e453ca82513b09`; languages `c3c1486ee10dc0ec0c9a94f88171e62ca8dea9c8`. The upstream license (blob `718bb3f0e44153809972abed31839375804bf652`) is included verbatim as `public/LUCIDE-LICENSE.txt`. Only these SVG paths are vendored; no icon package or runtime network dependency was added.

## Voluntary-support QR codes

The owner requested the same Alipay and WeChat Pay QR codes as Pocket Gallery.
`public/support/qr_alipay.jpg` and `qr_wechat.jpg` are unchanged copies of that
repository’s `docs/.vuepress/public/` assets. Their Git blob identities match the
current public source; SHA-256, source URLs, dimensions and byte counts are recorded
in `public/support/manifest.json`. The original JPEG pixels, colors and quiet zones
are preserved. These are payment assets authorized for the same developer, not
Monster Hunter artwork. They are stored outside LFS for static hosting.


## Pocket Gallery landing scaffold (2026-11-11)

The active hero/story/download/footer layout is adapted from Pocket Gallery main
at `b08455f5889d8ca09bbc255861e584d89a1e17bf`, under
`docs/.vitepress/theme/components/LandingPage.vue` and `theme/style.css`.
The MIT notice is retained. The tablet montage, Pokémon content and unused mock
UI styles are not imported. `LandingScaffold.vue` and `FeatureStory.vue` share the
presentation across both Sapphire editions; branch data supplies regional details.

The app icon palette was previously recorded in MonsterHunterDex's
`assets/design-tokens/tokens.json` and `docs/brand-palette-poc.html`: primary rust
#B8533A, cocoa #6B4A30, ink #3A2E26, olive #7A8A4E and gold #C9A862. Rust supplies
actions and highlights on a white page; dark mode uses a lighter rust for contrast.
The original three phone screenshots and all feature captures remain unchanged.
The previous benefit-card icons are no longer rendered; their license notice is retained.
