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
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  florida:
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
  ontario:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  "british-columbia":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
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

function toQuery(value: string): string {
  return value.replace(/-/g, ",");
}

function unsplashUrl(query: string): string {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
}

export function getCityHeroImage(citySlug: string, cityName?: string): string {
  if (cityHeroOverrides[citySlug]) {
    return cityHeroOverrides[citySlug];
  }

  const query = cityName ? cityName : toQuery(citySlug);
  return unsplashUrl(`${query},city,travel,landmark`);
}

export function getCountryHeroImage(
  countrySlug: string,
  countryName?: string
): string {
  if (countryHeroOverrides[countrySlug]) {
    return countryHeroOverrides[countrySlug];
  }

  const query = countryName ? countryName : toQuery(countrySlug);
  return unsplashUrl(`${query},travel,roadtrip,landscape`);
}

export function getStateHeroImage(
  stateSlug: string,
  stateName?: string,
  countryName?: string
): string {
  if (stateHeroOverrides[stateSlug]) {
    return stateHeroOverrides[stateSlug];
  }

  const queryParts = [stateName ?? toQuery(stateSlug), countryName, "travel", "landscape"]
    .filter(Boolean)
    .join(",");

  return unsplashUrl(queryParts);
}

export function getAirportHeroImage(
  iataCode: string,
  airportName?: string,
  cityName?: string
): string {
  if (airportHeroOverrides[iataCode]) {
    return airportHeroOverrides[iataCode];
  }

  const query = [airportName, cityName, "airport", "travel"]
    .filter(Boolean)
    .join(",");

  return unsplashUrl(query || `${iataCode},airport,travel`);
}

export function getGuideHeroImage(
  guideSlug: string,
  guideTitle?: string,
  countryName?: string
): string {
  if (guideHeroOverrides[guideSlug]) {
    return guideHeroOverrides[guideSlug];
  }

  const query = [guideTitle, countryName, "travel", "car rental"]
    .filter(Boolean)
    .join(",");

  return unsplashUrl(query || `${toQuery(guideSlug)},travel`);
}