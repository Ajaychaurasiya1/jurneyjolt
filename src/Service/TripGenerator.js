const DAY_THEMES = [
  {
    title: "Arrival & City Highlights",
    summary: "Get oriented with iconic landmarks, local markets, and the best first-day views.",
    places: [
      { name: "Historic City Center", category: "Landmark", duration: "2-3 hours" },
      { name: "Central Market District", category: "Shopping", duration: "1-2 hours" },
      { name: "Sunset Viewpoint", category: "Scenic", duration: "1 hour" },
      { name: "Old Town Walking Tour", category: "Culture", duration: "2 hours" },
    ],
  },
  {
    title: "Culture & Heritage",
    summary: "Dive into museums, architecture, and stories that define the destination.",
    places: [
      { name: "National History Museum", category: "Museum", duration: "2-3 hours" },
      { name: "Heritage Quarter", category: "Architecture", duration: "2 hours" },
      { name: "Art & Culture District", category: "Art", duration: "2 hours" },
      { name: "Local Craft Workshop", category: "Experience", duration: "1.5 hours" },
    ],
  },
  {
    title: "Nature & Relaxation",
    summary: "Slow down with parks, waterfront walks, and peaceful green escapes.",
    places: [
      { name: "City Botanical Garden", category: "Nature", duration: "2 hours" },
      { name: "Riverside Promenade", category: "Walk", duration: "1.5 hours" },
      { name: "Urban Park & Lake", category: "Nature", duration: "2 hours" },
      { name: "Wellness & Spa District", category: "Relaxation", duration: "3 hours" },
    ],
  },
  {
    title: "Food & Local Life",
    summary: "Taste regional flavors, explore food streets, and experience everyday local life.",
    places: [
      { name: "Famous Food Street", category: "Food", duration: "2 hours" },
      { name: "Traditional Local Bazaar", category: "Market", duration: "2 hours" },
      { name: "Cafe & Bakery Lane", category: "Food", duration: "1.5 hours" },
      { name: "Night Market Experience", category: "Nightlife", duration: "2 hours" },
    ],
  },
  {
    title: "Hidden Gems & Farewell",
    summary: "Discover offbeat spots and wrap up with memorable final experiences.",
    places: [
      { name: "Secret Viewpoint", category: "Scenic", duration: "1.5 hours" },
      { name: "Hidden Alley Neighborhood", category: "Explore", duration: "2 hours" },
      { name: "Handicraft Village", category: "Culture", duration: "2 hours" },
      { name: "Farewell Dinner District", category: "Food", duration: "2 hours" },
    ],
  },
];

const BUDGET_CONFIG = {
  Cheap: {
    hotelPrice: "₹800 - ₹2,500 per night",
    entryPrice: "₹20 - ₹150 per person",
    foodPrice: "₹200 - ₹500 per person",
    dailyTotal: "₹1,500 - ₹3,500 per day",
    transport: "Public buses, metro & walking",
  },
  Moderate: {
    hotelPrice: "₹3,000 - ₹8,000 per night",
    entryPrice: "₹100 - ₹500 per person",
    foodPrice: "₹500 - ₹1,200 per person",
    dailyTotal: "₹5,000 - ₹12,000 per day",
    transport: "Mix of metro, taxis & ride-share",
  },
  Luxury: {
    hotelPrice: "₹10,000 - ₹25,000 per night",
    entryPrice: "₹500 - ₹2,000 per person",
    foodPrice: "₹1,500 - ₹3,500 per person",
    dailyTotal: "₹15,000 - ₹35,000 per day",
    transport: "Private cabs & premium transfers",
  },
};

const HOTEL_TEMPLATES = [
  { suffix: "Grand", type: "Heritage", amenities: ["WiFi", "Restaurant", "Concierge", "City View"] },
  { suffix: "Regency", type: "Boutique", amenities: ["WiFi", "Breakfast", "Gym", "Rooftop Bar"] },
  { suffix: "Residency", type: "Comfort", amenities: ["WiFi", "Parking", "Room Service", "Laundry"] },
  { suffix: "Suites", type: "Premium", amenities: ["WiFi", "Pool", "Spa", "Airport Shuttle"] },
];

const FOOD_BY_BUDGET = {
  Cheap: ["Street food stalls", "Local thali restaurants", "Budget cafes"],
  Moderate: ["Regional cuisine restaurants", "Popular food courts", "Rooftop casual dining"],
  Luxury: ["Fine dining restaurants", "Chef's tasting menus", "Premium rooftop lounges"],
};

function getCityName(location) {
  return location?.split(",")[0]?.trim() || location || "Destination";
}

function imageUrl(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
}

