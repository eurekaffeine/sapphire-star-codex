# China website asset provenance

## Reference and code

The layout follows Sapphire Star Codex's published website. The China edition takes
regional conventions from [Pocket Gallery China](https://www.pocket-gallery.cn/),
whose source was inspected at `1d8d4b551b424d170d403c6bd03b4b23075014a8` on
`china-version`. Pocket Gallery's MIT code notice remains in
`public/POCKET-GALLERY-LICENSE.txt`; it does not license payment codes or game art.

The warm palette comes from `assets/design-tokens/tokens.json`; the app icon derives
from `apps/harmonyos/AppScope/resources/base/media/foreground.png`. The social image
uses Chinese text and that same icon. No external fonts or CDNs are required at runtime.

## China support QR codes

`public/support/qr_alipay.jpg` and `qr_wechat.jpg` are unchanged copies from Pocket
Gallery's **China branch**, `docs/.vuepress/public/`. They differ from the global
Pocket Gallery codes previously used by the global Sapphire Star Codex website.

| Provider | Source Git blob | SHA-256 |
|---|---|---|
| Alipay | `bc73b73480bd077ccd3b64c47942bbc86308ed1c` | `b3260b777a0c9cd213bb2e77d33b6fdab989dad5c24636e0d9755c73b5815b2a` |
| WeChat Pay | `2b9ffb1ecc00b6f75c1ddfd6d799464b53365a6e` | `8113a1793027e12880a34f06a76a1cfcb72a623dac79732d51d02c09b9b53180` |

`public/support/manifest.json` pins the source commit, image dimensions and byte sizes.
The build verifies source blobs and hashes; the browser audit verifies downloaded
bytes. Images retain their complete original content, colors and aspect ratios.
Owner-authorized use is for voluntary support, with no paid features or rewards.

## Download badges

Only the unchanged Simplified Chinese App Store SVG and official AppGallery PNG
are shipped; their hashes remain in `public/badges/manifest.json`. Pocket Gallery
has no Chinese AppGallery badge, so the existing official English artwork is kept.
These store marks remain their owners' property. The domestic Android row uses
text while a genuine listing is pending; no Google Play badge is shipped.

Only HarmonyOS is linked, to the verified Sapphire Star Codex product
`com.eurekaffeine.monsterhunterdex`. Pocket Gallery store URLs are not reused.

## Chinese native screenshots

The five `zh-Hans` captures are unchanged from the published site's corresponding
images: home, hitzones, weapon, builder and saved. They use actual iOS UI with
monster silhouettes off and game logos on. Every capture includes the same
Apple iPhone 18 Pro bezel, at 660×1317. No translated text is painted over app pixels.

`public/screenshots/manifest.json` retains source paths, platform, language, game,
settings and device/build provenance. The Builder image uses the updated native
2026-11-09 capture. Raw captures remain in the private app repo under `docs/launch-kit/captures/`; the original
four-language evidence remains in the archived `official-website` change.

`public/frames/iphone-18-pro.json` records Apple DeviceKit frame geometry and hashes.
`scripts/iphone_frame.py` proportionally fits complete native screenshots without
cropping, retouching or stretching. `prepare-assets.py` regenerates only this
branch's Chinese images from their recorded sources using `--source-root /path/to/MonsterHunterDex`. Source screenshots remain
LFS-managed; optimized public images are normal Git objects.

Game artwork and data remain CAPCOM's property; Apple device chrome is outside the
website code license. Native app assets and source are not modified by this change.

## Benefit icons

`BenefitIcon.vue` retains three Lucide icons (`hard-drive-download`, `gift`,
`languages`), their 24×24 paths and the notice in `public/LUCIDE-LICENSE.txt`.

## Public-security registration icon

`public/beian.png` is an unchanged copy of Pocket Gallery China's
`docs/.vuepress/public/beian.png`, pinned at source commit
`1d8d4b551b424d170d403c6bd03b4b23075014a8` and Git blob
`2a13ba2f4b92c4b531945a66e3e35e3ead3739f9`. SHA-256:
`8dfecad0dfcb3dc584f2c2447943eefb1fd65a058856eb0611e2c56ddc4c1fe1`.
The 36×40 PNG is displayed proportionally at 18×20 beside the owner-provided
registration text/link. The icon is decorative for assistive technology; the
visible link supplies the full registration number. No recoloring or cropping.
