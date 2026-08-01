const levelDetails = {
  Basic: { buffet: 'International buffet with vegetarian and non-vegetarian options.', drinks: 'Unlimited water and soft drinks.', entertainment: 'Tanoura show and background music, subject to the confirmed trip.', best: 'Budget travellers, families and small groups' },
  Economy: { buffet: 'International buffet with BBQ selections, vegetarian and non-vegetarian dishes.', drinks: 'Unlimited water and soft drinks.', entertainment: 'Tanoura plus puppet or other scheduled show, depending on the vessel.', best: 'Couples and families wanting a value upgrade' },
  Standard: { buffet: 'Expanded international buffet with BBQ, main courses, salads and dessert.', drinks: 'Unlimited water and soft drinks; tea or coffee where listed.', entertainment: 'Tanoura, magic or puppet performance, subject to the departure.', best: 'First-time visitors, couples, families and mixed groups' },
  Premium: { buffet: 'Premium international buffet with BBQ, salads, mains and desserts.', drinks: 'Welcome drink plus unlimited water and soft drinks.', entertainment: 'Live entertainment with route-dependent laser or fountain views.', best: 'Birthdays, couples and guests wanting upgraded service' },
  Luxury: { buffet: 'Luxury buffet with upgraded starters, BBQ, mains and desserts.', drinks: 'Signature welcome drink, water, soft drinks, tea and coffee where available.', entertainment: 'Premium onboard entertainment and skyline viewing.', best: 'Anniversaries and special evenings' },
  '4-Star': { buffet: '4-star hotel-style buffet with salads, soups, BBQ, mains and desserts.', drinks: 'Welcome drink, water, soft drinks, tea and coffee.', entertainment: 'Curated live entertainment and route-dependent views.', best: 'Corporate guests and celebrations' },
  '5-Star': { buffet: '5-star dining presentation with premium starters, mains, BBQ or live station and desserts.', drinks: 'Signature welcome drink, water, soft drinks, tea and coffee.', entertainment: 'Premium onboard entertainment with priority service.', best: 'VIP guests, proposals and premium family outings' },
  'Private Charter': { buffet: 'Custom buffet or catering can be selected according to guest count.', drinks: 'Water and soft drinks; custom beverage packages are available.', entertainment: 'Sound system included; DJ, performers and decoration are optional.', best: 'Birthdays, weddings, corporate events and private groups' }
};

const cruiseInfo = {
  canal: {
    location: 'Dubai Water Canal', boarding: 'Al Jaddaf / Dubai Water Canal boarding point', boat: 'Dubai Canal Dinner Dhow', type: 'Traditional double-deck dhow',
    landmarks: ['Al Jaddaf Waterfront', 'Palazzo Versace', 'Mohammed Bin Rashid Library', 'Dubai Festival City', 'Dubai Creek Harbour', 'Ras Al Khor skyline'],
    views: ['Palazzo Versace', 'Dubai Festival City', 'Creek Harbour skyline', 'Waterfront bridges'],
    slots: [
      { id: 'canal-first', label: 'First Trip', boardingTime: '5:30 PM', sailingTime: '6:00 PM', returnTime: '8:00 PM', days: 'Daily' },
      { id: 'canal-second', label: 'Second Trip', boardingTime: '8:00 PM', sailingTime: '8:30 PM', returnTime: '10:30 PM', days: 'Daily' }
    ]
  },
  marina: {
    location: 'Dubai Marina', boarding: 'Dubai Harbour / Marina boarding point', boat: 'Dubai Marina Dinner Dhow', type: 'Traditional double-deck dhow',
    landmarks: ['Dubai Harbour', 'Dubai Marina skyline', 'Cayan Tower', 'JBR', 'Bluewaters Island', 'Ain Dubai'],
    views: ['Dubai Marina skyline', 'JBR', 'Bluewaters Island', 'Ain Dubai', 'Cayan Tower'],
    slots: [
      { id: 'marina-first', label: 'First Trip', boardingTime: '6:30 PM', sailingTime: '7:00 PM', returnTime: '9:00 PM', days: 'Daily' },
      { id: 'marina-second', label: 'Second Trip', boardingTime: '8:30 PM', sailingTime: '9:00 PM', returnTime: '11:00 PM', days: 'Daily' }
    ]
  }
};

const sharedCruiseIncludes = ['2-hour cruise', 'Vegetarian options', 'Non-vegetarian options', 'Unlimited soft drinks', 'Water', 'AC lower deck', 'Open upper deck', 'Separate washrooms'];
const set = (value, fallback) => value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length) ? structuredClone(fallback) : value;

