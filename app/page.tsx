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

function countryUrl(countrySlug: string): string {
  return `/car-rental/${countrySlug}/`;
}

function countryLabel(slug: string): string {
  const map: Record<string, string> = {
    france: "France",
    spain: "Spain",
    italy: "Italy",
    australia: "Australia",
    "united-states": "United States",
  };
  return map[slug] ?? slug;
}

const AFFILIATE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=get_easy_car";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1800&q=80";

const countryMeta: Record<string, { emoji: string; tagline: string }> = {
  france: { emoji: "🇫🇷", tagline: "Cities, airports and driving guidance" },
  spain: { emoji: "🇪🇸", tagline: "Popular coastal and city pickup locations" },
  italy: { emoji: "🇮🇹", tagline: "Historic cities and regional rental hubs" },
  australia: { emoji: "🇦🇺", tagline: "Major airports and urban road-trip routes" },
  "united-states": { emoji: "🇺🇸", tagline: "State, city and airport rental coverage" },
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
};

const airportMeta: Record<string, { city: string; country: string }> = {
  CDG: { city: "Paris", country: "France" },
  LAX: { city: "Los Angeles", country: "USA" },
  MCO: { city: "Orlando", country: "USA" },
  SYD: { city: "Sydney", country: "Australia" },
  MIA: { city: "Miami", country: "USA" },
};

const guideEmoji: Record<string, string> = {
  "renting-a-car-in-france": "🇫🇷",
  "renting-a-car-in-spain": "🇪🇸",
  "renting-a-car-in-italy": "🇮🇹",
  "renting-a-car-in-united-states": "🇺🇸",
  "renting-a-car-in-australia": "🇦🇺",
};

