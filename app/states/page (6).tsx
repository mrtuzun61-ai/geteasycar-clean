import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";

export const metadata: Metadata = {
  title: "States and Provinces | GetEasyCar",
  description:
    "Explore states and provinces with rental car city pages, airport links, and deeper regional coverage.",
  alternates: { canonical: "https://geteasycar.com/states" },
  openGraph: {
    title: "States and Provinces | GetEasyCar",
    description:
      "Explore states and provinces with rental car city pages, airport links, and deeper regional coverage.",
    url: "https://geteasycar.com/states",
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

function readIndex<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), "data", "index", filename);
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[];
  } catch {
    return [];
  }
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=2000&q=80";

function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {label && (
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#2C5F95]">
          {label}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base max-w-2xl text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

const countryEmoji: Record<string, string> = {
  "united-states": "🇺🇸",
  canada: "🇨🇦",
  australia: "🇦🇺",
};

export default function StatesPage() {
  const allCountries = readIndex<CountryIndex>("countries.json").filter(
    (c) => c.publication_state === "indexed" && c.has_state_layer
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

  const states = allStates
    .map((state) => {
      const cityCount = allCities.filter(
        (city) =>
          city.country_slug === state.country_slug &&
          city.state_slug === state.state_slug
      ).length;

      const airportCount = allAirports.filter(
        (airport) =>
          airport.country_slug === state.country_slug &&
          (airport.state_slug ?? null) === state.state_slug
      ).length;

      return {
        ...state,
        cityCount,
        airportCount,
        score: cityCount * 3 + airportCount * 4,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.state_name.localeCompare(b.state_name);
    });

  const featuredStates = states.slice(0, 12);

  const countriesWithCounts = allCountries.map((country) => {
    const stateCount = allStates.filter(
      (state) => state.country_slug === country.country_slug
    ).length;

    const cityCount = allCities.filter(
      (city) => city.country_slug === country.country_slug && city.has_state_layer
    ).length;

    return {
      ...country,
      stateCount,
      cityCount,
    };
  });

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800">
      <section className="relative overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="States and provinces"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/85 via-[#163B66]/72 to-[#2C5F95]/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 mb-6">
              State and province discovery
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Browse States and Provinces
            </h1>

            <p className="text-blue-50 text-lg sm:text-xl leading-relaxed max-w-2xl">
              Explore deeper rental structure across countries that use state or province
              routing before city-level pages.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  State-Layer Countries
                </p>
                <p className="mt-1 text-white font-semibold">{allCountries.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  States Indexed
                </p>
                <p className="mt-1 text-white font-semibold">{allStates.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  Cities Linked
                </p>
                <p className="mt-1 text-white font-semibold">
                  {allCities.filter((c) => c.has_state_layer).length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  Airports Linked
                </p>
                <p className="mt-1 text-white font-semibold">
                  {allAirports.filter((a) => a.state_slug).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "Regional market discovery",
              "State-to-city rental routes",
              "Airport-connected state pages",
              "Automatic growth from JSON data",
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
            label="Countries"
            title="Markets using the state layer"
            subtitle="These countries route visitors through states or provinces before city pages."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {countriesWithCounts.map((country) => (
              <Link
                key={country.country_slug}
                href={`/car-rental/${country.country_slug}/`}
                className="group rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6 hover:border-[#B7CDE3] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{countryEmoji[country.country_slug] ?? "🧭"}</span>
                  <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                    →
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{country.country_name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {country.stateCount} states · {country.cityCount} cities
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Featured states"
            title="States and provinces with stronger rental depth"
            subtitle="These states and provinces currently have stronger city and airport connections."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredStates.map((state) => (
              <Link
                key={`${state.country_slug}-${state.state_slug}`}
                href={`/car-rental/${state.country_slug}/${state.state_slug}/`}
                className="group rounded-3xl border border-slate-200 bg-white p-5 hover:border-[#B7CDE3] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg">🧭</span>
                  <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                    →
                  </span>
                </div>
                <p className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-tight">
                  {state.state_name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {state.country_slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <p className="mt-3 text-xs text-[#2C5F95] font-medium">
                  {state.cityCount} cities · {state.airportCount} airports
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="All states"
            title="Explore all indexed states and provinces"
            subtitle="This page grows automatically as new states and provinces are added to your data."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {states.map((state) => (
              <Link
                key={`${state.country_slug}-${state.state_slug}-all`}
                href={`/car-rental/${state.country_slug}/${state.state_slug}/`}
                className="group rounded-3xl border border-slate-200 bg-[#FBFCFE] p-5 hover:border-[#B7CDE3] hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg">📍</span>
                  <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                    →
                  </span>
                </div>
                <p className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-tight">
                  {state.state_name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {state.country_slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#2C5F95] font-medium">{state.cityCount} cities</span>
                  <span className="text-slate-400">{state.airportCount} airports</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}