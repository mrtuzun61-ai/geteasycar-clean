import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCountryBySlug,
  getCitiesIndex,
  getAirportsByCountry,
  getGuidesByCountry,
  getStatesIndex,
} from "@/lib/data";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

function getCountryHeroImage(countrySlug: string): string {
  const map: Record<string, string> = {
    france:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=80",

    spain:
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1800&q=80",

    italy:
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1800&q=80",

    australia:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1800&q=80",

    "united-states":
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1800&q=80",
  };

  return map[countrySlug] || map["united-states"];
}

function countryLabel(slug: string): string {
  const map: Record<string, string> = {
    france: "France",
    spain: "Spain",
    italy: "Italy",
    australia: "Australia",
    "united-states": "United States",
  };
  return map[slug] ?? slug.replace(/-/g, " ");
}

function cityUrl(city: {
  country_slug: string;
  state_slug: string | null;
  city_slug: string;
  has_state_layer: boolean;
}): string {
  if (city.has_state_layer && city.state_slug) {
    return `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`;
  }
  return `/city-rental/${city.country_slug}/${city.city_slug}/`;
}

export async function generateStaticParams() {
  const countries = ["france", "spain", "italy", "united-states", "australia"];
  return countries.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);

  if (!country || country.publication_state !== "indexed") {
    return { title: "Not Found" };
  }

  const canonical = `https://geteasycar.com/car-rental/${countrySlug}/`;

  return {
    title: country.meta_title || `Car Rental in ${country.country_name}`,
    description:
      country.meta_description ||
      `Compare car rental options in ${country.country_name}.`,
    alternates: { canonical },
    openGraph: {
      title: country.meta_title || `Car Rental in ${country.country_name}`,
      description:
        country.meta_description ||
        `Compare car rental options in ${country.country_name}.`,
      url: canonical,
      siteName: "GetEasyCar",
      type: "website",
    },
  };
}

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
        <p className="text-[#2C5F95] text-xs font-bold uppercase tracking-widest mb-2">
          {label}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-slate-500 text-base max-w-2xl">{subtitle}</p>
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

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;

  const [country, allCities, allAirports, allGuides, allStates] =
    await Promise.all([
      getCountryBySlug(countrySlug),
      getCitiesIndex(),
      getAirportsByCountry(countrySlug),
      getGuidesByCountry(countrySlug),
      getStatesIndex(),
    ]);

  if (!country || country.publication_state !== "indexed") {
    notFound();
  }

  const heroImage = getCountryHeroImage(countrySlug);

  const indexedCities = allCities.filter(
    (city) =>
      city.country_slug === countrySlug &&
      city.publication_state === "indexed" &&
      city.has_state_layer === false
  );

  const indexedStates = allStates.filter(
    (state) =>
      state.country_slug === countrySlug && state.publication_state === "indexed"
  );

  const indexedAirports = allAirports.filter(
    (airport) => airport.publication_state === "indexed"
  );

  const indexedGuides = allGuides.filter(
    (guide) => guide.publication_state === "indexed"
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: country.meta_title || `Car Rental in ${country.country_name}`,
    description:
      country.meta_description ||
      `Compare car rental options in ${country.country_name}.`,
    url: `https://geteasycar.com/car-rental/${countrySlug}/`,
    dateModified: country.last_updated,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://geteasycar.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: country.country_name,
          item: `https://geteasycar.com/car-rental/${countrySlug}/`,
        },
      ],
    },
  };

  const faqItems = [
    {
      question: `Is renting a car in ${country.country_name} a good idea?`,
      answer: `A rental car is often the best option in ${country.country_name} if you plan to explore outside major city centers, visit smaller towns, or follow your own schedule. In dense urban centers, public transport may be easier, but a car adds flexibility for regional travel.`,
    },
    {
      question: `What documents do I need to rent a car in ${country.country_name}?`,
      answer: `Most suppliers require a valid driving licence, a passport or government ID, and a credit card in the main driver's name. Depending on your licence country, an International Driving Permit may also be recommended or required.`,
    },
    {
      question: `Should I pick up my rental car at the airport or in the city?`,
      answer: `Airport pickup is usually the easiest option because vehicle selection is broader and major highways are easier to access. City pickup can sometimes work better if you plan to spend several days in the city before starting a road trip.`,
    },
  ];

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
                <span className="text-slate-700 font-medium" aria-current="page">
                  {country.country_name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/68 via-[#163B66]/56 to-[#2C5F95]/38" />

          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[540px] h-[540px] rounded-full bg-sky-300/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-[420px] h-[420px] rounded-full bg-[#0B1D31]/20 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div className="max-w-3xl">
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-4">
                  Country Rental Hub
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  {country.h1 || `Car Rental in ${country.country_name}`}
                </h1>

                <p className="text-blue-50 text-lg leading-relaxed mb-8 max-w-2xl">
                  {country.intro_paragraph ||
                    `${country.country_name} is a strong destination for travelers who want flexibility beyond major city centers. Use this hub to compare city pages, airport pickup options, and practical guidance before booking your rental car.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={affiliateUrl(country.affiliate_sid_base, "hero")}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Compare Car Rentals in {country.country_name}
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

                  {indexedAirports.length > 0 && (
                    <Link
                      href="/car-rental/airports/"
                      className="inline-flex items-center justify-center gap-2 bg-white/12 hover:bg-white/18 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                    >
                      Browse All Airports
                    </Link>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Driving Side
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.driving_side === "left"
                        ? "Drive on the left"
                        : "Drive on the right"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Minimum Age
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.minimum_driver_age}+ years
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Currency
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.currency_code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/12 backdrop-blur-sm p-6">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                  Why this page matters
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Start with the right country hub
                </h2>
                <div className="space-y-3 text-sm text-blue-50/95">
                  <p>Compare major airport pickup points before you book.</p>
                  <p>Jump into the best city pages for higher-intent searches.</p>
                  <p>Use country guidance to avoid common driving and toll mistakes.</p>
                </div>
                <a
                  href={affiliateUrl(country.affiliate_sid_base, "sidebar")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Check Prices in {country.country_name}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium text-slate-600">
              {[
                "Free cancellation where available",
                "No hidden platform fees",
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

        {country.has_state_layer && indexedStates.length > 0 ? (
          <section className="py-14 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="States"
                title={`Browse ${country.country_name} by state`}
                subtitle={`Explore state-level rental hubs before choosing a city or airport pickup point.`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {indexedStates.map((state) => (
                  <Link
                    key={state.state_slug}
                    href={`/car-rental/${countrySlug}/${state.state_slug}/`}
                    className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#B7CDE3] hover:shadow-md transition-all"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5F95] mb-1">
                        State Hub
                      </p>
                      <p className="text-lg font-semibold text-slate-900 group-hover:text-[#163B66]">
                        {state.state_name}
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#2C5F95]">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          indexedCities.length > 0 && (
            <section className="py-14 sm:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                  label="Cities"
                  title={`Top rental cities in ${country.country_name}`}
                  subtitle={`Compare city-level rental pages with airport pickup links, local tips, and guide connections.`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {indexedCities.map((city) => (
                    <Link
                      key={city.city_slug}
                      href={cityUrl(city)}
                      className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#B7CDE3] hover:shadow-md transition-all"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5F95] mb-1">
                          City Page
                        </p>
                        <p className="text-lg font-semibold text-slate-900 group-hover:text-[#163B66]">
                          {city.city_name}
                        </p>
                      </div>
                      <span className="text-slate-300 group-hover:text-[#2C5F95]">
                        <ChevronRight />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        )}

        {indexedAirports.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Airport Pickup"
                title={`Major airport rental locations in ${country.country_name}`}
                subtitle="Compare airport pickup options before you land and choose the access point that best fits your route."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {indexedAirports.map((airport) => (
                  <Link
                    key={airport.iata_code}
                    href={`/car-rental/airports/${airport.airport_slug}/`}
                    className="group flex flex-col gap-4 p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-400/40 rounded-2xl transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex bg-[#2C5F95] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg tracking-wider">
                        {airport.iata_code}
                      </span>
                      <span className="text-slate-600 group-hover:text-sky-400 transition-colors">
                        <ChevronRight />
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-base leading-snug">
                        {airport.airport_name}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        {countryLabel(airport.country_slug)}
                      </p>
                    </div>
                    <p className="text-sky-400 text-sm font-medium group-hover:text-sky-300 transition-colors">
                      View airport rental options →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 sm:py-14 bg-[#F2F6FA] border-y border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to Compare Rental Cars in {country.country_name}?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Compare airport and city pickup strategies, review practical
              country-level guidance, and continue to trusted partners when you
              are ready to book.
            </p>
            <a
              href={affiliateUrl(country.affiliate_sid_base, "mid")}
              className="inline-flex items-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] active:bg-[#143454] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/10 text-base"
            >
              Check Availability and Prices
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

        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <SectionHeading
                  label="Driving Basics"
                  title={`Driving in ${country.country_name}`}
                  subtitle="Key country-level information before you start your trip."
                />
                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
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

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
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

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
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
                      <p className="text-xs text-slate-400 font-medium">
                        Currency
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {country.currency_code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                {country.driving_notes && (
                  <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Road rules
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.driving_notes}
                    </p>
                  </div>
                )}

                {country.toll_information && (
                  <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Tolls and charges
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.toll_information}
                    </p>
                  </div>
                )}

                {country.fuel_notes && (
                  <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Fuel
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.fuel_notes}
                    </p>
                  </div>
                )}

                {country.parking_notes && (
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
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

        <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Guides"
              title={`Country guides for ${country.country_name}`}
              subtitle="Use the editorial guides below before choosing a city or airport pickup strategy."
            />
            {indexedGuides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Country guide pages will appear here as they are published.
              </div>
            )}
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="FAQs"
              title={`Car Rental in ${country.country_name} — Common Questions`}
            />
            <div className="flex flex-col gap-3">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl bg-white p-5"
                >
                  <p className="font-semibold text-slate-900 text-sm mb-2">
                    {item.question}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
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
              Find the Best Car Rental Deals in {country.country_name}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare airport and city pickup options, review trusted suppliers,
              and choose the vehicle that fits your trip in {country.country_name}.
            </p>
            <a
              href={affiliateUrl(country.affiliate_sid_base, "bottom")}
              className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
            >
              Compare Car Rental Deals Now
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