export default function HomePage() {
  const allCountries = readIndex<CountryIndex>("countries.json").filter(
    (c) => c.publication_state === "indexed"
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

  const featuredCountrySlugs = [
    "france",
    "spain",
    "italy",
    "united-states",
    "australia",
  ];

  const featuredCountries = featuredCountrySlugs
    .map((slug) => allCountries.find((c) => c.country_slug === slug))
    .filter(Boolean) as CountryIndex[];

  const featuredCitySlugs = [
    "paris",
    "barcelona",
    "madrid",
    "rome",
    "los-angeles",
    "orlando",
    "sydney",
    "miami",
  ];

  const featuredCities = featuredCitySlugs
    .map((slug) => allCities.find((c) => c.city_slug === slug))
    .filter(Boolean) as CityIndex[];

  const featuredAirportCodes = ["CDG", "LAX", "MCO", "SYD", "MIA"];

  const featuredAirports = featuredAirportCodes
    .map((code) => allAirports.find((a) => a.iata_code === code))
    .filter(Boolean) as AirportIndex[];

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
            <a
              href="#destinations"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Destinations
            </a>
            <a
              href="#cities"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Cities
            </a>
            <a
              href="#airports"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Airports
            </a>
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/90 via-[#163B66]/82 to-[#2C5F95]/68" />

        <div aria-hidden="true" className="absolute inset-0 opacity-[0.08]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="42"
                height="42"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 42 0 L 0 0 0 42"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-16 right-0 w-[620px] h-[620px] rounded-full bg-sky-300/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[460px] h-[460px] rounded-full bg-[#0B1D31]/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 mb-6">
              Airport, city and destination rental guidance
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Find the Right Rental Car with Confidence
            </h1>

            <p className="text-blue-100/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Compare airport and city rental options, explore destination
              guides, and choose the vehicle that fits your trip and budget.
            </p>
          </div>

          <SearchWidget affiliateUrl={AFFILIATE} />

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {[
              {
                label: "Browse Destinations",
                href: "#destinations",
                icon: "🌍",
              },
              {
                label: "Explore Cities",
                href: "#cities",
                icon: "🏙️",
              },
              {
                label: "Search Airports",
                href: "#airports",
                icon: "✈️",
              },
              {
                label: "Read Guides",
                href: "/guide/",
                icon: "📘",
              },
            ].map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition-colors"
                >
                  <div className="text-xl mb-2">{item.icon}</div>
                  <div className="text-white font-semibold text-sm sm:text-base">
                    {item.label}
                  </div>
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition-colors"
                >
                  <div className="text-xl mb-2">{item.icon}</div>
                  <div className="text-white font-semibold text-sm sm:text-base">
                    {item.label}
                  </div>
                </a>
              )
            )}
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

      <section id="destinations" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[#2C5F95] text-sm font-semibold uppercase tracking-widest mb-2">
                Destinations
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Top Car Rental Destinations
              </h2>
              <p className="mt-2 text-slate-500 text-base">
                Explore country hubs with major cities, airports and rental guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {featuredCountries.map((country) => {
              const meta = countryMeta[country.country_slug];
              return (
                <Link
                  key={country.country_slug}
                  href={countryUrl(country.country_slug)}
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
                  <p className="mt-4 text-sm font-semibold text-[#2C5F95]">
                    Explore destination
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cities" className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[#2C5F95] text-sm font-semibold uppercase tracking-widest mb-2">
                Cities
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Popular Rental Cities
              </h2>
              <p className="mt-2 text-slate-500 text-base">
                Explore city-specific rental pages with airport and local guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCities.map((city) => {
              const meta = cityMeta[city.city_slug];
              return (
                <Link
                  key={city.city_slug}
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
                      {meta?.tagline ?? countryLabel(city.country_slug)}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#2C5F95]">
                    View rental options
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="airports" className="py-16 sm:py-20 bg-[#0F2742]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sky-300 text-sm font-semibold uppercase tracking-widest mb-2">
                Airports
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Major Airport Pickup Locations
              </h2>
              <p className="mt-2 text-slate-300 text-base">
                Collect your rental car on arrival at major international airports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {featuredAirports.map((airport) => {
              const meta = airportMeta[airport.iata_code];
              return (
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
                    {meta && (
                      <p className="text-slate-400 text-xs mt-1">
                        {meta.city}, {meta.country}
                      </p>
                    )}
                  </div>
                  <p className="text-sky-300 text-xs font-medium">
                    View airport rental
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F2F6FA] border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="max-w-2xl">
              <p className="text-[#2C5F95] text-sm font-semibold uppercase tracking-widest mb-2">
                Airport Hub
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Browse All Airport Rental Locations
              </h2>
              <p className="mt-3 text-slate-600 text-base leading-relaxed">
                Explore major international airport pickup points, compare rental
                options before you land, and choose the location that fits your trip
                best.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/car-rental/airports/"
                className="inline-flex items-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-sm"
              >
                Browse All Airports
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[#2C5F95] text-sm font-semibold uppercase tracking-widest mb-2">
                Guides
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Car Rental Travel Guides
              </h2>
              <p className="mt-2 text-slate-500 text-base">
                Practical country guides covering what you need before you drive.
              </p>
            </div>
            <Link
              href="/guide/"
              className="shrink-0 text-sm font-semibold text-[#2C5F95] hover:text-[#163B66] hover:underline underline-offset-2 transition-colors"
            >
              Browse all guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allGuides.map((guide) => (
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
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#F2F6FA] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#2C5F95] text-sm font-semibold uppercase tracking-widest mb-2">
              How it Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Smarter Rental Guidance in Three Steps
            </h2>
            <p className="mt-2 text-slate-500 text-base max-w-xl mx-auto">
              Discover, compare and choose with more confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Choose Your Location",
                body: "Search by airport or city and start with the location that fits your trip.",
              },
              {
                num: "2",
                title: "Compare Your Options",
                body: "Review rental choices, destination pages and practical travel guidance.",
              },
              {
                num: "3",
                title: "Book with Confidence",
                body: "Continue to trusted partners and choose the option that suits your budget.",
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
                  <a href="#destinations" className="hover:text-white transition-colors">
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="#cities" className="hover:text-white transition-colors">
                    Cities
                  </a>
                </li>
                <li>
                  <a href="#airports" className="hover:text-white transition-colors">
                    Airports
                  </a>
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
                  <li key={city.city_slug}>
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