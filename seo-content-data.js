const STORAGE_KEY = 'get-your-guide-seo-content-v1';

const paragraph = (id, title, body, extra = {}) => ({ id, title, body, visible: true, type: 'text', ...extra });
const list = (id, title, body, items, extra = {}) => ({ id, title, body, items, visible: true, type: 'list', ...extra });

export const defaultSeoContent = {
  home: {
    slug: 'home',
    title: 'Best Dinner Cruises & Tours in Dubai',
    eyebrow: 'Plan with confidence',
    intro: 'Compare Dubai Canal cruises, Marina dinner cruises, Creek dhow cruises, private yachts and desert safaris by location, price, food, seating and attractions before booking.',
    ctaLabel: 'Compare packages',
    ctaHref: '#packages',
    sections: [
      list('why-choose','Why Choose Our Packages?','Different travellers need different routes, menus and service levels. Our package structure makes those differences clear before a booking request is sent.',[
        'Clear Basic, Economy, Standard, Premium, Luxury, 4-Star and 5-Star levels',
        'Package-specific buffet, route, timing and deck information',
        'Private charter, yacht and safari options for groups',
        'Editable prices and policies confirmed before travel'
      ]),
      paragraph('need-help','Need Help Choosing?','Share your group size, preferred location, budget and travel date. The booking team can shortlist the most suitable cruise, yacht or safari instead of forcing you to decode thirty nearly identical cards.'),
      paragraph('group-discounts','Group Discounts Available!','Special group pricing may be available for schools, companies, families, tour groups and celebrations. Final discounts depend on date, guest count, vessel and selected package.'),
      paragraph('simple-booking','A Simpler Way to Book Dubai Experiences','Choose a category, compare package levels, review what is included, complete the booking form and send one structured WhatsApp request with the selected date, guests and add-ons.'),
      list('best-cruises','What Makes Our Cruises Best?','A strong cruise is not defined by one cheap headline price. The complete experience matters.',[
        'Clearly stated boarding area and sailing time',
        'Package-specific menu and entertainment',
        'Upper-deck and lower-deck information',
        'Route landmarks and realistic viewing notes',
        'Transparent child, payment and cancellation policies'
      ]),
      paragraph('dhow-yachts','Dhow Cruises & Yachts','Traditional dhow cruises suit shared dining and sightseeing. Private yachts suit flexible timings, celebrations and smaller private groups. Both can be compared inside the same booking system without pretending they are the same product.'),
      paragraph('choosing','Choosing a Dhow Cruise Depends on Price, Location, Food Menu and Attractions','Compare the total experience, not just the lowest advertised rate. Canal, Marina and Creek routes show different landmarks; package levels may also change the buffet, seating, service and entertainment.'),
      paragraph('ready','Ready to Book Your Perfect Dhow Cruise?','Open the package comparison, select the level that matches your budget and expectations, then send the structured availability request on WhatsApp.'),
      paragraph('guide','The Ultimate Guide to Dubai Dhow Cruise','Use our detailed Canal, Marina and Creek guides to understand routes, seating, timings, menus, policies and the differences between shared cruises and private charters.',{ links:[
        {label:'Dubai Canal guide',href:'/dubai-canal-cruise/'},
        {label:'Dubai Marina guide',href:'/dubai-marina-cruise/'},
        {label:'Dubai Creek guide',href:'/dubai-creek-cruise/'},
        {label:'New Year cruise guide',href:'/new-year-dubai-cruise/'}
      ]})
    ]
  },
  'dhow-cruise-dubai': {
    slug: 'dhow-cruise-dubai',
    title: 'The Ultimate Guide to Dubai Dhow Cruise',
    eyebrow: 'Dubai cruise guide',
    intro: 'A practical guide to choosing between Canal, Marina and Creek dinner cruises, package levels, seating, menus and private charter options.',
    ctaLabel: 'View cruise packages',
    ctaHref: '/#packages',
    sections: [
      paragraph('why-cruise','Why You Should Take a Cruise While Traveling to Dubai?','A dinner cruise combines sightseeing, dining and evening entertainment in one activity. It is useful for first-time visitors, families, couples and groups who want a relaxed view of Dubai after a busy sightseeing day.'),
      list('choose-right','Choosing the Right Cruise for You','Start with the route, then compare the package level.',[
        'Choose Canal for modern waterfront architecture and Festival City views',
        'Choose Marina for JBR, Bluewaters, Ain Dubai and high-rise skyline views',
        'Choose Creek for heritage districts, traditional trading areas and old Dubai atmosphere',
        'Choose a private charter when timing, privacy and event setup matter more than per-person price'
      ]),
      paragraph('price-location-menu','Price, Location, Food Menu and Attractions','A very low price may use a different boarding point, vessel, buffet, duration or deck allocation. Read the selected package details before paying and confirm any inclusion that is essential to your group.'),
      paragraph('booking','How to Book Your Dubai Dhow Cruise','Select the route and package, choose the date and sailing time, add guest details and optional upgrades, then send the complete request on WhatsApp for final availability and operator confirmation.'),
      paragraph('seating','Sitting Options: Upper Deck & Lower Deck Relaxation','The open upper deck usually provides wider views and fresh air. The lower deck is air-conditioned and better for guests who prefer cooler indoor seating. Guaranteed deck selection may cost extra on some trips.'),
      paragraph('entertainment','Entertainment Options on Dubai Cruises','Entertainment varies by vessel and departure. Tanoura, puppet, magic, music, laser or fountain views may be available, but the confirmed package should always state what applies to that specific trip.')
    ]
  },
  'dubai-canal-cruise': {
    slug: 'dubai-canal-cruise',
    title: 'Dubai Canal Dhow Cruise Guide',
    eyebrow: 'Water Canal experience',
    intro: 'Compare Dubai Canal cruise packages, boarding information, menus, timings, seating and waterfront attractions before booking.',
    ctaLabel: 'Compare Canal packages',
    ctaHref: '/#packages',
    sections: [
      paragraph('why','Why You Should Take a Cruise While Traveling to Dubai?','A Canal cruise offers an easy evening combination of dinner, skyline views and entertainment, with less planning than arranging separate restaurant and sightseeing bookings.'),
      list('area','Exploring the Dubai Canal Area','The route can connect modern waterfront districts with newer cultural and leisure landmarks.',[
        'Al Jaddaf Waterfront and nearby hotels',
        'Mohammed Bin Rashid Library',
        'Dubai Festival City and waterfront lights',
        'Dubai Creek Harbour skyline',
        'Downtown and Burj Khalifa views where route conditions allow'
      ]),
      list('modern-landmarks','Modern Landmarks','Landmarks vary by vessel route, marine instructions and sailing duration.',[
        'Palazzo Versace area',
        'Dubai Festival City',
        'Creek Harbour',
        'Waterfront bridges',
        'Downtown skyline'
      ]),
      paragraph('what-to-do','What to Do','Arrive early, verify the boarding gate, choose the preferred deck, photograph the waterfront during boarding and review the route before sailing so important views are not missed while dinner is being served.'),
      paragraph('about','About Dubai Canal Dhow Cruise','Most shared Canal dinner cruises run for around two hours and offer buffet dining, refreshments, lower-deck air conditioning and an open upper deck. Exact inclusions depend on the selected package level.'),
      paragraph('experience','The Experience','Guests board before the confirmed departure, receive their table or deck allocation, dine during the cruise and watch the waterfront change from sunset to night lighting.'),
      paragraph('special','What Makes It Special','The Canal area mixes cultural buildings, waterfront hotels, modern bridges and Festival City views, creating a different atmosphere from both Marina skyscrapers and the heritage Creek route.'),
      list('choose','Why Choose Canal Cruise?','Canal packages are useful for travellers who want modern views without choosing the busier Marina route.',[
        'Multiple package levels and budgets',
        'Shared dinner cruise and private charter options',
        'AC lower deck and open upper deck',
        'Family-friendly evening timing',
        'Waterfront skyline and Festival City attractions'
      ]),
      paragraph('book','How to Book Your Dubai Canal Cruise','Choose Basic, Economy, Standard, Premium, Luxury, 4-Star, 5-Star or Private Charter, confirm the date and sailing time, add guest details and send the complete booking request on WhatsApp.'),
      paragraph('time','The Ideal Time to Take a Cruise from Dubai Canal','Sunset departures provide changing daylight and evening views, while later departures provide stronger night lighting. Cooler months are more comfortable on the open deck; the AC lower deck remains useful throughout the year.'),
      paragraph('tip','Pro Tip','Do not select a package only by its label. Compare the actual buffet, seating, vessel, entertainment and boarding area because operators may use the same word, such as Premium, for different service levels.'),
      list('sights','Top Sights & Attractions to See on the Cruise','Actual visibility depends on the route and marine conditions.',[
        'Al Jaddaf Waterfront',
        'Palazzo Versace area',
        'Mohammed Bin Rashid Library',
        'Dubai Festival City',
        'Dubai Creek Harbour',
        'Downtown skyline and Burj Khalifa view where applicable'
      ]),
      paragraph('sitting','Sitting Options: Upper Deck & Lower Deck Relaxation','The open upper deck is popular for views and photography. The air-conditioned lower deck is suitable for guests who prefer indoor comfort. Some packages offer guaranteed deck selection, while others allocate seating according to availability.'),
      paragraph('preferred','Choose Your Preferred Seating Area for the Ultimate Cruise Experience','Select the deck during booking when the option is offered. Families with small children, elderly guests or summer travellers may prefer the lower deck; photographers and cooler-season visitors often prefer the upper deck.'),
      paragraph('entertainment','Entertainment Options on Dubai Canal Cruise','Depending on the vessel and departure, entertainment can include Tanoura, puppet or magic performances, music and route-based laser or fountain views. Only the entertainment listed in the selected package should be treated as confirmed.')
    ]
  },
  'dubai-marina-cruise': {
    slug: 'dubai-marina-cruise',
    title: 'Dubai Marina Dinner Cruise Guide',
    eyebrow: 'Marina skyline experience',
    intro: 'Compare Marina cruise prices, locations, menus, deck choices and views including JBR, Bluewaters and Ain Dubai.',
    ctaLabel: 'Compare Marina packages',
    ctaHref: '/#packages',
    sections: [
      paragraph('why','Why Choose a Dubai Marina Cruise?','Dubai Marina offers one of the city’s most recognisable night skylines, with towers, waterfront promenades, JBR and Bluewaters visible on suitable routes.'),
      list('area','Exploring the Dubai Marina Area','Plan extra travel time because Marina traffic and parking can be busy.',[
        'Dubai Harbour and Marina Harbour boarding areas',
        'Dubai Marina high-rise skyline',
        'JBR waterfront',
        'Bluewaters Island',
        'Ain Dubai and Cayan Tower views'
      ]),
      paragraph('experience','The Marina Cruise Experience','Most shared dinner cruises combine buffet dining, refreshments, open-deck views and scheduled entertainment. Premium tiers may add preferred seating, upgraded menus or stronger service.'),
      paragraph('book','How to Book Your Dubai Marina Cruise','Select the package level, confirm the exact harbour and departure time, choose guests and deck preference, then submit the structured WhatsApp request.'),
      paragraph('time','Ideal Time for a Marina Cruise','Sunset trips show the skyline changing into night lighting. Later trips usually provide stronger illuminated views, while winter evenings are more comfortable on the upper deck.'),
      list('sights','Top Marina Sights & Attractions','Route coverage depends on sailing time and marine instructions.',[
        'Dubai Harbour',
        'Marina skyline',
        'JBR',
        'Bluewaters Island',
        'Ain Dubai',
        'Cayan Tower'
      ]),
      paragraph('seating','Upper Deck & Lower Deck Seating','The upper deck offers open views; the lower deck provides air-conditioned dining. Confirm whether the selected tier guarantees a deck or uses best-available allocation.'),
      paragraph('entertainment','Marina Entertainment Options','Entertainment varies by vessel and may include Tanoura, music or other scheduled shows. The selected package details remain the source of truth.')
    ]
  },
  'dubai-creek-cruise': {
    slug: 'dubai-creek-cruise',
    title: 'Dubai Creek Dhow Cruise Guide',
    eyebrow: 'Old Dubai experience',
    intro: 'Discover the heritage atmosphere of Dubai Creek, traditional dhow routes, old-city landmarks, seating and dinner cruise choices.',
    ctaLabel: 'Ask about Creek packages',
    ctaHref: '/#packages',
    sections: [
      paragraph('why','Why Choose a Dubai Creek Cruise?','Creek cruises focus more on old Dubai atmosphere, trading history and traditional waterfront districts than modern skyscraper landmarks.'),
      list('area','Exploring the Dubai Creek Area','The exact route changes by boarding point and vessel.',[
        'Deira waterfront',
        'Bur Dubai',
        'Al Seef',
        'Heritage buildings and souks',
        'Traditional abras and trading dhows'
      ]),
      paragraph('experience','The Creek Cruise Experience','A shared dhow cruise normally combines buffet dinner, refreshments and relaxed sightseeing through the historic waterway. It is suitable for guests who prefer heritage views and a calmer traditional setting.'),
      paragraph('book','How to Book Your Dubai Creek Cruise','Confirm whether the boarding point is Deira, Bur Dubai or Al Seef, then review the menu, duration, deck, sailing time and transport options before sending the booking request.'),
      paragraph('time','Ideal Time for a Creek Cruise','An evening departure provides cooler weather and illuminated waterfront buildings. Sunset departures also make it easier to see both daytime heritage details and night lighting.'),
      list('sights','Top Creek Sights & Attractions','Visibility depends on the confirmed route.',[
        'Al Seef waterfront',
        'Bur Dubai heritage district',
        'Deira waterfront',
        'Traditional souk areas',
        'Abras and cargo dhows'
      ]),
      paragraph('seating','Upper & Lower Deck Seating','Open-deck seating gives a clearer heritage-waterfront view, while the lower deck offers air-conditioned comfort. Confirm the allocation policy for the selected cruise.'),
      paragraph('entertainment','Creek Entertainment Options','Traditional cruises may offer Tanoura, music or scheduled family entertainment. Shows and menus must be verified against the selected package rather than assumed from the category name.')
    ]
  },
  'new-year-dubai-cruise': {
    slug: 'new-year-dubai-cruise',
    title: 'Dubai New Year Cruise Packages & Booking Guide',
    eyebrow: '31 December special events',
    intro: 'New Year cruises use special routes, longer check-in windows, fixed seating plans, event menus and stricter booking policies. Read the complete package before paying.',
    ctaLabel: 'View New Year packages',
    ctaHref: '/#packages',
    sections: [
      list('why','Why Choose Our New Year Packages?','New Year packages are structured around route, expected fireworks zone, boarding location, menu, seating and transport rather than a normal daily cruise schedule.',[
        'Clear check-in and gate-closing instructions',
        'Package-specific fireworks and landmark expectations',
        'Special event food menu and entertainment',
        'Upper-deck, lower-deck or assigned seating information',
        'Strict payment and cancellation terms shown before booking'
      ]),
      paragraph('why-take','Why You Should Take a New Year Cruise in Dubai?','A New Year cruise can combine dinner, entertainment and waterfront celebrations while avoiding the need to move between multiple venues. It also requires early arrival and realistic expectations because marine routes and fireworks visibility are controlled by authorities and crowd conditions.'),
      paragraph('exploring','Exploring the Area on New Year Night','Road closures, restricted parking, crowd-control zones and long walking routes can affect arrival. Guests should use the confirmed boarding instructions and travel plan rather than relying on normal-day maps.'),
      list('landmarks','Iconic New Year Landmarks','The advertised landmark must match the confirmed route and viewing zone.',[
        'Burj Khalifa and Downtown skyline',
        'Dubai Festival City',
        'Dubai Marina and JBR',
        'Bluewaters and Ain Dubai',
        'Atlantis and Palm-area views on eligible routes'
      ]),
      paragraph('what','What to Experience','Expect a longer event window than a normal cruise, special boarding procedures, assigned seating, a New Year buffet, music or live entertainment and a midnight celebration subject to the route and package.'),
      paragraph('overview','New Year Cruise Overview','New Year cruises may board several hours before midnight and return after road restrictions begin to ease. Exact sailing duration, waiting time and route are package-specific.'),
      paragraph('book','How to Book Your New Year Cruise','Select the location, route and seating category, enter all guest names and ages, review the special cancellation rules and pay through the confirmed method. Keep the final voucher and boarding contact available offline.'),
      paragraph('menu','New Year Special Food Menu','Special menus can include starters, salads, BBQ, vegetarian and non-vegetarian mains, desserts and unlimited refreshments. The final menu should be displayed per package because not every vessel serves the same food.'),
      paragraph('time','Ideal Time to Take the New Year Cruise','Guests should arrive within the confirmed check-in window, often much earlier than a normal cruise. Late arrivals may be unable to reach the vessel after roads, gates or marine access close.'),
      list('sights','Top Sights & Fireworks Views on New Year Night','Fireworks and landmark visibility cannot be guaranteed unless the package explicitly confirms the viewing zone and authorities allow the planned route.',[
        'Downtown and Burj Khalifa zone',
        'Festival City waterfront',
        'Marina, JBR and Bluewaters',
        'Palm Jumeirah and Atlantis on eligible routes'
      ]),
      paragraph('sitting','Sitting Options for New Year Night','Seating may be assigned by package, deck or table plan. Upper-deck seats usually cost more because of open views; lower-deck seats provide air conditioning and indoor comfort. Some vessels restrict movement after departure.'),
      paragraph('style','Celebrate New Year in Style','Choose the package for its complete route, menu, seating and service level. A premium label alone is not enough; the confirmed vessel and viewing zone matter more.'),
      paragraph('entertainment','New Year Entertainment & Live Experiences','Entertainment may include DJs, music, Tanoura, live performers and a countdown. Exact performances depend on the vessel, permissions and event plan.'),
      list('policies','Important Information & Policies','These policies must remain package-specific and editable in the CMS.',[
        'A. Boarding & Check-In: arrive within the stated window; late boarding may not be possible',
        'B. Seating Options: deck and table allocation follow the purchased category',
        'C. Food & Beverage: only the confirmed menu and drinks are included',
        'D. Safety & Prohibited Items: follow crew, coast-guard and venue instructions; prohibited items are not allowed',
        'E. Transportation: road closures and pickup restrictions may apply',
        'F. Booking & Payment: full payment and complete guest details may be required',
        'G. Cancellation Policy: New Year bookings are commonly non-refundable or use a stricter deadline',
        'K. Confirmation Delivery: keep the final voucher, boarding pin and contact details available offline'
      ])
    ]
  }
};

export function cloneSeoContent() {
  return structuredClone(defaultSeoContent);
}

export function loadSeoContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return saved && typeof saved === 'object' ? { ...cloneSeoContent(), ...saved } : cloneSeoContent();
  } catch {
    return cloneSeoContent();
  }
}

export function saveSeoContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  return content;
}

export function resetSeoContent() {
  const next = cloneSeoContent();
  saveSeoContent(next);
  return next;
}
