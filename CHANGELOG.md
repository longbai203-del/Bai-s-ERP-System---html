# CHANGELOG

## 2026-08-01

### Fixed
- Repaired malformed HTML templates caused by stray literal `n`/`\n` markers that broke page rendering across many module pages.
- Added a shared navigation router in the main dashboard shell and reusable sidebar component to normalize paths and route menu clicks through real `.html` pages.
- Updated Vercel routing rules to resolve `/modules/foo/bar` and `/modules/foo` to concrete `.html` files reliably.
- Switched sidebar and navigation links to use the same internal navigation handler, preventing direct browser navigation from bypassing the app router.

### Impact
- Router/navigation: fixed
- Module page loading: fixed for key entry pages and module pages
- Vercel deployment path resolution: improved
