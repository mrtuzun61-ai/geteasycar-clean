import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCountriesIndex,
  getCountryBySlug,
  getStatesByCountry,
  getCitiesByCountry,
  getGuidesByCountry,
  getAirportsByCountry,
} from "@/lib/data";
import { getCountryHeroImage } from "@/lib/images";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

export async function generateStaticParams() {
  const countries = await getCountriesIndex();

  return countries
    .filter((c) => c.publication_state === "indexed")
    .map((c) => ({
      country: c.country_slug,
    }));
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

  const canonical = `https://geteasycar.com${country.canonical_url}`;

  return {
    title: country.meta_title,
    description: country.meta_description,
    alternates: { canonical },
    openGraph: {
      title: country.meta_title,
      description: country.meta_description,
      url: canonical,
      siteName: "Get Easy Car",
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
        <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
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

function cityUrl(city: {
  country_slug: string;
  city_slug: string;
  has_state_layer?: boolean;
  state_slug?: string | null;
}) {
  if (city.has_state_layer && city.state_slug) {
    return `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`;
  }
  return `/city-rental/${city.country_slug}/${city.city_slug}/`;
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;

  const country = await getCountryBySlug(countrySlug);

  if (!country || country.publication_state !== "indexed") {
    notFound();
  }

  const [states, cities, guides, airports] = await Promise.all([
    getStatesByCountry(countrySlug),
    getCitiesByCountry(countrySlug),
    getGuidesByCountry(countrySlug),
    getAirportsByCountry(countrySlug),
  ]);

  const indexedStates = states.filter((s) => s.publication_state === "indexed");
  const indexedCities = cities.filter((c) => c.publication_state === "indexed");
  const indexedGuides = guides.filter((g) => g.publication_state === "indexed");
  const indexedAirports = airports.filter((a) => a.publication_state === "indexed");

  const featuredCities = indexedCities.slice(0, 6);
  const featuredStates = indexedStates.slice(0, 6);
  const featuredAirports = indexedAirports.slice(0, 6);

  const heroImage = getCountryHeroImage(
    country.country_slug,
    country.country_name
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: country.meta_title,
    description: country.meta_description,
    url: `https://geteasycar.com${country.canonical_url}`,
    dateModified: country.last_updated,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: country.breadcrumb_path.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `https://geteasycar.com${item.url}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-white">
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-50 border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              {country.breadcrumb_path.map((item, index) => (
                <li key={item.url} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-slate-300">
                      /
                    </span>
                  )}
                  {index === country.breadcrumb_path.length - 1 ? (
                    <span
                      className="text-slate-700 font-medium"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.url}
                      className="hover:text-blue-600 transition-colors"
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
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-700/80 to-blue-500/70" />
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-blue-900/25 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
                Country Car Rental Hub
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                {country.h1}
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl">
                {country.intro_paragraph}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={affiliateUrl(country.affiliate_sid_base, "hero")}
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Compare Car Rentals in {country.country_name}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>

                {indexedGuides.length > 0 && (
                  <Link
                    href={`/guide/${indexedGuides[0].guide_slug}/`}
                    className="inline-flex items-center justify-center gap-2 bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                  >
                    Read Travel Guide
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                    Driving Side
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
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                    Min. Driver Age
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {country.minimum_driver_age}+ years
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Coverage</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {indexedCities.length} cities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Country Overview"
              title={`Driving and Renting a Car in ${country.country_name}`}
              subtitle={`Key information before you rent a car in ${country.country_name}.`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {country.driving_notes && (
                  <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Road Rules
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {country.driving_notes}
                    </p>
                  </div>
                )}

                {country.toll_information && (
                  <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Tolls and Charges
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

              <aside className="lg:col-span-1">
                <div className="sticky top-24 flex flex-col gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 text-base mb-4">
                      Quick Snapshot
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">
                          Country
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {country.country_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">
                          Driving Side
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {country.driving_side === "left"
                            ? "Drive on the left"
                            : "Drive on the right"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">
                          Minimum Driver Age
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {country.minimum_driver_age}+ years
                        </p>
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

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 text-base mb-3">
                      Ready to Book?
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Compare car rental suppliers across {country.country_name}
                      and connect directly with trusted partners.
                    </p>
                    <a
                      href={affiliateUrl(country.affiliate_sid_base, "sidebar")}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                    >
                      Compare Car Rentals
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                </div>
              </aside>
            </div>
          </div>
        </section>

        {featuredStates.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="States / Regions"
                title={`Popular Regions in ${country.country_name}`}
                subtitle="Explore rental pages by state or region."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredStates.map((state) => (
                  <Link
                    key={state.state_slug}
                    href={`/car-rental/${state.country_slug}/${state.state_slug}/`}
                    className="group flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                        Region Page
                      </p>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                        Car Rental in {state.state_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        State-level rental locations and city links
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {featuredCities.length > 0 && (
          <section className="py-14 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Cities"
                title={`Popular Car Rental Cities in ${country.country_name}`}
                subtitle="Explore city-specific rental pages."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredCities.map((city) => (
                  <Link
                    key={`${city.country_slug}-${city.city_slug}`}
                    href={cityUrl(city)}
                    className="group flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                        City Page
                      </p>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                        Car Rental in {city.city_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        Local tips · Airport links · Rental options
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {featuredAirports.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Airports"
                title={`Major Airport Rental Locations in ${country.country_name}`}
                subtitle="Pick up your rental directly on arrival at these airports."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredAirports.map((airport) => (
                  <Link
                    key={airport.iata_code}
                    href={`/car-rental/airports/${airport.airport_slug}/`}
                    className="group flex flex-col gap-4 p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sky-400/40 rounded-2xl transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg tracking-wider">
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
                        Airport pickup and return information
                      </p>
                    </div>
                    <p className="text-sky-400 text-sm font-medium group-hover:text-sky-300 transition-colors flex items-center gap-1">
                      View airport rental options →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {indexedGuides.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Guides"
                title={`Travel Guides for ${country.country_name}`}
                subtitle="Read country-level rental and driving advice."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {indexedGuides.map((guide) => (
                  <Link
                    key={guide.guide_slug}
                    href={`/guide/${guide.guide_slug}/`}
                    className="group flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                        Country Guide
                      </p>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                        {guide.guide_title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        Driving rules · Tolls · Fuel · Parking
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-blue-700 to-blue-600">
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-blue-900/20 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Find the Best Car Rental Deals in {country.country_name}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare suppliers across {country.country_name} and connect
              directly with trusted rental partners.
            </p>
            <a
              href={affiliateUrl(country.affiliate_sid_base, "bottom")}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
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