# Verification — 2026-11-14

## Native capture

The owner requested fresh matching screens from the updated app. Built the current
iOS source at app HEAD `369cd5d55`, including the pre-existing native working-tree
edits, without editing native app code. The simulator app packages all fourteen
locales. Installed Debug implementation SHA-256:
`8433d99f218ec6a713f0210130fe2b3bfba4e056a81b31ac31ad075f6a44c9a6`.

Used the documented website-owned simulator `MHD_Website_iOS_27_2`, UUID
`C6A34820-E01A-40D3-8CB9-ED829D92EDD6`, iPhone 18 Pro Max / iOS 27.2. No other
simulators were controlled. A standalone XCTest runner captured Home, Rey Dau
hitzones, Hope Blade I, native armor-search results for the existing Weakness
Exploit level-5 query, and saved canonical references in all fourteen languages.

The final command returned success with all fourteen cases passing on their final
attempts. Its log counts fifteen executions, including one initial Arabic launch
failure followed by a successful retry; the failed attempt is not counted as a
passed capture. Earlier diagnostic probes and a cancelled batch are retained
separately. The revised capture check verifies UI language, skill identity/level
and result-screen readiness without assuming Builder game labels exactly match a
separate translation dictionary.

All 70 PNGs have their own timestamps, UI trees and locale/device records. They
were fitted to the existing bezel without repainting text or mirroring pixels.
The 70 output hashes and original PNG hashes were verified. Every image uses the
same updated binary. Originals are retained privately under the app checkout's
`.codex/audit-evidence/website-languages-20261114/captures/`.

Original app preferences and application-support data were backed up, then restored
byte-for-byte after capture. Task helper apps were removed and this task-started
simulator was returned to Shutdown. Native source and other devices were untouched.

Representative native reviews covered English, Arabic, French, German, Korean and
Japanese, including the corrected expanded monster header. Six bounded images were
inspected during capture/web review, including contact sheets and one diagnostic
blank-window image; this is not an exhaustive native-app visual or linguistic audit.
App UI/game text is preserved as rendered, including existing translation/fallback
wording. Native-speaker review is not claimed.

## Website

Global metadata and copy cover fourteen locales; all 70 content routes and the
shared 404 page build successfully. Each language has its own five native images.
Arabic gets RTL text and controls while screenshot pixels retain native orientation.
Localized original store badges are reused where available; documented English
artwork fallback is used for languages absent from the reference asset set.

The global UX audit passed 430 rendered states and its interaction groups, including
LTR/RTL carousel selection, actual touch gestures, keyboard navigation, locale
switching, theme persistence, search and no horizontal overflow. A programmatic
selection guard fixes rapid Home/End/arrow navigation racing stale observer events.
Supporting-page checks passed 112 desktop/mobile states and another 56 pages at
320px. Header checks at 1101/1200/1280/1366/1440px found no overflow across all
fourteen locales. The build validates all 70 image hashes, sizes, languages and
fresh capture provenance.

The China website stays Simplified Chinese-only, with app-language wording updated
to fourteen and the same fresh zh-Hans image set. Its six-page build, 40 UX states
and eight store states passed; QR assets, registration and regional availability
remain intact.

Website translations are authored from the existing content and use the existing
policy's effective date with a separate translation date. They do not add claims
of complete game-text coverage or professional linguistic certification.

The final global store audit also passed 112 locale/viewport/theme states and all
28 localized availability pages. Original badge/QR hashes and both published
store destinations are verified; English artwork fallback is explicit in metadata.


## Publication and live checks

Global source PR #14 merged as `7d0a4ff`; China source PR #13 merged as `db9a7df`.
Both source CI builds passed. Global Pages revision
`039df608cf1fe5d7ceb3047433f034f4b512676d` deployed successfully in run `43584850677`.
Live verification passed all 70 localized content pages, all 70 exact WebP hashes,
and mobile carousel behavior in every one of the fourteen locales. The original
three-phone hero, white/rust scaffold and regional differences remain intact.
The completed change is archived after implementation, audit and publication.
