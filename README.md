# Get Your Guide Dubai

Admin-controlled booking website for Dubai Canal cruises, Dubai Marina cruises, private yacht charters and desert safaris.

## Public package structure

### Dubai Canal and Dubai Marina

- Basic
- Economy
- Standard
- Premium
- Luxury
- 4-Star
- 5-Star
- Private Charter

### Private yachts

Private Charter packages with flexible hourly booking and celebration add-ons.

### Desert safari

- Self Drive — AED 29
- Bus Pickup — AED 49
- 4x4 Doorstep Pickup & Drop — AED 89
- Premium Camp — AED 199
- Private Car with Standard Camp — AED 599

Safari add-ons include Quad Bike, Dune Buggy, VIP Sitting and Premium Camp Upgrade.

## Hidden complete CMS

Open the CMS directly at:

```text
/admin
```

The public website does not show an admin link or admin-control section. The admin route is marked `noindex`, `nofollow` and `no-store`.

The CMS can:

- Create, edit, preview, duplicate, hide, reorder and delete packages
- Edit complete pricing, child and infant policies
- Edit boat, deck, seating, AC and capacity information
- Edit boarding location, map, meeting, pickup and drop-off information
- Edit timings and available days
- Edit buffet, drinks, entertainment, views, landmarks, inclusions and exclusions
- Edit payment, cancellation, parking, important notes and FAQs
- Assign reusable add-ons
- Manage categories, homepage sections, navigation, header, footer and site settings
- Export and import a complete JSON backup

## Package information

Package detail pages include operational information, route and views, timings, deck information, food and entertainment, pricing, policies, pickup or boarding instructions, important notes and FAQs.

## Data storage

The current version saves CMS changes in browser local storage. It works immediately for review and testing. Before a public multi-user launch, connect the included data model to an authenticated database such as Supabase and protect `/admin` with a login. A hidden URL and `noindex` headers are not a substitute for authentication.

## Run locally

```bash
npm run check
python3 -m http.server 4173
```

Open:

- Website: `http://localhost:4173/`
- CMS: `http://localhost:4173/admin/`

## Netlify

`netlify.toml` publishes the repository root and redirects `/admin` to `/admin/`.

Replace placeholder contact details and stock images, and verify operator prices, routes, timings, capacities and policies before accepting bookings.
