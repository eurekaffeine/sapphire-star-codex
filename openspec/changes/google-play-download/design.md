# Design

Set the shared googlePlay URL to the owner's published package. Existing rendering
will turn the localized Google Play badges into accessible external links. Keep the
App Store pending and retain the existing AppGallery URL, badge assets and layout.

Update English, Simplified Chinese, Traditional Chinese and Japanese FAQ/About copy
to state Android and HarmonyOS availability, with iOS still pending. Align the
website spec, asset documentation and build/browser checks with two active stores.
The separate china-version branch and its domestic Android status are unchanged.

Build and run the focused store audit, inspect fresh desktop/mobile captures,
merge via PR after CI, then publish only dist to gh-pages. Verify the live Google
Play link across four homepages and eight supporting pages before recording completion.
