import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CountryRecord {
  country_slug: string;
  country_name: string;
  iso_code_2: string;
  iso_code_3: string;
  continent: string;
  has_state_layer: boolean;
  currency_code: string;
  driving_side: "left" | "right";
  minimum_driver_age: number;
  license_requirements: string;
  affiliate_sid_base: string;
  page_type: string;
  canonical_url: string;
  publication_state: string;
  meta_title: string;
  meta_description: string;
  meta_title_template?: string;
  meta_description_template?: string;
  h1: string;
  breadcrumb_path: BreadcrumbItem[];
  schema_types: string[];
  sitemap_include: boolean;
  sitemap_priority: number;
  sitemap_changefreq: string;
  driving_notes?: string;
  toll_information?: string;
  fuel_notes?: string;
  parking_notes?: string;
  seasonal_notes?: string;
  border_crossing_notes?: string;
  data_completeness_score: number;
  last_updated: string;
  created_at: string;
}

export interface StateRecord {
  state_slug: string;
  state_name: string;
  country_slug: string;
  iso_subdivision_code: string;
  has_state_layer: boolean;
  affiliate_sid_base: string;
  page_type: string;
  canonical_url: string;
  publication_state: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  breadcrumb_path: BreadcrumbItem[];
  schema_types: string[];
  sitemap_include: boolean;
  sitemap_priority: number;
  sitemap_changefreq: string;
  data_completeness_score: number;
  last_updated: string;
  created_at: string;
}

export interface CityRecord {
  city_slug: string;
  city_name: string;
  country_slug: string;
  state_slug: string | null;
  has_state_layer: boolean;
  affiliate_sid_base: string;
  page_type: string;
  canonical_url: string;
  publication_state: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro_paragraph: string;
  breadcrumb_path: BreadcrumbItem[];
  faq: FaqItem[];
  schema_types: string[];
  sitemap_include: boolean;
  sitemap_priority: number;
  sitemap_changefreq: string;
  parent_country_slug: string;
  parent_state_slug: string | null;
  airport_slugs: string[];
  downtown_page_exists: boolean;
  intent_pages_published: string[];
  nearby_city_slugs: string[];
  related_guide_slugs: string[];
  driving_notes?: string;
  toll_information?: string;
  fuel_notes?: string;
  parking_notes?: string;
  seasonal_notes?: string;
  data_completeness_score: number;
  last_updated: string;
  created_at: string;
}

export interface AirportRecord {
  iata_code: string;
  airport_slug: string;
  airport_name: string;
  airport_name_short: string;
  city_slug: string;
  country_slug: string;
  state_slug: string | null;
  terminal_info: string;
  pickup_type: "on_site" | "shuttle" | "mixed";
  shuttle_notes: string | null;
  distance_from_city_km: number;
  affiliate_sid_base: string;
  page_type: string;
  canonical_url: string;
  publication_state: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro_paragraph: string;
  breadcrumb_path: BreadcrumbItem[];
  faq: FaqItem[];
  schema_types: string[];
  sitemap_include: boolean;
  sitemap_priority: number;
  sitemap_changefreq: string;
  parent_city_slug: string;
  sibling_airport_iata_codes: string[];
  related_guide_slugs: string[];
  data_completeness_score: number;
  last_updated: string;
  created_at: string;
}

export interface GuideSection {
  section_title: string;
  content: string;
}

export interface GuideRecord {
  guide_slug: string;
  guide_title: string;
  country_slug: string;
  page_type: string;
  canonical_url: string;
  publication_state: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro_paragraph: string;
  sections: GuideSection[];
  faq: FaqItem[];
  breadcrumb_path: BreadcrumbItem[];
  schema_types: string[];
  sitemap_include: boolean;
  sitemap_priority: number;
  sitemap_changefreq: string;
  related_city_slugs: string[];
  related_airport_iata_codes: string[];
  data_completeness_score: number;
  last_updated: string;
  created_at: string;
}

export interface CountryIndexEntry {
  country_slug: string;
  country_name: string;
  has_state_layer: boolean;
  publication_state: string;
}

export interface StateIndexEntry {
  state_slug: string;
  state_name: string;
  country_slug: string;
  iso_subdivision_code: string;
  publication_state: string;
}