function enrichCruise(pkg) {
  const route = cruiseInfo[pkg.categoryId];
  const tier = levelDetails[pkg.level] || levelDetails.Standard;
  const charter = pkg.level === 'Private Charter';
  return {
    ...pkg,
    status: set(pkg.status, pkg.visible === false ? 'Hidden' : 'Published'),
    bookingMode: set(pkg.bookingMode, charter ? 'Private charter' : 'Per person'),
    priceUnit: set(pkg.priceUnit, charter ? 'per charter' : 'per adult'),
    adultPrice: set(pkg.adultPrice, charter ? 0 : pkg.offerPrice),
    childAgePolicy: set(pkg.childAgePolicy, 'Children aged 3–11 use the child rate unless the operator confirms another policy.'),
    infantPolicy: set(pkg.infantPolicy, charter ? 'Infants count toward vessel capacity.' : 'Children below 3 years are free unless the operator confirms otherwise.'),
    location: set(pkg.location, route.location), boardingLocation: set(pkg.boardingLocation, route.boarding),
    meetingInstructions: set(pkg.meetingInstructions, 'Arrive 30 minutes before departure. The exact gate and contact details are sent after confirmation.'),
    boatName: set(pkg.boatName, route.boat), boatType: set(pkg.boatType, route.type),
    duration: set(pkg.duration, charter ? '2 hours minimum' : '2 hours'), availableDays: set(pkg.availableDays, 'Daily'),
    capacity: set(pkg.capacity, charter ? 'Up to 120 guests, subject to vessel approval' : 'Shared cruise seating'),
    minimumGuests: set(pkg.minimumGuests, 1), maximumGuests: set(pkg.maximumGuests, 0),
    seating: set(pkg.seating, charter ? 'Private use of upper and lower decks' : 'Shared upper-deck or AC lower-deck seating'),
    upperDeckDetails: set(pkg.upperDeckDetails, 'Open-air upper deck with skyline views; allocation depends on availability and selected tier.'),
    lowerDeckDetails: set(pkg.lowerDeckDetails, 'Air-conditioned lower deck with dining tables and separate washrooms.'),
    acDetails: set(pkg.acDetails, 'Air-conditioned lower deck; upper deck is open-air.'),
    buffetDetails: set(pkg.buffetDetails, tier.buffet), drinks: set(pkg.drinks, tier.drinks), entertainment: set(pkg.entertainment, tier.entertainment),
    views: set(pkg.views, route.views), landmarks: set(pkg.landmarks, route.landmarks), highlights: set(pkg.highlights, route.views.slice(0, 4)),
    inclusions: set(pkg.inclusions, [...sharedCruiseIncludes, tier.buffet, tier.entertainment]),
    exclusions: set(pkg.exclusions, charter ? ['Custom catering unless selected', 'Decoration', 'DJ or performers', 'Extended cruising time'] : ['Hotel transfer unless selected', 'Reserved table unless stated', 'Paid celebration add-ons']),
    importantNotes: set(pkg.importantNotes, ['Route and show schedule can change due to marine or operational instructions.', 'Confirm the exact boarding pin before travel.', 'Special-event dates may have different prices and timings.']),
    timeSlots: set(pkg.timeSlots, charter ? [{ id: `${pkg.id}-flex`, label: 'Flexible Charter Slot', boardingTime: 'As confirmed', sailingTime: 'Flexible', returnTime: 'Based on duration', days: 'Daily' }] : route.slots),
    parkingInfo: set(pkg.parkingInfo, 'Parking instructions and the exact boarding pin are provided after booking confirmation.'),
    paymentMethod: set(pkg.paymentMethod, 'Advance payment is required to confirm the booking unless stated otherwise.'),
    cancellationPolicy: set(pkg.cancellationPolicy, 'Free cancellation up to 24 hours before departure unless a special-event or charter policy applies.'),
    bestSuitedFor: set(pkg.bestSuitedFor, tier.best),
    faqs: set(pkg.faqs, [
      { question: 'How early should I arrive?', answer: 'Arrive around 30 minutes before the confirmed sailing time.' },
      { question: 'Is the lower deck air-conditioned?', answer: 'Yes. The lower deck is air-conditioned and the upper deck is open-air.' },
      { question: 'Are shows guaranteed?', answer: 'Shows are subject to the confirmed vessel, departure and operational schedule.' },
      { question: 'Where is the exact boarding point?', answer: 'The exact Google Maps pin and gate instructions are sent after confirmation.' }
    ]),
    seoTitle: set(pkg.seoTitle, `${pkg.title} | Get Your Guide Dubai`),
    metaDescription: set(pkg.metaDescription, `${pkg.title} with buffet, route views, timings, inclusions and WhatsApp booking.`)
  };
}

