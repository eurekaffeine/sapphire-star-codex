# Design

Use the landing scaffold’s registration slot as the only render site. Group ICP
and public security in that order, keeping the decorative icon, official targets,
keyboard focus and 44px tap height. On phones the copyright can move to its own
line while the links stay together. Keep the existing document policy links.

Build directly from the China branch: retain the live Chinese server-rendered 404,
hosting disclosure and deterministic build order, but not the old deployment-only
ICP layout. Check the static HTML for every route and the rendered row at mobile
and desktop widths before deploying with the existing Sapphire release switch.
