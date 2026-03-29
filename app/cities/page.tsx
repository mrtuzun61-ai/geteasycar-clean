import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse Car Rental Cities | GetEasyCar",
  description:
    "Explore car rental cities worldwide. Compare airport and city pickup locations with smarter travel guidance.",
  alternates: { canonical: "https://geteasycar.com/cities" },
  openGraph: {
    title: "Browse Car Rental Cities | GetEasyCar",
    description:
      "Explore car rental cities worldwide with airport and city pickup guidance.",
    url: "https://geteasycar.com/cities",
    siteName: "GetEasyCar",
    type: "website",
  },
};

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

function cityUrl(city: CityIndex): string {
  if (city.has_state_layer && city.state_slug) {
    return `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`;
  }
  return `/city-rental/${city.country_slug}/${city.city_slug}/`;
}

function formatSlug(value: string | null): string {
  if (!value) return "";
  return value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80";

export default function CitiesPage() {
  const allCities = readIndex<CityIndex>("cities.json").filter(
    (c) => c.publication_state === "indexed"
  );

  const allAirports = readIndex<AirportIndex>("airports.json").filter(
    (a) => a.publication_state === "indexed"
  );

  const citiesWithCounts = allCities
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
    });

  const topCities = citiesWithCounts.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800">
      <section className="relative overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Car rental cities"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/85 via-[#163B66]/70 to-[#2C5F95]/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 mb-6">
              Global city rental discovery
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Browse Car Rental Cities Worldwide
            </h1>

            <p className="text-blue-50 text-lg sm:text-xl leading-relaxed max-w-2xl">
              Explore airport-connected cities, major travel hubs, and destination pages
              built to help you compare smarter before booking.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  Indexed Cities
                </p>
                <p className="mt-1 text-white font-semibold">{allCities.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  Airport Links
                </p>
                <p className="mt-1 text-white font-semibold">{allAirports.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  State Routes
                </p>
                <p className="mt-1 text-white font-semibold">
                  {allCities.filter((c) => c.has_state_layer).length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                  Direct City Routes
                </p>
                <p className="mt-1 text-white font-semibold">
                  {allCities.filter((c) => !c.has_state_layer).length}
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
              "Airport-connected city pages",
              "Automatic route logic",
              "State and non-state markets",
              "High-intent destination coverage",
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
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#2C5F95]">
              Featured cities
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Strong rental cities with airport demand
            </h2>
            <p className="mt-2 text-base max-w-2xl text-slate-500">
              Cities with stronger airport connection tend to be the highest intent pages.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topCities.map((city) => (
              <Link
                key={`${city.country_slug}-${city.state_slug ?? "nostate"}-${city.city_slug}`}
                href={cityUrl(city)}
                className="group flex flex-col gap-3 rounded-3xl border border-slate-200 bg-[#FBFCFE] p-5 hover:border-[#B7CDE3] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏙️</span>
                  <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                    →
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-tight">
                    {city.city_name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {city.state_slug
                      ? `${formatSlug(city.state_slug)}, ${formatSlug(city.country_slug)}`
                      : formatSlug(city.country_slug)}
                  </p>
                </div>

                <p className="text-xs font-medium text-[#2C5F95]">
                  {city.airportCount} airport{city.airportCount === 1 ? "" : "s"} linked
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#2C5F95]">
              All cities
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Explore all indexed rental cities
            </h2>
            <p className="mt-2 text-base max-w-2xl text-slate-500">
              This page grows automatically as you add more cities to your data files.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {citiesWithCounts.map((city) => (
              <Link
                key={`${city.country_slug}-${city.state_slug ?? "nostate"}-${city.city_slug}-all`}
                href={cityUrl(city)}
                className="group flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 hover:border-[#B7CDE3] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">📍</span>
                  <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                    →
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-tight">
                    {city.city_name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {city.state_slug
                      ? `${formatSlug(city.state_slug)}, ${formatSlug(city.country_slug)}`
                      : formatSlug(city.country_slug)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#2C5F95] font-medium">
                    {city.has_state_layer ? "State route" : "Direct city route"}
                  </span>
                  <span className="text-slate-400">
                    {city.airportCount} airport{city.airportCount === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}