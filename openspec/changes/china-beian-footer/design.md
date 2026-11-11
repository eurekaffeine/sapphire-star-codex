# Design

Add a shared registration notice to the landing footer and the existing document
footers (FAQ, About, support and privacy). Use the exact visible registration text
and `https://beian.mps.gov.cn/#/query/webSearch?code=32059002005040`, opening in a new
tab with noopener/noreferrer. Reuse Pocket Gallery's unchanged beian.png with
recorded provenance. Its 36×40 pixels display proportionally at 18×20 next to the
text; the icon is decorative for assistive technology.

Use the existing small typography and theme colors, a visible focus outline and
a 44px link target. Allow wrapping on narrow layouts. This owner-provided record
supersedes the earlier instruction to omit unconfirmed registration details.
No ICP record or changes to the global edition are included.

Build and inspect all five content footers at desktop/mobile sizes in light/dark
mode. Verify exact text, target, icon bytes, proportions, focus and overflow. Merge
through a PR targeting china-version; China hosting remains separate from Pages.
