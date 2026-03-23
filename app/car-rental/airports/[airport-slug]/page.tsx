import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAirportsIndex,
  getAirportBySlug,
  getCountryBySlug,
  getCityBySlug,
  resolveNearbyCities,
  type CityIndexEntry,
} from "@/lib/data";
import { getAirportHeroImage } from "@/lib/images";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

export async function generateStaticParams() {
  const airports = await getAirportsIndex();

  return airports
    .filter((a) => a.publication_state === "indexed")
    .map((a) => ({
      "airport-slug": a.airport_slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "airport-slug": string }>;
}): Promise<Metadata> {
  const { "airport-slug": airportSlug } = await params;

  const airport = await getAirportBySlug(airportSlug);

  if (!airport || airport.publication_state !== "indexed") {
    return { title: "Not Found" };
  }

  const canonical = `https://geteasycar.com${airport.canonical_url}`;

  return {
    title: airport.meta_title,
    description: airport.meta_description,
    alternates: { canonical },
    openGraph: {
      title: airport.meta_title,
      description: airport.meta_description,
      url: canonical,
      siteName: "Get Easy Car",
      type: "website",
    },
  };
}

function cityUrl(city: CityIndexEntry): string {
  if (city.has_state_layer && city.state_slug) {
    return `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`;
  }
  return `/city-rental/${city.country_slug}/${city.city_slug}/`;
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

export default async function AirportPage({
  params,
}: {
  params: Promise<{ "airport-slug": string }>;
}) {
  const { "airport-slug": airportSlug } = await params;

  const airport = await getAirportBySlug(airportSlug);

  if (!airport || airport.publication_state !== "indexed") {
    notFound();
  }

  const [country, city] = await Promise.all([
    getCountryBySlug(airport.country_slug),
    getCityBySlug(
      airport.city_slug,
      airport.country_slug,
      airport.state_slug ?? null
    ),
  ]);

  if (!country || country.publication_state !== "indexed") {
    notFound();
  }

  const nearbyCities = city
    ? await resolveNearbyCities(city.nearby_city_slugs)
    : [];

  const hasFaq = airport.faq.length >= 3;

  const heroImage = getAirportHeroImage(
    airport.iata_code,
    airport.airport_name,
    airport.city_slug.replace(/-/g, " ")
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: airport.meta_title,
    description: airport.meta_description,
    url: `https://geteasycar.com${airport.canonical_url}`,
    dateModified: airport.last_updated,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: airport.breadcrumb_path.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `https://geteasycar.com${item.url}`,
      })),
    },
  };

  const faqSchema = hasFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: airport.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen bg-white">
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-50 border-b border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              {airport.breadcrumb_path.map((item, index) => (
                <li key={item.url} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-slate-300">
                      /
                    </span>
                  )}
                  {index === airport.breadcrumb_path.length - 1 ? (
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
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="inline-flex items-center bg-white/15 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg tracking-wider">
                  {airport.iata_code}
                </span>
                <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest">
                  Airport Car Rental
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                {airport.h1}
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl">
                {airport.intro_paragraph}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={affiliateUrl(airport.affiliate_sid_base, "hero")}
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Compare Car Rentals at {airport.iata_code}
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

                {city && (
                  <Link
                    href={cityUrl(city)}
                    className="inline-flex items-center justify-center gap-2 bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                  >
                    Explore {city.city_name}
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Country</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {country.country_name}
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
                <div>
                  <p className="text-xs text-slate-400 font-medium">Serves</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {city ? city.city_name : airport.city_slug.replace(/-/g, " ")}
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Pickup</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {airport.pickup_type === "shuttle"
                      ? "Shuttle transfer"
                      : airport.pickup_type === "on_site"
                        ? "On-site counter"
                        : "Mixed options"}
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Distance</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {airport.distance_from_city_km
                      ? `${airport.distance_from_city_km} km`
                      : "See details"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <SectionHeading
                  label="Airport Pickup"
                  title={`Collecting Your Car at ${airport.iata_code}`}
                  subtitle="What to expect before you arrive."
                />
                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Supplier desks
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {airport.pickup_type === "on_site"
                          ? "Inside terminal or arrivals"
                          : airport.pickup_type === "shuttle"
                            ? "Shuttle to depot"
                            : "Terminal and shuttle options"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
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
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Airport to city
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {airport.distance_from_city_km
                          ? `${airport.distance_from_city_km} km to city center`
                          : "Distance varies"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
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
                        Driver requirements
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {country.minimum_driver_age}+ years
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    Pickup at {airport.airport_name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {airport.pickup_instructions}
                  </p>
                </div>

                {airport.return_instructions && (
                  <div className="border-b border-slate-100 pb-6">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Returning Your Rental Car
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {airport.return_instructions}
                    </p>
                  </div>
                )}

                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    Driving from {airport.iata_code}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Traffic in {country.country_name} drives on the{" "}
                    {country.driving_side === "left" ? "left" : "right"}.
                    Before leaving the airport, make sure you understand toll
                    roads, parking rules, and fuel policy. Keep your driving
                    license, passport, and rental documents ready at pickup.
                  </p>
                </div>

                {country.parking_notes && (
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Parking and Local Notes
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

        <section className="py-12 sm:py-14 bg-blue-50 border-y border-blue-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to Compare Rental Cars at {airport.airport_name}?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Compare rental vehicles available at {airport.iata_code} and book
              with trusted suppliers serving {airport.airport_name}.
            </p>
            <a
              href={affiliateUrl(airport.affiliate_sid_base, "mid")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 text-base"
            >
              Check Availability and Prices
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
        </section>

        {city && (
          <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Nearby City"
                title={`Explore Car Rental in ${city.city_name}`}
                subtitle={`See more rental options and local driving information for ${city.city_name}.`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
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
                      City Guide
                    </p>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                      Car Rental in {city.city_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Pickup options · Driving tips · Nearby areas
                    </p>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5">
                    <ChevronRight />
                  </span>
                </Link>

                {nearbyCities.slice(0, 2).map((nearby) => (
                  <Link
                    key={`${nearby.country_slug}-${nearby.city_slug}`}
                    href={cityUrl(nearby)}
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
                        Nearby Destination
                      </p>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                        Car Rental in {nearby.city_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        More pickup locations nearby
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

        {hasFaq && (
          <section className="py-14 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="FAQs"
                title={`Car Rental at ${airport.iata_code} — Common Questions`}
              />
              <div className="flex flex-col gap-3">
                {airport.faq.map((item, index) => (
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
              Find the Best Car Rental Deals at {airport.iata_code}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare suppliers serving {airport.airport_name} and book your
              airport pickup with trusted rental partners.
            </p>
            <a
              href={affiliateUrl(airport.affiliate_sid_base, "bottom")}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
            >
              Compare Airport Car Rental Deals Now
            </a>
            <p className="mt-4 text-blue-200/70 text-xs">
              Free to use · No booking fees
            </p>
          </div>
        </section>

        <section className="py-12 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Navigation
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={`/car-rental/${airport.country_slug}/`}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      Car Rental in {country.country_name}
                    </Link>
                  </li>
                  {city && (
                    <li>
                      <Link
                        href={cityUrl(city)}
                        className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-slate-300">›</span>
                        Car Rental in {city.city_name}
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      All Destinations
                    </Link>
                  </li>
                </ul>
              </div>

              {nearbyCities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Nearby Cities
                  </h3>
                  <ul className="space-y-2">
                    {nearbyCities.slice(0, 6).map((nearby) => (
                      <li key={`${nearby.country_slug}-${nearby.city_slug}`}>
                        <Link
                          href={cityUrl(nearby)}
                          className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-slate-300">›</span>
                          Car Rental in {nearby.city_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Airport Info
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-slate-600 flex items-center gap-1.5">
                    <span className="text-slate-300">›</span>
                    {airport.iata_code} — {airport.airport_name}
                  </li>
                  <li className="text-sm text-slate-600 flex items-center gap-1.5">
                    <span className="text-slate-300">›</span>
                    {airport.pickup_type === "shuttle"
                      ? "Shuttle pickup"
                      : airport.pickup_type === "on_site"
                        ? "On-site pickup"
                        : "Mixed pickup options"}
                  </li>
                  {airport.distance_from_city_km && (
                    <li className="text-sm text-slate-600 flex items-center gap-1.5">
                      <span className="text-slate-300">›</span>
                      {airport.distance_from_city_km} km from city center
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Helpful Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/guide/"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      All Travel Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about/"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      About GetEasyCar
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact/"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}