function mapUrl(query) {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

function buildHotel(city, index, budget) {
  const template = HOTEL_TEMPLATES[index % HOTEL_TEMPLATES.length];
  const name = `${template.suffix} ${city} ${index === 2 ? "Suites" : "Hotel"}`;
  const prices = BUDGET_CONFIG[budget] || BUDGET_CONFIG.Moderate;

  return {
    name,
    description: `A ${budget.toLowerCase()} ${template.type.toLowerCase()} hotel in ${city} with excellent access to attractions, comfortable rooms, and trusted hospitality.`,
    address: `${city} City Center, ${city}`,
    rating: Number((4.6 - index * 0.15).toFixed(1)),
    price: prices.hotelPrice,
    location: mapUrl(`${name}, ${city}`),
    coordinates: "",
    image_url: imageUrl(`${city}-hotel-${index}`),
    amenities: template.amenities,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
  };
}

function buildPlace(city, placeInfo, budget, dayIndex) {
  const prices = BUDGET_CONFIG[budget] || BUDGET_CONFIG.Moderate;
  const isFree =
    placeInfo.category === "Walk" ||
    placeInfo.name.includes("Promenade") ||
    placeInfo.name.includes("Viewpoint");

  return {
    name: `${placeInfo.name} - ${city}`,
    details: `Visit ${placeInfo.name.toLowerCase()} in ${city}. Perfect for ${placeInfo.category.toLowerCase()} lovers exploring on day ${dayIndex + 1}.`,
    pricing: isFree ? "Free entry" : `Entry: ${prices.entryPrice}`,
    timings: placeInfo.category === "Nightlife" ? "5:00 PM - 11:00 PM" : "9:00 AM - 7:00 PM",
    image_url: imageUrl(`${city}-${placeInfo.name}-${dayIndex}`),
    location: mapUrl(`${placeInfo.name}, ${city}`),
    address: `${placeInfo.name}, ${city}`,
    category: placeInfo.category,
    duration: placeInfo.duration,
    tip: `Best visited in the ${placeInfo.category === "Nightlife" ? "evening" : "morning"} for fewer crowds.`,
  };
}

function buildFoodGuide(city, budget) {
  const cuisines = FOOD_BY_BUDGET[budget] || FOOD_BY_BUDGET.Moderate;
  return cuisines.map((cuisine, i) => ({
    name: `${cuisine} in ${city}`,
    cuisine: cuisine.split(" ")[0],
    price: BUDGET_CONFIG[budget]?.foodPrice || BUDGET_CONFIG.Moderate.foodPrice,
    description: `Highly rated ${cuisine.toLowerCase()} experience loved by travelers.`,
    image_url: imageUrl(`${city}-food-${i}`),
  }));
}

export function generateLocalTrip({ location, noOfDays, People, Budget }) {
  const city = getCityName(location);
  const days = Math.min(Math.max(Number(noOfDays) || 1, 1), 5);
  const budget = BUDGET_CONFIG[Budget] ? Budget : "Moderate";
  const prices = BUDGET_CONFIG[budget];

  const hotels = [0, 1, 2, 3].map((i) => buildHotel(city, i, budget));

  const itinerary = Array.from({ length: days }, (_, dayIndex) => {
    const theme = DAY_THEMES[dayIndex % DAY_THEMES.length];
    return {
      day: dayIndex + 1,
      title: theme.title,
      summary: theme.summary,
      places: theme.places.map((placeInfo) =>
        buildPlace(city, placeInfo, budget, dayIndex)
      ),
    };
  });

  const totalPlaces = itinerary.reduce((sum, day) => sum + day.places.length, 0);

  return {
    location: city,
    duration: days,
    budget,
    people: People,
    overview: `${days}-day ${budget.toLowerCase()} adventure in ${city} tailored for ${People}. Explore ${totalPlaces} curated attractions across ${days} themed days with handpicked stays and local food picks.`,
    bestTimeToVisit: "October to March — pleasant weather and vibrant local festivals.",
    estimatedDailyBudget: prices.dailyTotal,
    transportation: {
      gettingAround: prices.transport,
      airport: `Nearest airport to ${city} — pre-book transfers for a smooth arrival.`,
      localTip: "Download offline maps and keep small cash for local vendors.",
    },
    localTips: [
      `Learn a few local greetings before arriving in ${city}.`,
      "Carry a reusable water bottle and comfortable walking shoes.",
      "Visit popular attractions early morning to avoid peak crowds.",
      "Ask hotel staff for authentic local restaurant recommendations.",
      "Keep digital copies of your ID and hotel bookings handy.",
    ],
    packingList: [
      "Comfortable walking shoes",
      "Light jacket or shawl",
      "Universal power adapter",
      "Sunscreen & sunglasses",
      "Portable charger",
      "Basic first-aid kit",
    ],
    foodRecommendations: buildFoodGuide(city, budget),
    hotels,
    itinerary,
  };
}
