export const PACKAGE_LEVELS = ['Basic', 'Economy', 'Standard', 'Premium', 'Luxury', '4-Star', '5-Star', 'Private Charter'];

const images = {
  canal: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85',
  marina: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85',
  yacht: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1600&q=85',
  safari: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=85'
};

const levelPrices = { Basic: 39, Economy: 49, Standard: 69, Premium: 89, Luxury: 119, '4-Star': 149, '5-Star': 199, 'Private Charter': 2500 };
const levelIncludes = {
  Basic: ['2-hour cruise', 'Buffet dinner', 'Unlimited soft drinks', 'Open upper deck'],
  Economy: ['2-hour cruise', 'International buffet', 'Unlimited soft drinks', 'Tanoura show'],
  Standard: ['2-hour cruise', 'International buffet', 'BBQ items', 'Unlimited soft drinks', 'Live entertainment'],
  Premium: ['Premium buffet', 'Welcome drink', 'Unlimited soft drinks', 'Reserved seating', 'Live entertainment'],
  Luxury: ['Luxury buffet', 'Priority boarding', 'Premium seating', 'Welcome drink', 'Live entertainment'],
  '4-Star': ['4-star menu', 'Reserved table', 'AC lower deck', 'Open upper deck', 'Live entertainment'],
  '5-Star': ['5-star dining', 'Premium table service', 'Priority boarding', 'Signature welcome drink', 'Live entertainment'],
  'Private Charter': ['Private vessel', 'Dedicated crew', 'Custom timing', 'Sound system', 'Event coordination']
};

function cruisePackage(categoryId, level, order) {
  const canal = categoryId === 'canal';
  const location = canal ? 'Dubai Water Canal' : 'Dubai Marina';
  const route = canal
    ? ['Business Bay', 'Burj Khalifa skyline', 'Dubai Waterfall Bridge', 'Dubai Festival City', 'Ras Al Khor']
    : ['Dubai Marina', 'JBR', 'Bluewaters Island', 'Ain Dubai', 'Cayan Tower'];
  const price = levelPrices[level];
  const key = level.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `${categoryId}-${key}`,
    title: `${location} ${level}`,
    slug: `${categoryId}-${key}`,
    categoryId,
    level,
    shortDescription: `${level} ${location} package with admin-controlled timing, dining and entertainment.`,
    description: `A configurable ${level.toLowerCase()} package for ${location}. All details, pricing, route, images, inclusions and schedules can be changed from the admin panel.`,
    originalPrice: level === 'Private Charter' ? price + 500 : price + 20,
    offerPrice: price,
    childPrice: level === 'Private Charter' ? 0 : Math.max(25, Math.round(price * 0.65)),
    infantPolicy: level === 'Private Charter' ? 'Capacity-based charter. Infant policy can be edited.' : 'Children below 3 years are free unless the operator specifies otherwise.',
    image: canal ? images.canal : images.marina,
    gallery: [canal ? images.canal : images.marina],
    location,
    boardingLocation: canal ? 'Al Jaddaf / Dubai Canal boarding point' : 'Dubai Harbour / Marina boarding point',
    duration: level === 'Private Charter' ? '2 hours minimum' : '2 hours',
    capacity: level === 'Private Charter' ? 'Up to 120 guests' : 'Shared seating',
    seating: level === 'Basic' ? 'Standard shared seating' : 'Upper and lower deck seating',
    highlights: route.slice(0, 4),
    inclusions: levelIncludes[level],
    exclusions: ['Transfers unless selected', 'Paid add-ons', 'Special event upgrades'],
    landmarks: route,
    addOnIds: level === 'Private Charter' ? ['birthday-decor', 'cake'] : [],
    timeSlots: [
      { id: `${categoryId}-${order}-1`, label: 'First Trip', boardingTime: '5:30 PM', sailingTime: '6:00 PM', returnTime: '8:00 PM', days: 'Daily' },
      { id: `${categoryId}-${order}-2`, label: 'Second Trip', boardingTime: '8:00 PM', sailingTime: '8:30 PM', returnTime: '10:30 PM', days: 'Daily' }
    ],
    badges: level === 'Premium' ? ['Most Popular'] : level === '5-Star' ? ['Best Experience'] : [],
    featured: ['Premium', '5-Star', 'Private Charter'].includes(level),
    visible: true,
    order,
    whatsappMessage: `Hello, I want to book the ${location} ${level} package.`,
    notes: ['Final route may change due to marine instructions.', 'Confirm exact boarding point before travel.']
  };
}

const cruisePackages = [
  ...PACKAGE_LEVELS.map((level, index) => cruisePackage('canal', level, index + 1)),
  ...PACKAGE_LEVELS.map((level, index) => cruisePackage('marina', level, index + 1))
];

