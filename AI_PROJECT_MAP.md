# AI PROJECT MAP — Get-Your-Guide

Canonical repository/source-of-truth map for AI-assisted work. Verify implementation before changing it; if this map and code disagree, fix this map with the change.

**Map baseline:** `main@c3028806d044fc5bc28053dc39c79a8624ec2c46`.

## Sources of truth

### Seed/default catalog
- `data.js` defines package/category/add-on/settings seed data and the default catalog model.
- `data-enrichment.js` and `catalog-baseline.js` enrich/migrate the seed model.
- Do not copy package definitions into rendering code.

### Current browser CMS draft
- **Implemented current storage owner:** `storage.js` using localStorage key `get-your-guide-site-data-v3`.
- `loadData`, `saveData`, `resetData` and backup export own browser draft persistence/migration.
- `cms.js` explicitly edits this browser draft and labels it a private CMS/browser draft.
- This is not automatically a shared production CMS. Do not claim browser-local edits publish globally.

### Public runtime
- `app.js` loads `storage.js`, assembles `app-part-1.txt` through `app-part-4.txt`, and executes the public site against `loadData()`.
- Public pages, booking/form scripts and styles extend this runtime; reuse the existing loaded data object rather than introducing a second catalog.

### Supabase schema
- `supabase/migrations/001_initial_schema.sql` defines `site_documents` with RLS for key `site`.
- Current `cms.js` / `app.js` caller evidence uses browser storage, so **do not assume Supabase is the active CMS source** until an actual runtime caller/sync path is verified.
- If the architecture is migrated to Supabase persistence, update this map and migrate callers deliberately rather than running two authorities.

### Booking / conversion
- Booking/form behavior is distributed across existing booking/CMS scripts such as `booking-form.js`, `cms-booking-fields.js`, package/detail scripts and the assembled public runtime.
- Trace the actual active caller before modifying pricing, booking payloads or WhatsApp/contact behavior.

## Critical flows

### Public data load
`Browser -> app.js -> storage.loadData() -> localStorage v3 OR migrated seed -> assembled app-part runtime -> rendered site`

### CMS edit
`Private CMS -> cms.js -> storage.saveData() -> browser localStorage draft -> same-browser public preview/runtime`

### Reset/migration
`storage.loadData -> v3 localStorage if present -> legacy v2 or cloneDefaultData -> enrich/baseline -> save v3`

### Potential Supabase path
`site_documents migration/RLS` exists, but active runtime ownership must be proven before using it as the source of truth.

## Trust boundaries
- Browser localStorage is user/device-local and can be edited; do not treat it as trusted server persistence.
- Supabase RLS would be the security boundary only for callers that actually use that backend.
- Public form/booking input is untrusted and must be validated in the active submit path.
- Backups/imports can replace browser draft state and require validation.

## Change impact map
- Package/catalog change -> inspect `data.js`, enrichment/baseline logic, storage hydration, public render and CMS fields.
- CMS/storage change -> inspect `cms.js`, `storage.js`, backup/import/reset behavior and public `app.js` loading.
- Booking change -> identify the active booking/form script, package data fields and external destination before editing.
- Supabase migration -> prove current callers, then update RLS/schema + browser sync/persistence deliberately and retire competing authority.
- UI/SEO change -> inspect actual page/runtime plus existing SEO workflow and browser output.

## Derived understanding artifacts
- Graphify is a derived code relationship index; verify important conclusions in source.
- `.ai/architecture/system.architecture.json` is the committed source-backed Archify model.
- Neither artifact overrides this map or runtime evidence.