function enrichYacht(pkg) {
  const feet = Number((pkg.title.match(/\d+/) || [60])[0]);
  return {
    ...pkg, status: set(pkg.status, pkg.visible === false ? 'Hidden' : 'Published'), bookingMode: 'Private charter', priceUnit: set(pkg.priceUnit, 'per hour'),
    adultPrice: 0, childPrice: 0, childAgePolicy: set(pkg.childAgePolicy, 'All guests, including children and infants, count toward yacht capacity.'),
    infantPolicy: set(pkg.infantPolicy, 'Infants count toward vessel capacity and require adult supervision.'),
    boatName: set(pkg.boatName, `${feet} ft Private Yacht`), boatType: set(pkg.boatType, 'Motor yacht'),
    meetingInstructions: set(pkg.meetingInstructions, 'Arrive 20–30 minutes before the charter. Yacht number and marina gate are shared after confirmation.'),
    availableDays: set(pkg.availableDays, 'Daily, subject to availability'), minimumGuests: set(pkg.minimumGuests, 1), maximumGuests: set(pkg.maximumGuests, feet <= 48 ? 12 : feet <= 60 ? 25 : 35),
    upperDeckDetails: set(pkg.upperDeckDetails, 'Open exterior deck with seating and skyline views.'), lowerDeckDetails: set(pkg.lowerDeckDetails, 'Indoor salon with seating and air-conditioning.'), acDetails: set(pkg.acDetails, 'Air-conditioned indoor salon.'),
    buffetDetails: set(pkg.buffetDetails, 'Food is not included unless a catering add-on is selected.'), drinks: set(pkg.drinks, 'Water and ice included; soft-drink packages available.'),
    entertainment: set(pkg.entertainment, 'Bluetooth sound system included. DJ, decoration and entertainers are optional.'),
    views: set(pkg.views, ['Dubai Harbour', 'Dubai Marina', 'JBR', 'Bluewaters Island', 'Ain Dubai']),
    importantNotes: set(pkg.importantNotes, ['Route depends on booked duration, weather and marine instructions.', 'Footwear and decoration rules may apply.', 'Guest count cannot exceed the licensed capacity.']),
    paymentMethod: set(pkg.paymentMethod, 'Advance payment is required to reserve the yacht.'),
    cancellationPolicy: set(pkg.cancellationPolicy, 'Cancellation and rescheduling depend on the yacht and notice period. Weather cancellations are handled under the operator policy.'),
    parkingInfo: set(pkg.parkingInfo, 'Paid or validated parking may be available at the confirmed marina.'),
    bestSuitedFor: set(pkg.bestSuitedFor, 'Birthdays, proposals, family outings, corporate gatherings and private celebrations'),
    faqs: set(pkg.faqs, [
      { question: 'Can I choose any booking time?', answer: 'Yachts use flexible hourly slots, subject to availability.' },
      { question: 'Can I bring food?', answer: 'Outside-food rules depend on the yacht. Catering can be selected as an add-on.' },
      { question: 'Is decoration allowed?', answer: 'Yes, subject to yacht approval and setup rules.' },
      { question: 'Does the route include Atlantis?', answer: 'The route depends on booking duration, weather and marine instructions.' }
    ]),
    seoTitle: set(pkg.seoTitle, `${pkg.title} Dubai | Get Your Guide`), metaDescription: set(pkg.metaDescription, `Book a ${feet} ft private yacht in Dubai with flexible timing, route and celebration add-ons.`)
  };
}

const safariExact = {
  'safari-self': { boarding: 'Desert self-drive meeting point', pickup: 'No pickup. Guest drives to the confirmed meeting point.', dropoff: 'Guest returns using their own vehicle.', seating: 'Standard camp seating', best: 'Budget guests with their own vehicle' },
  'safari-bus': { boarding: 'Selected central bus pickup point', pickup: 'Shared bus pickup from selected central locations.', dropoff: 'Return to the selected bus drop-off point.', seating: 'Shared bus and standard camp seating', best: 'Budget guests needing transport' },
  'safari-4x4': { boarding: 'Doorstep pickup from selected Dubai or Sharjah areas', pickup: 'Shared 4x4 doorstep pickup.', dropoff: 'Shared doorstep drop-off after the camp program.', seating: 'Shared 4x4 and standard camp seating', best: 'Families and visitors wanting convenient pickup' },
  'safari-premium': { boarding: 'Doorstep pickup from selected areas', pickup: 'Shared 4x4 doorstep pickup.', dropoff: 'Shared doorstep drop-off after the premium camp.', seating: 'Reserved premium camp table seating', best: 'Guests wanting better dining, seating and service' },
  'safari-private-car': { boarding: 'Private doorstep pickup', pickup: 'Private 4x4 pickup from the confirmed location.', dropoff: 'Private drop-off after the camp program.', seating: 'Private 4x4 with standard camp seating', best: 'Families and groups wanting a private vehicle' }
};