const yachtPackages = [48, 60, 75].map((feet, index) => ({
  id: `yacht-${feet}`,
  title: `${feet} ft Private Yacht Charter`,
  slug: `${feet}-ft-private-yacht`,
  categoryId: 'yachts',
  level: 'Private Charter',
  shortDescription: `Private ${feet} ft yacht with flexible hourly booking.`,
  description: 'A private charter with editable route, capacity, timing, inclusions and celebration add-ons.',
  originalPrice: 650 + index * 350,
  offerPrice: 500 + index * 300,
  childPrice: 0,
  infantPolicy: 'Infants count toward vessel capacity.',
  image: images.yacht,
  gallery: [images.yacht],
  location: 'Dubai Harbour',
  boardingLocation: 'Dubai Harbour Marina',
  duration: '1 hour minimum',
  capacity: feet === 48 ? 'Up to 12 guests' : feet === 60 ? 'Up to 25 guests' : 'Up to 35 guests',
  seating: 'Indoor salon and open deck seating',
  highlights: ['Dubai Marina', 'JBR', 'Bluewaters', 'Ain Dubai'],
  inclusions: ['Private yacht', 'Captain and crew', 'Water and ice', 'Sound system', 'Fuel for standard route'],
  exclusions: ['Food unless selected', 'Decoration', 'Water sports'],
  landmarks: ['Dubai Marina', 'JBR', 'Bluewaters Island', 'Ain Dubai'],
  addOnIds: ['birthday-decor', 'cake'],
  timeSlots: [{ id: `yacht-${feet}-flex`, label: 'Flexible Hourly Slot', boardingTime: 'Flexible', sailingTime: 'Flexible', returnTime: 'Flexible', days: 'Daily' }],
  badges: index === 1 ? ['Most Booked'] : [],
  featured: index === 1,
  visible: true,
  order: index + 1,
  whatsappMessage: `Hello, I want to book the ${feet} ft private yacht.`,
  notes: ['Route depends on booking duration and weather conditions.']
}));

const safariBase = {
  categoryId: 'safari',
  infantPolicy: 'Infant and child policy must be confirmed before booking.',
  image: images.safari,
  gallery: [images.safari],
  location: 'Dubai desert / Lahbab region',
  duration: '6–7 hours',
  seating: 'Standard camp seating',
  highlights: ['Dune bashing', 'Sunset photo stop', 'Desert camp', 'Live shows'],
  inclusions: ['Desert camp access', 'BBQ dinner', 'Soft drinks and water', 'Live entertainment'],
  exclusions: ['Quad bike', 'Buggy', 'VIP sitting', 'Premium camp unless selected'],
  landmarks: ['Red dunes', 'Sunset stop', 'Desert camp'],
  addOnIds: ['quad-bike', 'dune-buggy', 'vip-sitting', 'premium-camp-upgrade'],
  timeSlots: [{ id: 'safari-afternoon', label: 'Afternoon Departure', boardingTime: '2:30–3:30 PM', sailingTime: 'N/A', returnTime: '9:00–10:00 PM', days: 'Daily' }],
  visible: true,
  notes: ['Pickup time changes by season and location.']
};

const safariPackages = [
  { ...safariBase, id: 'safari-self', title: 'Desert Safari Self Drive', slug: 'desert-safari-self-drive', level: 'Basic', shortDescription: 'Meet directly at the desert assembly point.', description: 'Affordable self-drive safari with standard camp access.', originalPrice: 39, offerPrice: 29, childPrice: 29, boardingLocation: 'Desert meeting point', capacity: 'Per person', badges: ['Lowest Price'], featured: true, order: 1, whatsappMessage: 'Hello, I want the AED 29 Self Drive Desert Safari.' },
  { ...safariBase, id: 'safari-bus', title: 'Desert Safari Bus Pickup', slug: 'desert-safari-bus-pickup', level: 'Economy', shortDescription: 'Shared bus pickup from selected central locations.', description: 'Economy safari package with shared bus transfer.', originalPrice: 69, offerPrice: 49, childPrice: 49, boardingLocation: 'Selected bus pickup point', capacity: 'Per person', badges: [], featured: false, order: 2, whatsappMessage: 'Hello, I want the AED 49 Bus Pickup Desert Safari.' },
  { ...safariBase, id: 'safari-4x4', title: '4x4 Doorstep Pickup & Drop', slug: 'desert-safari-4x4-doorstep', level: 'Standard', shortDescription: 'Shared 4x4 pickup and drop from your location.', description: 'Standard safari with doorstep pickup and drop in a shared 4x4.', originalPrice: 119, offerPrice: 89, childPrice: 79, boardingLocation: 'Doorstep pickup in selected Dubai areas', capacity: 'Per person', badges: ['Best Seller'], featured: true, order: 3, whatsappMessage: 'Hello, I want the AED 89 4x4 Doorstep Desert Safari.' },
  { ...safariBase, id: 'safari-premium', title: 'Premium Camp Desert Safari', slug: 'premium-camp-desert-safari', level: 'Premium', shortDescription: 'Premium camp, upgraded dining and service.', description: 'Premium safari package with an upgraded camp experience.', originalPrice: 249, offerPrice: 199, childPrice: 169, boardingLocation: 'Doorstep pickup in selected Dubai areas', capacity: 'Per person', badges: ['Premium Camp'], featured: true, order: 4, whatsappMessage: 'Hello, I want the AED 199 Premium Camp Safari.', inclusions: [...safariBase.inclusions, 'Premium camp', 'Upgraded buffet', 'Table service'] },
  { ...safariBase, id: 'safari-private-car', title: 'Private Car Desert Safari', slug: 'private-car-desert-safari', level: 'Private Charter', shortDescription: 'Private 4x4 for your group with standard camp.', description: 'Private vehicle safari for one group. Standard camp is included, with optional premium camp or VIP sitting upgrades.', originalPrice: 699, offerPrice: 599, childPrice: 0, boardingLocation: 'Private doorstep pickup', capacity: 'Up to 6 guests', badges: ['Private Car'], featured: true, order: 5, whatsappMessage: 'Hello, I want the AED 599 Private Car Safari.' }
];

