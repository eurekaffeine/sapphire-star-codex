# Design

Add ko, fr, de, es, es-419, it, ru, pt-BR, pl and ar to the global locale set, alongside
en, ja, zh-Hans and zh-Hant. Thai is not included. Keep website wording factual about
selectable app languages and fallback; do not claim complete or professionally
reviewed game translations. Translate landing, navigation and supporting pages.
Use Arabic RTL for text and controls without mirroring native screenshot pixels.

Capture Home, monster hitzones, weapon details, armor search/results and saved
references from the updated iOS app for all fourteen languages. Reuse the documented
website-owned simulator C6A34820-E01A-40D3-8CB9-ED829D92EDD6 (iPhone 18 Pro Max,
iOS 27.2), after checking ownership and active controllers. Use a separate capture
runner and derived-data path, preserve app preferences/saved data, and leave other
project devices and dirty native source untouched. Record build identity, language,
entity and raw image hashes. Compose the existing iPhone 18 Pro bezel once per screen.

Use a data-driven locale/capture mapping for routing, metadata, content, store badges
and validation. Preserve regional Spanish variants and actual RTL app captures.
Reuse existing original localized store badges where available, with documented
English badge fallback for unsupported artwork languages. Keep store URLs and QR codes.

Verify every locale route and screenshot topic, responsive LTR/RTL layouts, controls,
help search, language switching, terms/privacy/support routes and image integrity.
Publish the global site via a built PR and retain China routing/hosting independence.
