# Get Your Guide Dubai

Dependency-free, admin-controlled booking website for Dubai Canal cruises, Marina cruises, private yacht charters and desert safaris.

## Included package structure

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

- 48 ft Private Charter
- 60 ft Private Charter
- 75 ft Private Charter

### Desert safari

- Self Drive — AED 29
- Bus Pickup — AED 49
- 4x4 Doorstep Pickup & Drop — AED 89
- Premium Camp — AED 199
- Private Car with Standard Camp — AED 599

Reusable add-ons include Quad Bike, Dune Buggy, VIP Sitting and Premium Camp Upgrade.

## Full-control admin

Open `admin.html` to:

- Create, edit, duplicate, hide, reorder or delete packages
- Manage cards, categories and package levels
- Manage reusable add-ons and assign them to packages
- Hide, reorder, delete or create homepage sections
- Edit or remove header and footer sections
- Create, edit, hide, reorder or delete navigation links
- Edit brand, hero image, contact details, colors and social links
- Export/import the full website as JSON
- Reset to the original seeded packages

The current version stores draft changes in browser local storage so it works instantly without a backend. Before public production use, connect the included data model to Supabase or another authenticated database and protect `admin.html`.

## Run locally

```bash
npm run check
python3 -m http.server 4173
```

Open:

- Website: `http://localhost:4173/`
- Admin: `http://localhost:4173/admin.html`

## Netlify

The included `netlify.toml` publishes the repository root. No build command or package installation is required.

## Before launch

Replace placeholder WhatsApp/contact details and stock images. Verify package prices, routes, timings, pickup points, capacities and operator policies before accepting bookings.