export const DEFAULT_SITE_DATA = {
  settings: {
    brandName: 'Get Your Guide Dubai', shortName: 'GYG Dubai', tagline: 'Cruises, yachts and desert experiences, clearly compared.', whatsappNumber: '971500000000', supportPhone: '+971 50 000 0000', supportEmail: 'bookings@example.com', logoUrl: '', primaryColor: '#0b1f33', accentColor: '#d6a756', currency: 'AED', heroImage: images.canal, footerText: 'Dubai experiences with flexible package levels and transparent inclusions.', instagramUrl: '#', facebookUrl: '#'
  },
  navLinks: [
    { id: 'nav-home', label: 'Home', href: '/', visible: true, order: 1 }, { id: 'nav-canal', label: 'Canal Cruises', href: '#canal', visible: true, order: 2 }, { id: 'nav-marina', label: 'Marina Cruises', href: '#marina', visible: true, order: 3 }, { id: 'nav-yachts', label: 'Yachts', href: '#yachts', visible: true, order: 4 }, { id: 'nav-safari', label: 'Desert Safari', href: '#safari', visible: true, order: 5 }
  ],
  sections: [
    { id: 'header', type: 'header', title: 'Header', subtitle: '', visible: true, order: 1 }, { id: 'hero', type: 'hero', title: 'Find the right Dubai experience', subtitle: 'Compare package levels, routes, inclusions and upgrades before booking.', visible: true, order: 2 }, { id: 'categories', type: 'categories', title: 'Explore by experience', subtitle: 'Choose a route, private yacht or desert safari.', visible: true, order: 3 }, { id: 'packages', type: 'packages', title: 'Packages built around your budget', subtitle: 'Basic to 5-Star, plus private charter options.', visible: true, order: 4 }, { id: 'trust', type: 'trust', title: 'Clear inclusions. Flexible upgrades.', subtitle: 'Every package can show exactly what is included, excluded and optional.', visible: true, order: 5 }, { id: 'cta', type: 'cta', title: 'Need help choosing?', subtitle: 'Send your date, guest count and preferred area on WhatsApp.', visible: true, order: 6 }, { id: 'footer', type: 'footer', title: 'Footer', subtitle: '', visible: true, order: 7 }
  ],
  categories: [
    { id: 'canal', name: 'Dubai Canal Cruises', slug: 'dubai-canal', kind: 'cruise', description: 'Dinner cruises through Business Bay, Festival City and Dubai Canal.', image: images.canal, visible: true, order: 1 }, { id: 'marina', name: 'Dubai Marina Cruises', slug: 'dubai-marina', kind: 'cruise', description: 'Marina skyline, JBR, Bluewaters and Ain Dubai views.', image: images.marina, visible: true, order: 2 }, { id: 'yachts', name: 'Private Yacht Charter', slug: 'private-yachts', kind: 'yacht', description: 'Private hourly yachts for birthdays, celebrations and gatherings.', image: images.yacht, visible: true, order: 3 }, { id: 'safari', name: 'Desert Safari', slug: 'desert-safari', kind: 'safari', description: 'Self-drive, bus, 4x4, premium camp and private car options.', image: images.safari, visible: true, order: 4 }
  ],
  addOns: [
    { id: 'quad-bike', name: 'Quad Bike', price: 99, unit: 'per person', description: 'Timed quad bike session in the designated riding area.', visible: true, order: 1 }, { id: 'dune-buggy', name: 'Dune Buggy', price: 399, unit: 'per buggy', description: 'Private buggy ride; capacity and duration can be edited by admin.', visible: true, order: 2 }, { id: 'vip-sitting', name: 'VIP Sitting', price: 50, unit: 'per person', description: 'Table service and reserved seating inside the camp.', visible: true, order: 3 }, { id: 'premium-camp-upgrade', name: 'Premium Camp Upgrade', price: 110, unit: 'per person', description: 'Upgrade a standard camp booking to the premium camp.', visible: true, order: 4 }, { id: 'birthday-decor', name: 'Birthday Decoration', price: 350, unit: 'per setup', description: 'Basic balloon and table decoration.', visible: true, order: 5 }, { id: 'cake', name: 'Celebration Cake', price: 150, unit: 'per cake', description: 'Custom message cake.', visible: true, order: 6 }
  ],
  packages: [...cruisePackages, ...yachtPackages, ...safariPackages],
  updatedAt: new Date().toISOString()
};

export function cloneDefaultData() { return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA)); }