export interface CityIndexEntry {
  city_slug: string;
  city_name: string;
  country_slug: string;
  state_slug: string | null;
  has_state_layer: boolean;
  publication_state: string;
}

export interface AirportIndexEntry {
  iata_code: string;
  airport_slug: string;
  airport_name: string;
  city_slug: string;
  country_slug: string;
  state_slug: string | null;
  publication_state: string;
}

export interface GuideIndexEntry {
  guide_slug: string;
  guide_title: string;
  country_slug: string;
  publication_state: string;
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readJsonDirectory<T>(dir: string): Promise<T[]> {
  try {
    const entries = await fs.readdir(dir);
    const jsonFiles = entries.filter((file) => file.endsWith(".json"));
    const results = await Promise.all(
      jsonFiles.map((file) => readJsonFile<T>(path.join(dir, file)))
    );
    return results.filter((item): item is T => item !== null);
  } catch {
    return [];
  }
}

async function readIndexFile<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, "index", filename);
  const result = await readJsonFile<T[]>(filePath);
  return result ?? [];
}

function countrySlugToIso2(countrySlug: string): string {
  const map: Record<string, string> = {
    "united-states": "us",
    australia: "au",
    france: "fr",
    spain: "es",
    italy: "it",
    canada: "ca",
  };

  return map[countrySlug] ?? countrySlug.slice(0, 2).toLowerCase();
}

export async function getCountriesIndex(): Promise<CountryIndexEntry[]> {
  const entries = await readIndexFile<CountryIndexEntry>("countries.json");
  return entries.filter((entry) => entry.publication_state === "indexed");
}

export async function getStatesIndex(): Promise<StateIndexEntry[]> {
  const entries = await readIndexFile<StateIndexEntry>("states.json");
  return entries.filter((entry) => entry.publication_state === "indexed");
}

export async function getCitiesIndex(): Promise<CityIndexEntry[]> {
  const entries = await readIndexFile<CityIndexEntry>("cities.json");
  return entries.filter((entry) => entry.publication_state === "indexed");
}

export async function getAirportsIndex(): Promise<AirportIndexEntry[]> {
  const entries = await readIndexFile<AirportIndexEntry>("airports.json");
  return entries.filter((entry) => entry.publication_state === "indexed");
}

export async function getGuidesIndex(): Promise<GuideIndexEntry[]> {
  const entries = await readIndexFile<GuideIndexEntry>("guides.json");
  return entries.filter((entry) => entry.publication_state === "indexed");
}

export async function getCountries(): Promise<CountryRecord[]> {
  const records = await readJsonDirectory<CountryRecord>(
    path.join(DATA_DIR, "countries")
  );
  return records.filter((record) => record.publication_state === "indexed");
}

export async function getStates(): Promise<StateRecord[]> {
  const records = await readJsonDirectory<StateRecord>(
    path.join(DATA_DIR, "states")
  );
  return records.filter((record) => record.publication_state === "indexed");
}

export async function getCities(): Promise<CityRecord[]> {
  const records = await readJsonDirectory<CityRecord>(
    path.join(DATA_DIR, "cities")
  );
  return records.filter((record) => record.publication_state === "indexed");
}

export async function getAirports(): Promise<AirportRecord[]> {
  const records = await readJsonDirectory<AirportRecord>(
    path.join(DATA_DIR, "airports")
  );
  return records.filter((record) => record.publication_state === "indexed");
}

export async function getGuides(): Promise<GuideRecord[]> {
  const records = await readJsonDirectory<GuideRecord>(
    path.join(DATA_DIR, "guides")
  );
  return records.filter((record) => record.publication_state === "indexed");
}

export async function getCountryBySlug(
  countrySlug: string
): Promise<CountryRecord | null> {
  return readJsonFile<CountryRecord>(
    path.join(DATA_DIR, "countries", `${countrySlug}.json`)
  );
}

export async function getStateBySlug(
  stateSlug: string,
  countryIso2: string
): Promise<StateRecord | null> {
  return readJsonFile<StateRecord>(
    path.join(DATA_DIR, "states", `${stateSlug}-${countryIso2.toLowerCase()}.json`)
  );
}

