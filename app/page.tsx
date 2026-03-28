import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import SearchWidget from "@/components/SearchWidget";

export const metadata: Metadata = {
  title: "GetEasyCar — Smarter Car Rental Guidance for Airports, Cities and Destinations",
  description:
    "Compare car rental options across airports, cities, and destinations. Explore country guides, discover pickup locations, and choose the right rental car with confidence.",
  alternates: { canonical: "https://geteasycar.com/" },
  openGraph: {
    title: "GetEasyCar — Smarter Car Rental Guidance for Airports, Cities and Destinations",
    description:
      "Compare car rental options across airports, cities, and destinations with trusted travel guidance.",
    url: "https://geteasycar.com/",
    siteName: "GetEasyCar",
    type: "website",
  },
};

interface CountryIndex {
  country_slug: string;
  country_name: string;
  publication_state: string;
  has_state_layer?: boolean;
}

interface StateIndex {
  state_slug: string;
  state_name: string;
  country_slug: string;
  publication_state: string;
}

interface CityIndex {
  city_slug: string;
  city_name: string;
  country_slug: string;
  state_slug: string | null;
  has_state_layer: boolean;
  publication_state: string;
}

interface AirportIndex {
  iata_code: string;
  airport_slug: string;
  airport_name: string;
  city_slug: string;
  country_slug: string;
  state_slug: string | null;
  publication_state: string;
}

interface GuideIndex {
  guide_slug: string;
  guide_title: string;
  country_slug: string;
  publication_state: string;
}

function readIndex<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), "data", "index", filename);
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[];
  } catch {
    return [];
  }
}

function cityUrl(city: CityIndex): string {
  if (city.has_state_layer && city.state_slug) {
    return `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`;
  }
  return `/city-rental/${city.country_slug}/${city.city_slug}/`;
}

function countryUrl(country: CountryIndex): string {
  if (country.has_state_layer) {
    return `/car-rental/${country.country_slug}/`;
  }
  return `/city-rental/${country.country_slug}/`;
}

