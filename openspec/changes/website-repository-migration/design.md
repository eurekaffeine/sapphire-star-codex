# Design

Export clean website snapshots from monorepo `origin/main` (`acd4f161c`) and
`origin/china-version` (`2664d0ec6`) into the destination repository root. Start
from its existing main history; do not merge private monorepo Git history.

Use a feature branch and PR to install global source on destination main after
local build/browser validation. Derive and publish destination china-version
from that migrated main, preserving its Chinese pages, QR assets and host rules.
Use branch-specific CI artifacts with no automatic deployment; keep gh-pages
and current Pages settings unchanged.

Move web-only build, audit, framing and asset-preparation scripts. Make the
optional raw-capture source-root explicit rather than depending on monorepo
relative placement. Keep audit outputs ignored inside the standalone checkout.
Exclude contributor/migration docs from VitePress pages and search. Record source
commit and asset parity for each edition and document the new workflow.

After verifying destination source branches and CI, replace this monorepo's
website directory with a migration pointer and remove the obsolete website CI.
Use a PR for main cleanup and a normal commit on the existing China branch.
Update the launch-kit renderer to accept --website-root for the shared compositor
so moving the website does not break the retained native marketing workflow.
Keep archives and source captures in the application repo.