export async function getCityBySlug(
  citySlug: string,
  countrySlug: string,
  stateSlug?: string | null
): Promise<CityRecord | null> {
  const citiesDir = path.join(DATA_DIR, "cities");

  if (stateSlug) {
    const stateLayerFile = `${citySlug}-${stateSlug}-${countrySlugToIso2(
      countrySlug
    )}.json`;

    const exactStateMatch = await readJsonFile<CityRecord>(
      path.join(citiesDir, stateLayerFile)
    );

    if (exactStateMatch) {
      return exactStateMatch;
    }
  }

  const noStateFile = `${citySlug}-${countrySlug}.json`;
  const exactNoStateMatch = await readJsonFile<CityRecord>(
    path.join(citiesDir, noStateFile)
  );

  if (exactNoStateMatch) {
    return exactNoStateMatch;
  }

  try {
    const files = await fs.readdir(citiesDir);

    const fallback = files.find((file) => {
      if (!file.endsWith(".json")) return false;
      if (!file.startsWith(`${citySlug}-`)) return false;

      if (stateSlug) {
        return file.includes(`-${stateSlug}-`);
      }

      return (
        file === `${citySlug}-${countrySlug}.json` ||
        file.startsWith(`${citySlug}-`)
      );
    });

    if (!fallback) {
      return null;
    }

    return readJsonFile<CityRecord>(path.join(citiesDir, fallback));
  } catch {
    return null;
  }
}

export async function getAirportByIata(
  iataCode: string
): Promise<AirportRecord | null> {
  return readJsonFile<AirportRecord>(
    path.join(DATA_DIR, "airports", `${iataCode.toLowerCase()}.json`)
  );
}

export async function getAirportBySlug(
  airportSlug: string
): Promise<AirportRecord | null> {
  const iataCode = airportSlug.split("-")[0];
  if (!iataCode) return null;
  return getAirportByIata(iataCode);
}

export async function getGuideBySlug(
  guideSlug: string
): Promise<GuideRecord | null> {
  return readJsonFile<GuideRecord>(
    path.join(DATA_DIR, "guides", `${guideSlug}.json`)
  );
}

export async function getCitiesByCountry(
  countrySlug: string
): Promise<CityIndexEntry[]> {
  const index = await getCitiesIndex();
  return index.filter((city) => city.country_slug === countrySlug);
}

export async function getCitiesByState(
  stateSlug: string
): Promise<CityIndexEntry[]> {
  const index = await getCitiesIndex();
  return index.filter((city) => city.state_slug === stateSlug);
}

export async function getStatesByCountry(
  countrySlug: string
): Promise<StateIndexEntry[]> {
  const index = await getStatesIndex();
  return index.filter((state) => state.country_slug === countrySlug);
}

export async function getAirportsByCity(
  citySlug: string
): Promise<AirportIndexEntry[]> {
  const index = await getAirportsIndex();
  return index.filter((airport) => airport.city_slug === citySlug);
}

export async function getAirportsByCountry(
  countrySlug: string
): Promise<AirportIndexEntry[]> {
  const index = await getAirportsIndex();
  return index.filter((airport) => airport.country_slug === countrySlug);
}

export async function getGuidesByCountry(
  countrySlug: string
): Promise<GuideIndexEntry[]> {
  const index = await getGuidesIndex();
  return index.filter((guide) => guide.country_slug === countrySlug);
}

export async function resolveAirports(
  iataCodes: string[]
): Promise<AirportRecord[]> {
  const results = await Promise.all(
    iataCodes.map((code) => getAirportByIata(code))
  );
  return results.filter((item): item is AirportRecord => item !== null);
}

export async function resolveGuides(
  guideSlugs: string[]
): Promise<GuideRecord[]> {
  const results = await Promise.all(
    guideSlugs.map((slug) => getGuideBySlug(slug))
  );
  return results.filter((item): item is GuideRecord => item !== null);
}

export async function resolveNearbyCities(
  nearbySlugs: string[]
): Promise<CityIndexEntry[]> {
  const index = await getCitiesIndex();
  return nearbySlugs
    .map((slug) => index.find((city) => city.city_slug === slug))
    .filter((city): city is CityIndexEntry => city !== undefined);
}