# Design

Reference: Pocket Gallery main at `b08455f5889d8ca09bbc255861e584d89a1e17bf`,
`docs/.vitepress/theme/components/LandingPage.vue` and `theme/style.css`.
Reuse its active centered hero, pill actions, generous white sections, sticky
phone/scrolling chapters on desktop, scroll-snap chapters and controls on mobile,
centered store badges and two-column brand/legal footer. Keep VitePress navigation,
local help search, theme controls and locale-preserving routes. Do not copy its
unused mock UI styles, fake demo elements, user counts, store URLs or artwork.

This explicit new direction replaces the old cream canvas, compact tab gallery,
benefit-card presentation and four-size landing typography restriction. Use the
reference's responsive display hierarchy, system font and spacing. Feature changes
follow scrolling/manual controls, never a timer; preserve reduced motion, native
vertical scrolling, pinch zoom, keyboard access and 44px controls.

The icon palette already analyzed in the app repo specifies primary rust #B8533A,
cocoa #6B4A30, ink #3A2E26, olive #7A8A4E and gold #C9A862. Use rust for actions,
links and selection on #FFFFFF, with a readable lighter rust in dark mode. Keep
Pocket Gallery's neutral surfaces and black dark canvas instead of tinting the
whole website parchment. Document color provenance in this standalone repo.

Keep the original matching-language iPhone 18 Pro screenshots byte-for-byte, in
the existing weapon/hitzones/builder hero stack and five feature topics. Never
wrap a baked-in bezel in another fake phone border. Split shared visual components
so both editions use the same presentation with their own copy and store data.

Replace Pocket Gallery copy with factual Sapphire content, retain all five feature
stories and core offline/free benefits, and correct unsupported location claims
in English/Japanese. Preserve download anchors, support links and notices. No new
native app captures or game-data changes are needed.

Verify 320/390/768/1024/1440 layouts, scrolling/keyboard/touch feature selection,
locale and theme transitions, help search, store actions and footer/QR integrity.
Compare fresh desktop/mobile captures against Pocket Gallery's structure. Merge
separate PRs into main and china-version. Publish only the validated global build;
keep China preview/hosting settings independent.
