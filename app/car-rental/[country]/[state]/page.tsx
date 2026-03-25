import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCountryBySlug,
  getStateBySlug,
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

const STATE_HERO_IMAGES: Record<string, string> = {
  california:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  florida:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
  "new-york":
    "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1800&q=80",
  nevada:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80",
  illinois:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80",
  "new-south-wales":
    "https://images.unsplash.com/photo-1523428096881-5bd79d043006?auto=format&fit=crop&w=1800&q=80",
  victoria:
    "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1800&q=80",
  queensland:
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80",
};

function getStateHeroImage(stateSlug: string): string {
  return (
    STATE_HERO_IMAGES[stateSlug] ||
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
          className={`text-xs font-bold uppercase tracking-[0.24em] mb-2 ${
            light ? "text-sky-300" : "text-[#2C5F95]"
          }`}
        >
          {label}
        </p>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base leading-relaxed max-w-2xl ${
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="font-semibold text-slate-900 text-base mb-2">{question}</p>
      <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
    </div>
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

  const country = await getCountryBySlug(countrySlug);
  if (!country || country.publication_state !== "indexed") {
    return { title: "Not Found" };
  }

  const state = await getStateBySlug(stateSlug, country.iso_code_2);
  if (!state || state.publication_state !== "indexed") {
    return { title: "Not Found" };
  }

  const canonical = `https://geteasycar.com${state.canonical_url}`;

  return {
    title:
      state.meta_title || `Car Rental in ${state.state_name} — Cities & Airports`,
    description:
      state.meta_description ||
      `Compare car rental options across ${state.state_name}.`,
    alternates: { canonical },
    openGraph: {
      title:
        state.meta_title || `Car Rental in ${state.state_name} — Cities & Airports`,
      description:
        state.meta_description ||
        `Compare car rental options across ${state.state_name}.`,
      url: canonical,
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

  const country = await getCountryBySlug(countrySlug);
  if (!country || country.publication_state !== "indexed") {
    notFound();
  }

  const [state, allCities, allAirports, allGuides] = await Promise.all([
    getStateBySlug(stateSlug, country.iso_code_2),
    getCitiesIndex(),
    getAirportsByCountry(countrySlug),
    getGuidesByCountry(countrySlug),
  ]);

  if (!state || state.publication_state !== "indexed") {
    notFound();
  }

  const heroImage = getStateHeroImage(stateSlug);

  const stateCities = allCities.filter(
    (city) =>
      city.country_slug === countrySlug &&
      city.state_slug === stateSlug &&
      city.publication_state === "indexed"
  );

  const featuredCities = stateCities.slice(0, 6);

  const stateAirports = allAirports.filter(
    (airport) =>
      airport.state_slug === stateSlug &&
      airport.publication_state === "indexed"
  );

  const featuredAirports = stateAirports.slice(0, 6);

  const indexedGuides = allGuides
    .filter((guide) => guide.publication_state === "indexed")
    .slice(0, 6);

  const sidBase = state.affiliate_sid_base || `state_${countrySlug}_${stateSlug}`;

  const faqItems = [
    {
      question: `Is renting a car in ${state.state_name} a good idea?`,
      answer: `Renting a car in ${state.state_name} is usually the best choice if you want flexibility between cities, airport pickup convenience, and easier access to regional destinations beyond the main urban core.`,
    },
    {
      question: `Should I rent at the airport or in the city in ${state.state_name}?`,
      answer: `Airport pickup is usually the easiest option for direct arrivals, luggage-heavy trips, and early road departures. City pickup can work better if you plan to stay downtown before driving.`,
    },
    {
      question: `What does this ${state.state_name} page help me compare?`,
      answer: `This page helps you compare state-level city pages, airport pickup points, and country travel guidance so you can choose the right rental strategy before booking.`,
    },
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: state.meta_title || `Car Rental in ${state.state_name}`,
    description:
      state.meta_description ||
      `Compare car rental options across ${state.state_name}.`,
    url: `https://geteasycar.com${state.canonical_url}`,
    dateModified: state.last_updated,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: state.breadcrumb_path.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `https://geteasycar.com${item.url}`,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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

      <div className="min-h-screen bg-[#F7F9FC]">
        <nav
          aria-label="Breadcrumb"
          className="bg-white border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              {state.breadcrumb_path.map((item, index) => (
                <li key={item.url} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-slate-300">
                      /
                    </span>
                  )}
                  {index === state.breadcrumb_path.length - 1 ? (
                    <span className="text-slate-700 font-medium" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.url}
                      className="hover:text-[#2C5F95] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/72 via-[#163B66]/58 to-[#2C5F95]/28" />
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[540px] h-[540px] rounded-full bg-sky-300/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-[420px] h-[420px] rounded-full bg-[#0B1D31]/18 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div className="max-w-3xl">
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-[0.24em] mb-4">
                  State Rental Hub
                </p>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  {state.h1 || `Car Rental in ${state.state_name}`}
                </h1>

                <p className="text-blue-50 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
                  Compare rental options across {state.state_name}, explore major
                  city pages, and choose the strongest airport or downtown pickup
                  strategy for your trip.
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
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
                  Why this page matters
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Plan statewide pickup smarter
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

        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                "Statewide city links",
                "Airport pickup planning",
                "Trusted rental partners",
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

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Overview"
              title={`Why rent in ${state.state_name}?`}
              subtitle={`Use this page to compare city and airport access across ${state.state_name} before you choose where to pick up your rental car.`}
            />

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  City pickup planning
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Compare city hubs in {state.state_name} if you plan to stay
                  downtown first, avoid immediate airport traffic, or start your
                  trip later in the day.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Airport arrival strategy
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Airport pickup is usually the easiest path for direct arrivals,
                  luggage-heavy trips, and longer regional routes beyond the main
                  metro core.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Statewide flexibility
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A strong state page helps you compare multiple cities, airport
                  entry points, and travel guides before you lock in the wrong
                  pickup location.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Cities"
              title={`Top cities in ${state.state_name}`}
              subtitle={`Explore city-level rental pages currently available across ${state.state_name}.`}
            />

            {featuredCities.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredCities.map((city) => (
                  <Link
                    key={city.city_slug}
                    href={`/car-rental/${countrySlug}/${stateSlug}/${city.city_slug}/`}
                    className="group rounded-3xl border border-slate-200 bg-[#FBFCFE] p-6 hover:border-[#B7CDE3] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
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
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                      View city rental guidance, airport access, and local planning information.
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                City pages will appear here as they are indexed for {state.state_name}.
              </div>
            )}
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Airports"
              title={`Airports in ${state.state_name}`}
              subtitle={`Compare airport pickup points currently linked to ${state.state_name}.`}
              light
            />

            {featuredAirports.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredAirports.map((airport) => (
                  <Link
                    key={airport.iata_code}
                    href={`/car-rental/airports/${airport.airport_slug}/`}
                    className="group p-6 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-sky-300/40 transition-all"
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                Airport pages will appear here as they are indexed for {state.state_name}.
              </div>
            )}
          </div>
        </section>

        <section className="py-12 sm:py-14 bg-[#F2F6FA] border-y border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to compare deals in {state.state_name}?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Compare airport and city pickup strategies, review local coverage,
              and continue to trusted partners when you are ready to book.
            </p>
            <a
              href={affiliateUrl(sidBase, "mid")}
              className="inline-flex items-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] active:bg-[#143454] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/10 text-base"
            >
              Check availability and prices
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
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <SectionHeading
                  label="Driving Basics"
                  title={`Driving in ${state.state_name}`}
                  subtitle="Key state-level planning before you set off."
                />
                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-[#2C5F95]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Traffic Side
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {country.driving_side === "left"
                          ? "Drive on the left"
                          : "Drive on the right"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-[#2C5F95]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Minimum Driver Age
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {country.minimum_driver_age}+ years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-[#2C5F95]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Currency</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {country.currency_code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-[#2C5F95]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h.01M11 15h2"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Licence Guidance
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {country.license_requirements}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                {country.driving_notes && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-7">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      Road rules in {country.country_name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.driving_notes}
                    </p>
                  </div>
                )}

                {country.toll_information && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-7">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      Tolls and charges
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.toll_information}
                    </p>
                  </div>
                )}

                {country.fuel_notes && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-7">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      Fuel
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.fuel_notes}
                    </p>
                  </div>
                )}

                {country.parking_notes && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-7">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      Parking
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.parking_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {indexedGuides.length > 0 && (
          <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="group flex items-start gap-4 p-6 bg-[#FBFCFE] border border-slate-200 rounded-3xl hover:border-[#B7CDE3] hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
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

        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="FAQs"
              title={`Car rental in ${state.state_name} — common questions`}
            />
            <div className="flex flex-col gap-3">
              {faqItems.map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-[#163B66] to-[#0F2742]">
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-sky-300/10 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Find the best car rental deals in {state.state_name}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare airport and city pickup strategies, review local coverage,
              and choose the rental plan that fits your trip.
            </p>
            <a
              href={affiliateUrl(sidBase, "bottom")}
              className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
            >
              Compare deals now
            </a>
            <p className="mt-4 text-blue-200/70 text-xs">
              Free to use · No booking fees
            </p>
          </div>
        </section>
      </div>
    </>
  );
}