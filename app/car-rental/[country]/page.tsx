import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCountryBySlug,
  getStatesIndex,
  getCitiesIndex,
  getAirportsByCountry,
  getGuidesByCountry,
} from "@/lib/data";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

function getStateHeroImage(stateSlug: string, countrySlug: string) {
  const map: Record<string, string> = {
    california:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
    florida:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
    "new-york":
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1800&q=80",
    nevada:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80",
    illinois:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80",
    "new-south-wales":
      "https://images.unsplash.com/photo-1523428096881-5bd79d043006?auto=format&fit=crop&w=1800&q=80",
    victoria:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1800&q=80",
    queensland:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8d4a5?auto=format&fit=crop&w=1800&q=80",
  };

  return (
    map[stateSlug] ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
  );
}

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

function ChevronRight() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export async function generateStaticParams() {
  const states = await getStatesIndex();

  return states
    .filter((s) => s.publication_state === "indexed")
    .map((s) => ({
      country: s.country_slug,
      state: s.state_slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, state: stateSlug } = await params;

  const [country, states] = await Promise.all([
    getCountryBySlug(countrySlug),
    getStatesIndex(),
  ]);

  const state = states.find(
    (s) =>
      s.state_slug === stateSlug &&
      s.country_slug === countrySlug &&
      s.publication_state === "indexed"
  );

  if (!country || !state) {
    return { title: "Not Found" };
  }

  return {
    title: `Car Rental in ${state.state_name} — Cities & Airports`,
    description: `Compare car rental options across ${state.state_name}. Explore city pages, airport pickup locations, and local driving guidance.`,
    alternates: {
      canonical: `https://geteasycar.com/car-rental/${countrySlug}/${stateSlug}/`,
    },
    openGraph: {
      title: `Car Rental in ${state.state_name} — Cities & Airports`,
      description: `Compare car rental options across ${state.state_name}. Explore city pages, airport pickup locations, and local driving guidance.`,
      url: `https://geteasycar.com/car-rental/${countrySlug}/${stateSlug}/`,
      siteName: "GetEasyCar",
      type: "website",
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}) {
  const { country: countrySlug, state: stateSlug } = await params;

  const [country, states, cities, airports, guides] = await Promise.all([
    getCountryBySlug(countrySlug),
    getStatesIndex(),
    getCitiesIndex(),
    getAirportsByCountry(countrySlug),
    getGuidesByCountry(countrySlug),
  ]);

  if (!country) notFound();

  const state = states.find(
    (s) =>
      s.state_slug === stateSlug &&
      s.country_slug === countrySlug &&
      s.publication_state === "indexed"
  );

  if (!state) notFound();

  const heroImage = getStateHeroImage(stateSlug, countrySlug);

  const stateCities = cities.filter(
    (c) =>
      c.state_slug === stateSlug &&
      c.country_slug === countrySlug &&
      c.publication_state === "indexed"
  );

  const stateAirports = airports.filter(
    (a) => a.state_slug === stateSlug && a.publication_state === "indexed"
  );

  const indexedGuides = guides
    .filter((g) => g.publication_state === "indexed")
    .slice(0, 6);

  const sidBase = `state_${countrySlug}_${stateSlug}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Car Rental in ${state.state_name}`,
    description: `Compare car rental options across ${state.state_name}. Explore city pages, airport pickup locations, and local driving guidance.`,
    url: `https://geteasycar.com/car-rental/${countrySlug}/${stateSlug}/`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is renting a car in ${state.state_name} a good idea?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Renting a car in ${state.state_name} is often the best choice if you plan to travel between cities, use airport pickup, or explore beyond the main urban core.`,
        },
      },
      {
        "@type": "Question",
        name: `Should I rent at the airport or in the city in ${state.state_name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Airport pickup is usually easier for direct arrivals and road trips, while city pickup can make sense if you plan to stay downtown before driving.`,
        },
      },
      {
        "@type": "Question",
        name: `What can I compare on this ${state.state_name} page?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This page helps you compare major cities, airport pickup points, and useful planning paths across ${state.state_name}.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-50 border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <li className="flex items-center gap-1.5">
                <Link href="/" className="hover:text-[#2C5F95] transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <Link
                  href={`/car-rental/${countrySlug}/`}
                  className="hover:text-[#2C5F95] transition-colors"
                >
                  {country.country_name}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span className="text-slate-700 font-medium" aria-current="page">
                  {state.state_name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <section className="relative overflow-hidden">
          <img
            src={heroImage}
            alt={`${state.state_name} car rental`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/62 via-[#163B66]/48 to-[#2C5F95]/24" />
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[540px] h-[540px] rounded-full bg-sky-300/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-[420px] h-[420px] rounded-full bg-[#0B1D31]/18 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div className="max-w-3xl">
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-4">
                  State Rental Hub
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  Car Rental in {state.state_name}
                </h1>

                <p className="text-blue-50 text-lg leading-relaxed mb-8 max-w-2xl">
                  Compare rental options across {state.state_name}, explore major
                  city pages, and choose the best airport or city pickup path for
                  your trip.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={affiliateUrl(sidBase, "hero")}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Compare Car Rentals in {state.state_name}
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
                    href={`/car-rental/${countrySlug}/`}
                    className="inline-flex items-center justify-center gap-2 bg-white/12 hover:bg-white/18 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                  >
                    Back to {country.country_name}
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Cities Indexed
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {stateCities.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Airports Indexed
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {stateAirports.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Best For
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      Regional trip planning
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/12 backdrop-blur-sm p-6">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                  Why this page matters
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Plan state-wide pickup smarter
                </h2>
                <div className="space-y-3 text-sm text-blue-50/90">
                  <p>See which cities are already covered in {state.state_name}.</p>
                  <p>Review airport pickup points before choosing your arrival plan.</p>
                  <p>Move into city and airport detail pages with stronger context.</p>
                </div>
                <a
                  href={affiliateUrl(sidBase, "sidebar")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Check Prices in {state.state_name}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium text-slate-600">
              {[
                "Statewide city links",
                "Airport pickup planning",
                "Trusted rental partners",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-black">
                    ✓
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeading
              label="Cities"
              title={`Top cities in ${state.state_name}`}
              subtitle={`Explore city-level rental pages currently available across ${state.state_name}.`}
            />

            {stateCities.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stateCities.map((city) => (
                  <Link
                    key={city.city_slug}
                    href={`/car-rental/${countrySlug}/${stateSlug}/${city.city_slug}/`}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#B7CDE3] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5F95] mb-1">
                          City Page
                        </p>
                        <p className="text-lg font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors">
                          {city.city_name}
                        </p>
                      </div>
                      <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                        <ChevronRight />
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      View city rental guidance, airport access, and local planning information.
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                City pages will appear here as they are indexed for {state.state_name}.
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeading
              label="Airports"
              title={`Airports in ${state.state_name}`}
              subtitle={`Compare airport pickup points currently linked to ${state.state_name}.`}
              light
            />

            {stateAirports.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stateAirports.map((airport) => (
                  <Link
                    key={airport.iata_code}
                    href={`/car-rental/airports/${airport.airport_slug}/`}
                    className="group p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-sky-300/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="inline-flex bg-[#2C5F95] text-white text-xs font-bold px-2.5 py-1 rounded-lg tracking-wider mb-3">
                          {airport.iata_code}
                        </p>
                        <p className="text-white font-semibold text-base leading-snug">
                          {airport.airport_name}
                        </p>
                      </div>
                      <span className="text-slate-500 group-hover:text-sky-300 transition-colors">
                        <ChevronRight />
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      View airport pickup guidance and compare arrival options.
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                Airport pages will appear here as they are indexed for {state.state_name}.
              </div>
            )}
          </div>
        </section>

        {indexedGuides.length > 0 && (
          <section className="py-16 bg-[#F2F6FA] border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
              <SectionHeading
                label="Guides"
                title={`Travel guides for ${country.country_name}`}
                subtitle="Use these editorial guides before choosing a city or airport pickup strategy."
              />

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {indexedGuides.map((guide) => (
                  <Link
                    key={guide.guide_slug}
                    href={`/guide/${guide.guide_slug}/`}
                    className="group flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#B7CDE3] hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-[#2C5F95]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#2C5F95] font-semibold uppercase tracking-wide mb-1">
                        Country Guide
                      </p>
                      <h3 className="font-semibold text-slate-900 group-hover:text-[#163B66] transition-colors text-base leading-snug">
                        {guide.guide_title}
                      </h3>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors shrink-0 mt-0.5">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to compare deals in {state.state_name}?
            </h2>
            <p className="text-slate-600 text-base mb-8 leading-relaxed">
              Compare airport and city pickup strategies, review local coverage,
              and continue to trusted partners when you are ready to book.
            </p>
            <a
              href={affiliateUrl(sidBase, "bottom")}
              className="inline-flex items-center gap-2 bg-[#163B66] text-white hover:bg-[#1E4C82] font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/10"
            >
              Compare Deals in {state.state_name}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}