function enrichSafari(pkg) {
  const info = safariExact[pkg.id] || safariExact['safari-4x4'];
  const privateCar = pkg.id === 'safari-private-car';
  return {
    ...pkg, status: set(pkg.status, pkg.visible === false ? 'Hidden' : 'Published'), bookingMode: set(pkg.bookingMode, privateCar ? 'Private car' : 'Per person'), priceUnit: set(pkg.priceUnit, privateCar ? 'per car' : 'per person'),
    adultPrice: set(pkg.adultPrice, privateCar ? 0 : pkg.offerPrice), childAgePolicy: set(pkg.childAgePolicy, 'Child pricing and minimum age for dune bashing must be confirmed before booking.'),
    infantPolicy: set(pkg.infantPolicy, 'Infants and pregnant guests may require a no-dune-bashing option. Confirm before booking.'),
    boardingLocation: set(pkg.boardingLocation, info.boarding), meetingInstructions: set(pkg.meetingInstructions, 'The final meeting point or pickup window is shared on WhatsApp before the trip.'),
    pickupDetails: set(pkg.pickupDetails, info.pickup), dropoffDetails: set(pkg.dropoffDetails, info.dropoff), availableDays: set(pkg.availableDays, 'Daily'),
    minimumGuests: set(pkg.minimumGuests, 1), maximumGuests: set(pkg.maximumGuests, privateCar ? 6 : 0), seating: set(pkg.seating, info.seating),
    buffetDetails: set(pkg.buffetDetails, pkg.id === 'safari-premium' ? 'Upgraded premium-camp buffet with table service.' : 'Standard camp BBQ buffet with vegetarian and non-vegetarian options.'),
    drinks: set(pkg.drinks, 'Unlimited water and soft drinks at the camp; tea and coffee where available.'),
    entertainment: set(pkg.entertainment, 'Tanoura, fire and belly-dance shows, subject to local rules and the operating schedule.'),
    views: set(pkg.views, ['Red dunes', 'Sunset photo stop', 'Desert camp']), landmarks: set(pkg.landmarks, ['Lahbab desert', 'Red dunes', 'Sunset stop', 'Desert camp']),
    inclusions: set(pkg.inclusions, ['Desert experience', 'Dune bashing where included and suitable', 'Sunset photo stop', 'Camel ride', 'Sandboarding', 'BBQ buffet dinner', 'Water and soft drinks', 'Live entertainment']),
    exclusions: set(pkg.exclusions, ['Quad bike unless selected', 'Dune buggy unless selected', 'VIP sitting unless selected', 'Premium camp unless included or upgraded']),
    importantNotes: set(pkg.importantNotes, ['Pickup time changes by season and location.', 'Dune bashing may not be suitable for pregnant guests, infants or guests with certain health conditions.', 'Show schedules may change during religious or government-restricted dates.']),
    parkingInfo: set(pkg.parkingInfo, pkg.id === 'safari-self' || pkg.id === 'safari-bus' ? 'Parking details depend on the confirmed meeting or bus pickup point.' : 'Parking is not required for doorstep pickup.'),
    paymentMethod: set(pkg.paymentMethod, 'Advance payment may be required to confirm seats or a private vehicle.'),
    cancellationPolicy: set(pkg.cancellationPolicy, 'Free cancellation up to 24 hours before pickup unless the confirmed operator policy states otherwise.'),
    bestSuitedFor: set(pkg.bestSuitedFor, info.best),
    faqs: set(pkg.faqs, [
      { question: 'What time is pickup?', answer: 'The exact pickup window depends on season and location and is confirmed before the trip.' },
      { question: 'Are quad bikes included?', answer: 'Quad bikes and buggies are optional unless explicitly listed as included.' },
      { question: 'Can I upgrade the camp?', answer: 'VIP sitting and premium-camp upgrades can be selected where available.' },
      { question: 'Is dune bashing suitable for everyone?', answer: 'It may not be suitable for pregnant guests, infants or guests with certain medical conditions.' }
    ]),
    seoTitle: set(pkg.seoTitle, `${pkg.title} Dubai | Get Your Guide`), metaDescription: set(pkg.metaDescription, `${pkg.title} with pricing, pickup, camp details, inclusions and optional quad bike, buggy and VIP upgrades.`)
  };
}

export function enrichSiteData(input) {
  const data = structuredClone(input);
  data.schemaVersion = 2;
  data.settings = { ...data.settings, adminPath: '/admin/' };
  data.packages = (data.packages || []).map((pkg) => pkg.categoryId === 'yachts' ? enrichYacht(pkg) : pkg.categoryId === 'safari' ? enrichSafari(pkg) : enrichCruise(pkg));
  return data;
}
