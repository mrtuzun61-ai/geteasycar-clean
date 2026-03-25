const cityHeroOverrides: Record<string, string> = {
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  rome:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
  barcelona:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=80",
  madrid:
    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80",
  "los-angeles":
    "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1600&q=80",
  orlando:
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1600&q=80",
  sydney:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
  miami:
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
  istanbul:
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
  london:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
  toronto:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  vancouver:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  "new-york":
    "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1600&q=80",
  chicago:
    "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1600&q=80",
  "las-vegas":
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  montreal:
    "https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=1600&q=80",
  calgary:
    "https://images.unsplash.com/photo-1511203466129-824e631920d4?auto=format&fit=crop&w=1600&q=80",
  brisbane:
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80",
  melbourne:
    "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1600&q=80",
  perth:
    "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?auto=format&fit=crop&w=1600&q=80",
};

const countryHeroOverrides: Record<string, string> = {
  france:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  spain:
    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80",
  italy:
    "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1600&q=80",
  australia:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
  "united-states":
    "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=80",
  turkey:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80",
  canada:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  "united-kingdom":
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
  uae:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
};

const stateHeroOverrides: Record<string, string> = {
  california:
    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1600&q=80",
  florida:
    "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=1600&q=80",
  "new-york":
    "https://images.unsplash.com/photo-1496588152823-ecc7f4df4b16?auto=format&fit=crop&w=1600&q=80",
  nevada:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  illinois:
    "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1600&q=80",
  ontario:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  "british-columbia":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  "new-south-wales":
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
  victoria:
    "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1600&q=80",
  queensland:
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80",
};

const airportHeroOverrides: Record<string, string> = {
  CDG:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  LAX:
    "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1600&q=80",
  MCO:
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1600&q=80",
  SYD:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
  MIA:
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
  IST:
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
  YYZ:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  YVR:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
};

const guideHeroOverrides: Record<string, string> = {
  "renting-a-car-in-france":
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  "renting-a-car-in-spain":
    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80",
  "renting-a-car-in-italy":
    "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1600&q=80",
  "renting-a-car-in-united-states":
    "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=80",
  "renting-a-car-in-australia":
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
  "renting-a-car-in-turkey":
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80",
  "renting-a-car-in-canada":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
};

const cityFallbackPool = [
  "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
];

const countryFallbackPool = [
  "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
];

const stateFallbackPool = [
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1496588152823-ecc7f4df4b16?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80",
];

const airportFallbackPool = [
  "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
];

const guideFallbackPool = [
  "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickDeterministic(values: string[], seed: string): string {
  return values[hashString(seed) % values.length];
}

export function getCountryHeroImage(
  countrySlug: string,
  countryName?: string
): string {
  const slug = normalize(countrySlug);

  if (countryHeroOverrides[slug]) {
    return countryHeroOverrides[slug];
  }

  return pickDeterministic(
    countryFallbackPool,
    `${slug}:${normalize(countryName ?? slug)}`
  );
}

export function getStateHeroImage(
  stateSlug: string,
  stateName?: string,
  countryName?: string
): string {
  const slug = normalize(stateSlug);

  if (stateHeroOverrides[slug]) {
    return stateHeroOverrides[slug];
  }

  if (countryName) {
    const countrySlug = normalize(countryName.replace(/\s+/g, "-"));
    if (countryHeroOverrides[countrySlug]) {
      return countryHeroOverrides[countrySlug];
    }
  }

  return pickDeterministic(
    stateFallbackPool,
    `${slug}:${normalize(stateName ?? slug)}:${normalize(countryName ?? "")}`
  );
}

export function getCityHeroImage(citySlug: string, cityName?: string): string {
  const slug = normalize(citySlug);

  if (cityHeroOverrides[slug]) {
    return cityHeroOverrides[slug];
  }

  return pickDeterministic(
    cityFallbackPool,
    `${slug}:${normalize(cityName ?? slug)}`
  );
}

export function getAirportHeroImage(
  iataCode: string,
  airportName?: string,
  cityName?: string
): string {
  const code = normalize(iataCode).toUpperCase();

  if (airportHeroOverrides[code]) {
    return airportHeroOverrides[code];
  }

  if (cityName) {
    const derivedCitySlug = normalize(cityName.replace(/\s+/g, "-"));
    if (cityHeroOverrides[derivedCitySlug]) {
      return cityHeroOverrides[derivedCitySlug];
    }
  }

  return pickDeterministic(
    airportFallbackPool,
    `${code}:${normalize(airportName ?? "")}:${normalize(cityName ?? "")}`
  );
}

export function getGuideHeroImage(
  guideSlug: string,
  guideTitle?: string,
  countryName?: string
): string {
  const slug = normalize(guideSlug);

  if (guideHeroOverrides[slug]) {
    return guideHeroOverrides[slug];
  }

  if (countryName) {
    const derivedCountrySlug = normalize(countryName.replace(/\s+/g, "-"));
    if (countryHeroOverrides[derivedCountrySlug]) {
      return countryHeroOverrides[derivedCountrySlug];
    }
  }

  return pickDeterministic(
    guideFallbackPool,
    `${slug}:${normalize(guideTitle ?? "")}:${normalize(countryName ?? "")}`
  );
}