function formatSlug(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const AFFILIATE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=get_easy_car";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=2000&q=80";

const countryMeta: Record<string, { emoji: string; tagline: string }> = {
  france: { emoji: "🇫🇷", tagline: "Cities, airports and driving guidance" },
  spain: { emoji: "🇪🇸", tagline: "Popular coastal and city pickup locations" },
  italy: { emoji: "🇮🇹", tagline: "Historic cities and regional rental hubs" },
  australia: { emoji: "🇦🇺", tagline: "Major airports and urban road-trip routes" },
  "united-states": { emoji: "🇺🇸", tagline: "State, city and airport rental coverage" },
  canada: { emoji: "🇨🇦", tagline: "Province, city and airport rental coverage" },
  germany: { emoji: "🇩🇪", tagline: "Business hubs and airport-connected cities" },
  portugal: { emoji: "🇵🇹", tagline: "Gateway cities and leisure destinations" },
  "united-kingdom": { emoji: "🇬🇧", tagline: "Direct access to major rental cities" },
  turkey: { emoji: "🇹🇷", tagline: "Airport-led and city-led rental journeys" },
  "united-arab-emirates": { emoji: "🇦🇪", tagline: "High-intent airport and city demand" },
};

const cityMeta: Record<string, { emoji: string; tagline: string }> = {
  paris: { emoji: "🇫🇷", tagline: "City of Light" },
  barcelona: { emoji: "🇪🇸", tagline: "Catalonian Coast" },
  madrid: { emoji: "🇪🇸", tagline: "Heart of Spain" },
  rome: { emoji: "🇮🇹", tagline: "The Eternal City" },
  "los-angeles": { emoji: "🇺🇸", tagline: "Southern California" },
  orlando: { emoji: "🇺🇸", tagline: "Theme Park Capital" },
  sydney: { emoji: "🇦🇺", tagline: "Harbour City" },
  miami: { emoji: "🇺🇸", tagline: "South Florida" },
  toronto: { emoji: "🇨🇦", tagline: "Ontario Gateway" },
  vancouver: { emoji: "🇨🇦", tagline: "Pacific Coast Hub" },
  london: { emoji: "🇬🇧", tagline: "Global Gateway" },
  dubai: { emoji: "🇦🇪", tagline: "Gulf Megacity" },
  chicago: { emoji: "🇺🇸", tagline: "Midwest Hub" },
  dallas: { emoji: "🇺🇸", tagline: "Texas Gateway" },
};

const guideEmoji: Record<string, string> = {
  "renting-a-car-in-france": "🇫🇷",
  "renting-a-car-in-spain": "🇪🇸",
  "renting-a-car-in-italy": "🇮🇹",
  "renting-a-car-in-united-states": "🇺🇸",
  "renting-a-car-in-australia": "🇦🇺",
  "renting-a-car-in-canada": "🇨🇦",
};

function SectionHeading({
  label,
  title,
  subtitle,
  light = false,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8">
      {label && (
        <p
          className={`text-xs font-bold uppercase tracking-widest mb-2 ${
            light ? "text-sky-300" : "text-[#2C5F95]"
          }`}
        >
          {label}
        </p>
      )}
      <h2
        className={`text-2xl sm:text-3xl font-bold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2 text-base max-w-2xl ${
            light ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const allCountries = readIndex<CountryIndex>("countries.json").filter(
    (c) => c.publication_state === "indexed"
  );

  const allStates = readIndex<StateIndex>("states.json").filter(
    (s) => s.publication_state === "indexed"
  );

  const allCities = readIndex<CityIndex>("cities.json").filter(
    (c) => c.publication_state === "indexed"
  );

  const allAirports = readIndex<AirportIndex>("airports.json").filter(
    (a) => a.publication_state === "indexed"
  );

  const allGuides = readIndex<GuideIndex>("guides.json").filter(
    (g) => g.publication_state === "indexed"
  );

  const countriesWithCounts = allCountries
    .map((country) => {
      const cityCount = allCities.filter(
        (city) => city.country_slug === country.country_slug
      ).length;
      const airportCount = allAirports.filter(
        (airport) => airport.country_slug === country.country_slug
      ).length;
      const guideCount = allGuides.filter(
        (guide) => guide.country_slug === country.country_slug
      ).length;
      const stateCount = allStates.filter(
        (state) => state.country_slug === country.country_slug
      ).length;

      return {
        ...country,
        cityCount,
        airportCount,
        guideCount,
        stateCount,
        score: cityCount * 3 + airportCount * 4 + guideCount * 2 + stateCount,
      };
    })
    .sort((a, b) => b.score - a.score);

  const featuredCountries = countriesWithCounts.slice(0, 8);

  const featuredCities = allCities
    .map((city) => {
      const airportCount = allAirports.filter(
        (airport) =>
          airport.city_slug === city.city_slug &&
          airport.country_slug === city.country_slug &&
          (airport.state_slug ?? null) === (city.state_slug ?? null)
      ).length;

      return {
        ...city,
        airportCount,
      };
    })
    .sort((a, b) => {
      if (b.airportCount !== a.airportCount) return b.airportCount - a.airportCount;
      return a.city_name.localeCompare(b.city_name);
    })
    .slice(0, 12);

  const featuredAirports = [...allAirports]
    .sort((a, b) => a.iata_code.localeCompare(b.iata_code))
    .slice(0, 8);

  const featuredStates = allStates.slice(0, 8);
  const featuredGuides = allGuides.slice(0, 6);

  const denseCityLinks = allCities.slice(0, 18);
  const denseCountryLinks = countriesWithCounts.slice(0, 12);
  const denseAirportLinks = allAirports.slice(0, 12);

  const heroQuickLinks = [
    { label: "Cities", href: "/cities", icon: "🏙️" },
    { label: "States", href: "/states", icon: "🗺️" },
    { label: "Airports", href: "/airports", icon: "✈️" },
    { label: "Guides", href: "/guide/", icon: "📘" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#163B66] flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5z" />
                <circle cx="7.5" cy="14.5" r="1.5" />
                <circle cx="16.5" cy="14.5" r="1.5" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="block font-extrabold text-lg tracking-tight text-slate-900">
                GetEasyCar
              </span>
              <span className="block text-[11px] text-slate-500">
                Smart rental guidance
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              href="/car-rental/"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Destinations
            </Link>
            <Link
              href="/cities"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Cities
            </Link>
            <Link
              href="/states"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              States
            </Link>
            <Link
              href="/airports"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Airports
            </Link>
            <Link
              href="/guide/"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Guides
            </Link>
          </nav>

          <a
            href={AFFILIATE}
            className="shrink-0 bg-[#163B66] hover:bg-[#1E4C82] active:bg-[#143454] text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            Compare Cars
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Airport car rental pickup"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/85 via-[#163B66]/72 to-[#2C5F95]/40" />

        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-16 right-0 w-[620px] h-[620px] rounded-full bg-sky-300/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[460px] h-[460px] rounded-full bg-[#0B1D31]/22 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 mb-6">
                Airport, city and destination rental guidance
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
                Find the Right Rental Car Before You Land
              </h1>

              <p className="text-blue-50 text-lg sm:text-xl leading-relaxed max-w-2xl">
                Compare airport pickup options, city rentals, and destination pages
                to choose the smartest rental strategy before your trip begins.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={AFFILIATE}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Compare Car Rentals
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>

                <Link
                  href="/airports"
                  className="inline-flex items-center justify-center gap-2 bg-white/12 hover:bg-white/18 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                >
                  Browse Airport Guides
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
                <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                    Airports Indexed
                  </p>
                  <p className="mt-1 text-white font-semibold">{allAirports.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                    Cities Indexed
                  </p>
                  <p className="mt-1 text-white font-semibold">{allCities.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                    States Indexed
                  </p>
                  <p className="mt-1 text-white font-semibold">{allStates.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                    Country Hubs
                  </p>
                  <p className="mt-1 text-white font-semibold">{allCountries.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/12 backdrop-blur-sm p-5 sm:p-6">
              <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                Start your search
              </p>
              <SearchWidget affiliateUrl={AFFILIATE} />
              <div className="mt-6 grid grid-cols-2 gap-3">
                {heroQuickLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition-colors"
                  >
                    <div className="text-xl mb-2">{item.icon}</div>
                    <div className="text-white font-semibold text-sm sm:text-base">
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "Free cancellation where available",
              "No platform booking fees",
              "Trusted rental partners",
              "Airport and city coverage",
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F7F9FC] px-4 py-3"
              >
                <span className="w-8 h-8 rounded-full bg-[#E8F1FB] text-[#1E4C82] flex items-center justify-center font-bold">
                  ✓
                </span>
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Smart Rental System"
            title="Plan your rental the smart way"
            subtitle="Use practical travel logic before you book, not just a price list."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Choose airport vs city pickup",
                body: "Some trips are easier and cheaper with an airport pickup. Others are better with a downtown location.",
              },
              {
                title: "Compare before arrival",
                body: "Avoid rushed decisions at the terminal by checking pickup options and route logic first.",
              },
              {
                title: "Understand insurance traps",
                body: "Know what your card covers and what the supplier may still try to sell at the desk.",
              },
              {
                title: "Avoid hidden fees",
                body: "Fuel, extra drivers, young driver fees, and pickup surcharges can change the real price.",
              },
              {
                title: "Pick the right car size",
                body: "Choose a vehicle that matches your luggage, road conditions, and parking reality.",
              },
              {
                title: "Plan your route ahead",
                body: "Check airport exits, toll roads, and parking before pickup to avoid stress after landing.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6 hover:bg-white transition-colors"
              >
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Destinations"
            title="Top car rental destinations"
            subtitle="Explore country hubs with major cities, airports and rental guidance."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCountries.map((country) => {
              const meta = countryMeta[country.country_slug];
              return (
                <Link
                  key={country.country_slug}
                  href={countryUrl(country)}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 hover:border-[#B7CDE3] hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{meta?.emoji ?? "🌍"}</span>
                    <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                      →
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-[#163B66] transition-colors">
                    {country.country_name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {meta?.tagline ?? "Explore rental locations and guides"}
                  </p>
                  <p className="mt-4 text-xs text-slate-400">
                    {country.cityCount} cities · {country.airportCount} airports
                    {country.stateCount > 0 ? ` · ${country.stateCount} states` : ""}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Cities"
            title="Popular rental cities"
            subtitle="Explore city-specific rental pages with airport and local guidance."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCities.map((city) => {
              const meta = cityMeta[city.city_slug];
              return (
                <Link
                  key={`${city.country_slug}-${city.state_slug ?? "nostate"}-${city.city_slug}`}
                  href={cityUrl(city)}
                  className="group flex flex-col gap-3 rounded-3xl border border-slate-200 bg-[#FBFCFE] p-5 hover:border-[#B7CDE3] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{meta?.emoji ?? "🌍"}</span>
                    <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                      →
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-tight">
                      {city.city_name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {meta?.tagline ??
                        (city.state_slug
                          ? formatSlug(city.state_slug)
                          : formatSlug(city.country_slug))}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#2C5F95]">
                    View rental options
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-sm"
            >
              Browse All Cities
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Airports"
            title="Major airport pickup locations"
            subtitle="Compare some of the strongest airport pages before you choose your arrival pickup."
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredAirports.map((airport) => (
              <Link
                key={airport.iata_code}
                href={`/car-rental/airports/${airport.airport_slug}/`}
                className="group flex flex-col gap-4 rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-sky-300/40 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center bg-[#2C5F95] text-white text-xs font-bold px-2.5 py-1 rounded-lg tracking-wider">
                    {airport.iata_code}
                  </span>
                  <span className="text-slate-500 group-hover:text-sky-300 transition-colors">
                    →
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm leading-snug">
                    {airport.airport_name}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    {formatSlug(airport.city_slug)}, {formatSlug(airport.country_slug)}
                  </p>
                </div>
                <p className="text-sky-300 text-xs font-medium">
                  View airport rental
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/airports"
              className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-sm"
            >
              Browse All Airport Rental Locations
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Explore"
            title="Popular country, city and airport destinations"
            subtitle="Use quick links to jump directly into high-intent rental pages."
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Cities</h3>
              <ul className="space-y-3 text-sm">
                {denseCityLinks.map((city) => (
                  <li key={`${city.country_slug}-${city.state_slug ?? "nostate"}-${city.city_slug}`}>
                    <Link
                      href={cityUrl(city)}
                      className="text-slate-600 hover:text-[#163B66] transition-colors"
                    >
                      Car Rental {city.city_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Countries</h3>
              <ul className="space-y-3 text-sm">
                {denseCountryLinks.map((country) => (
                  <li key={country.country_slug}>
                    <Link
                      href={countryUrl(country)}
                      className="text-slate-600 hover:text-[#163B66] transition-colors"
                    >
                      Car Rental {country.country_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Airports</h3>
              <ul className="space-y-3 text-sm">
                {denseAirportLinks.map((airport) => (
                  <li key={airport.iata_code}>
                    <Link
                      href={`/car-rental/airports/${airport.airport_slug}/`}
                      className="text-slate-600 hover:text-[#163B66] transition-colors"
                    >
                      {airport.iata_code} Car Rental
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="States"
            title="Explore states and provinces"
            subtitle="Browse the state layer for markets that use deeper location structure."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredStates.map((state) => (
              <Link
                key={`${state.country_slug}-${state.state_slug}`}
                href={`/car-rental/${state.country_slug}/${state.state_slug}/`}
                className="group flex flex-col gap-2 rounded-3xl border border-slate-200 bg-[#FBFCFE] p-5 hover:border-[#B7CDE3] hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🧭</span>
                  <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                    →
                  </span>
                </div>
                <p className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-tight">
                  {state.state_name}
                </p>
                <p className="text-xs text-slate-400">{formatSlug(state.country_slug)}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/states"
              className="inline-flex items-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-sm"
            >
              Browse All States
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Guides"
            title="Car rental travel guides"
            subtitle="Practical country guides covering what you need before you drive."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.guide_slug}
                href={`/guide/${guide.guide_slug}/`}
                className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6 hover:border-[#B7CDE3] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FB] flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#DDEAF8] transition-colors">
                  {guideEmoji[guide.guide_slug] ?? "🗺️"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#2C5F95] uppercase tracking-wide mb-1">
                    Country Guide
                  </p>
                  <h3 className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-snug">
                    {guide.guide_title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Driving rules · Tolls · Fuel · Parking
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors shrink-0 mt-0.5">
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/guide/"
              className="inline-flex items-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-sm"
            >
              Browse All Guides
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#F2F6FA] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#2C5F95] text-sm font-semibold uppercase tracking-widest mb-2">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Smarter rental guidance in three steps
            </h2>
            <p className="mt-2 text-slate-500 text-base max-w-xl mx-auto">
              Discover, compare and choose with more confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Choose Your Pickup Point",
                body: "Start with airport, city, state or destination pages depending on how and when you arrive.",
              },
              {
                num: "2",
                title: "Compare Smarter",
                body: "Review major pickup locations, travel guidance and route context before you book.",
              },
              {
                num: "3",
                title: "Book with Confidence",
                body: "Continue to trusted partners and choose the option that fits your timing and budget.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF2FB] flex items-center justify-center text-[#163B66] font-bold">
                    {item.num}
                  </div>
                  <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">
                    Step {item.num}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#163B66] to-[#0F2742] py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-300/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-wide border border-white/10">
            Trusted by travelers worldwide
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Ready to Compare Rental Options?
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Search airports, cities and destinations to find the rental car that fits your trip.
          </p>
          <a
            href={AFFILIATE}
            className="inline-flex items-center gap-2.5 bg-white text-[#163B66] hover:bg-[#F2F6FA] active:bg-[#EAF2FB] font-extrabold text-base px-8 py-4 rounded-2xl transition-colors shadow-xl"
          >
            Find the Right Car
          </a>
          <p className="mt-5 text-blue-200/70 text-sm">
            Free to use · No booking fees · Trusted rental partners
          </p>
        </div>
      </section>
      <section className="py-20 bg-white border-t border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
      Popular country and city car rental destinations
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">

      {/* COLUMN 1 */}
      <div className="space-y-2">
        <a href="/car-rental/united-arab-emirates/dubai/" className="block hover:text-[#2C5F95]">Car rental Dubai</a>
        <a href="/city-rental/united-kingdom/london/" className="block hover:text-[#2C5F95]">Car hire London</a>
        <a href="/city-rental/united-kingdom/edinburgh/" className="block hover:text-[#2C5F95]">Car hire Edinburgh</a>
        <a href="/city-rental/united-kingdom/birmingham/" className="block hover:text-[#2C5F95]">Car hire Birmingham</a>
        <a href="/city-rental/italy/milan/" className="block hover:text-[#2C5F95]">Car hire Milan</a>
        <a href="/city-rental/italy/florence/" className="block hover:text-[#2C5F95]">Car hire Florence</a>
        <a href="/city-rental/spain/majorca/" className="block hover:text-[#2C5F95]">Car hire Majorca</a>
        <a href="/city-rental/spain/tenerife/" className="block hover:text-[#2C5F95]">Car hire Tenerife</a>
        <a href="/city-rental/spain/ibiza/" className="block hover:text-[#2C5F95]">Car hire Ibiza</a>
        <a href="/city-rental/iceland/reykjavik/" className="block hover:text-[#2C5F95]">Car hire Iceland</a>
        <a href="/city-rental/united-states/las-vegas/" className="block hover:text-[#2C5F95]">Car rental Las Vegas</a>
        <a href="/city-rental/united-states/miami/" className="block hover:text-[#2C5F95]">Car rental Miami</a>
        <a href="/city-rental/united-states/denver/" className="block hover:text-[#2C5F95]">Car rental Denver</a>
        <a href="/city-rental/united-states/san-antonio/" className="block hover:text-[#2C5F95]">Car rental San Antonio</a>
        <a href="/city-rental/united-states/hawaii/" className="block hover:text-[#2C5F95]">Car rental Hawaii</a>
      </div>

      {/* COLUMN 2 */}
      <div className="space-y-2">
        <a href="/car-rental/united-kingdom/" className="block hover:text-[#2C5F95]">Car hire United Kingdom</a>
        <a href="/city-rental/united-kingdom/manchester/" className="block hover:text-[#2C5F95]">Car hire Manchester</a>
        <a href="/city-rental/united-kingdom/glasgow/" className="block hover:text-[#2C5F95]">Car hire Glasgow</a>
        <a href="/car-rental/italy/" className="block hover:text-[#2C5F95]">Car hire Italy</a>
        <a href="/city-rental/italy/rome/" className="block hover:text-[#2C5F95]">Car hire Rome</a>
        <a href="/car-rental/spain/" className="block hover:text-[#2C5F95]">Car hire Spain</a>
        <a href="/city-rental/spain/barcelona/" className="block hover:text-[#2C5F95]">Car hire Barcelona</a>
        <a href="/city-rental/spain/alicante/" className="block hover:text-[#2C5F95]">Car hire Alicante</a>
        <a href="/city-rental/spain/malaga/" className="block hover:text-[#2C5F95]">Car hire Malaga</a>
        <a href="/car-rental/united-states/florida/" className="block hover:text-[#2C5F95]">Car rental USA Florida</a>
        <a href="/city-rental/united-states/orlando/" className="block hover:text-[#2C5F95]">Car rental Orlando</a>
        <a href="/city-rental/united-states/los-angeles/" className="block hover:text-[#2C5F95]">Car rental Los Angeles</a>
        <a href="/city-rental/united-states/new-york/" className="block hover:text-[#2C5F95]">Car rental New York</a>
        <a href="/city-rental/united-states/honolulu/" className="block hover:text-[#2C5F95]">Car rental Honolulu</a>
      </div>

      {/* COLUMN 3 */}
      <div className="space-y-2">
        <a href="/car-rental/australia/" className="block hover:text-[#2C5F95]">Car hire Australia</a>
        <a href="/city-rental/australia/sydney/" className="block hover:text-[#2C5F95]">Car hire Sydney</a>
        <a href="/city-rental/australia/perth/" className="block hover:text-[#2C5F95]">Car hire Perth</a>
        <a href="/city-rental/australia/cairns/" className="block hover:text-[#2C5F95]">Car hire Cairns</a>
        <a href="/city-rental/new-zealand/auckland/" className="block hover:text-[#2C5F95]">Car hire Auckland</a>
        <a href="/car-rental/costa-rica/" className="block hover:text-[#2C5F95]">Car rental Costa Rica</a>
        <a href="/city-rental/ireland/dublin/" className="block hover:text-[#2C5F95]">Car hire Dublin</a>
        <a href="/city-rental/france/paris/" className="block hover:text-[#2C5F95]">Car hire Paris</a>
        <a href="/city-rental/portugal/lisbon/" className="block hover:text-[#2C5F95]">Car hire Lisbon</a>
        <a href="/city-rental/india/goa/" className="block hover:text-[#2C5F95]">Car hire Goa</a>
        <a href="/car-rental/canada/" className="block hover:text-[#2C5F95]">Car rental Canada</a>
        <a href="/city-rental/canada/vancouver/" className="block hover:text-[#2C5F95]">Car rental Vancouver</a>
        <a href="/car-rental/mexico/" className="block hover:text-[#2C5F95]">Car rental Mexico</a>
        <a href="/city-rental/greece/crete/" className="block hover:text-[#2C5F95]">Car hire Crete</a>
        <a href="/city-rental/malta/malta/" className="block hover:text-[#2C5F95]">Car hire Malta</a>
      </div>

    </div>
  </div>
</section>

      <footer className="bg-[#0B1420] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#163B66] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                  </svg>
                </div>
                <span className="font-bold text-white text-base tracking-tight">
                  GetEasyCar
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-4 text-slate-500">
                Smarter car rental guidance for airports, cities and destinations.
              </p>
              <a
                href="mailto:info@geteasycar.com"
                className="text-sm text-sky-300 hover:text-sky-200 transition-colors"
              >
                info@geteasycar.com
              </a>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs mb-4 uppercase tracking-widest">
                Explore
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/car-rental/" className="hover:text-white transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/cities" className="hover:text-white transition-colors">
                    Cities
                  </Link>
                </li>
                <li>
                  <Link href="/states" className="hover:text-white transition-colors">
                    States
                  </Link>
                </li>
                <li>
                  <Link href="/airports" className="hover:text-white transition-colors">
                    Airports
                  </Link>
                </li>
                <li>
                  <Link href="/guide/" className="hover:text-white transition-colors">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs mb-4 uppercase tracking-widest">
                Popular Cities
              </h4>
              <ul className="space-y-3 text-sm">
                {featuredCities.slice(0, 5).map((city) => (
                  <li key={`${city.country_slug}-${city.state_slug ?? "nostate"}-${city.city_slug}`}>
                    <Link
                      href={cityUrl(city)}
                      className="hover:text-white transition-colors"
                    >
                      {city.city_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs mb-4 uppercase tracking-widest">
                Major Airports
              </h4>
              <ul className="space-y-3 text-sm">
                {featuredAirports.map((airport) => (
                  <li key={airport.iata_code}>
                    <Link
                      href={`/car-rental/airports/${airport.airport_slug}/`}
                      className="hover:text-white transition-colors"
                    >
                      {airport.iata_code} — {airport.airport_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} GetEasyCar. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/privacy/" className="hover:text-slate-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms/" className="hover:text-slate-400 transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}