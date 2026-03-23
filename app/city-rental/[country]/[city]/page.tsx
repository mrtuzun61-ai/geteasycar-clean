import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCitiesIndex,
  getCityBySlug,
  getCountryBySlug,
  getGuidesByCountry,
  resolveAirports,
  resolveNearbyCities,
  type CityIndexEntry,
} from "@/lib/data";
import { getCityHeroImage } from "@/lib/images";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

export async function generateStaticParams() {
  const cities = await getCitiesIndex();

  return cities
    .filter(
      (c) => c.publication_state === "indexed" && c.has_state_layer === false
    )
    .map((c) => ({
      country: c.country_slug,
      city: c.city_slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, city: citySlug } = await params;

  const [city, country] = await Promise.all([
    getCityBySlug(citySlug, countrySlug, null),
    getCountryBySlug(countrySlug),
  ]);

  if (
    !city ||
    !country ||
    city.publication_state !== "indexed" ||
    city.has_state_layer
  ) {
    return { title: "Not Found" };
  }

  const canonical = `https://geteasycar.com${city.canonical_url}`;

  return {
    title: city.meta_title,
    description: city.meta_description,
    alternates: { canonical },
    openGraph: {
      title: city.meta_title,
      description: city.meta_description,
      url: canonical,
      siteName: "GetEasyCar",
      type: "website",
    },
  };
}

function nearbyCityUrl(city: CityIndexEntry): string {
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

export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}) {
  const { country: countrySlug, city: citySlug } = await params;

  const [city, country, guides] = await Promise.all([
    getCityBySlug(citySlug, countrySlug, null),
    getCountryBySlug(countrySlug),
    getGuidesByCountry(countrySlug),
  ]);

  if (
    !city ||
    !country ||
    city.publication_state !== "indexed" ||
    city.has_state_layer
  ) {
    notFound();
  }

  const [cityAirports, nearbyCities] = await Promise.all([
    resolveAirports(city.airport_slugs),
    resolveNearbyCities(city.nearby_city_slugs),
  ]);

  const indexedGuides = guides.filter((g) => g.publication_state === "indexed");
  const hasFaq = city.faq.length >= 3;
  const heroImage = getCityHeroImage(
    city.city_slug,
    city.city_name,
    country.country_name
  );

  const hasPracticalInfo =
    country.driving_notes ||
    country.toll_information ||
    country.fuel_notes ||
    country.parking_notes;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: city.meta_title,
    description: city.meta_description,
    url: `https://geteasycar.com${city.canonical_url}`,
    dateModified: city.last_updated,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: city.breadcrumb_path.map((item, index) => ({
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
        mainEntity: city.faq.map((item) => ({
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
              {city.breadcrumb_path.map((item, index) => (
                <li key={item.url} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-slate-300">
                      /
                    </span>
                  )}
                  {index === city.breadcrumb_path.length - 1 ? (
                    <span
                      className="text-slate-700 font-medium"
                      aria-current="page"
                    >
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
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/88 via-[#163B66]/80 to-[#2C5F95]/62" />

          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[540px] h-[540px] rounded-full bg-sky-300/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-[420px] h-[420px] rounded-full bg-[#0B1D31]/25 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div className="max-w-3xl">
                <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
                  {country.country_name} · City Car Rental
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  {city.h1}
                </h1>

                <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-2xl">
                  {city.intro_paragraph}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={affiliateUrl(city.affiliate_sid_base, "hero")}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Compare Car Rentals in {city.city_name}
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

                  {cityAirports.length > 0 && (
                    <Link
                      href={`/car-rental/airports/${cityAirports[0].airport_slug}/`}
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                    >
                      Airport Pickup Options
                    </Link>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                    <p className="text-blue-200 text-xs uppercase tracking-wide font-semibold">
                      Driving Side
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.driving_side === "left"
                        ? "Drive on the left"
                        : "Drive on the right"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                    <p className="text-blue-200 text-xs uppercase tracking-wide font-semibold">
                      Minimum Age
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.minimum_driver_age}+ years
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                    <p className="text-blue-200 text-xs uppercase tracking-wide font-semibold">
                      Currency
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.currency_code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm p-6">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                  Why book here
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Start with a smarter city rental page
                </h2>
                <div className="space-y-3 text-sm text-blue-50/90">
                  <p>Compare airport and city pickup options before you book.</p>
                  <p>Jump directly to trusted rental partners with no platform booking fees.</p>
                  <p>Use local driving guidance to avoid common mistakes after pickup.</p>
                </div>
                <a
                  href={affiliateUrl(city.affiliate_sid_base, "sidebar")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Check Prices in {city.city_name}
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

        {cityAirports.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Airport Pickup"
                title={`Car Rental at ${city.city_name} Airports`}
                subtitle={`Pick up your rental car directly on arrival at airports serving ${city.city_name}.`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cityAirports.map((airport) => (
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
                        {airport.pickup_type === "shuttle"
                          ? "Free shuttle from terminal"
                          : airport.pickup_type === "on_site"
                            ? "Counter in arrivals hall"
                            : "On-site and shuttle options"}
                      </p>
                      {airport.distance_from_city_km && (
                        <p className="text-slate-500 text-xs mt-1">
                          {airport.distance_from_city_km} km from city center
                        </p>
                      )}
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

        <section className="py-12 sm:py-14 bg-[#F2F6FA] border-y border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to Compare Rental Cars in {city.city_name}?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Compare city pickup and airport rental options in {city.city_name},
              review practical travel information, and continue directly to trusted
              partners when you are ready to book.
            </p>
            <a
              href={affiliateUrl(city.affiliate_sid_base, "mid")}
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
                  label="Local Driving"
                  title={`Driving in ${city.city_name}`}
                  subtitle="Key practical information before you set off."
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
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    Why compare before booking in {city.city_name}?
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Car rental prices in {city.city_name} can vary significantly
                    depending on seasonality, airport pickup charges, vehicle class,
                    insurance choices, and cancellation conditions. Starting with a
                    comparison page helps you review city and airport options before
                    committing to a supplier, which is especially useful in popular
                    destinations and peak travel periods.
                  </p>
                </div>

                {hasPracticalInfo ? (
                  <>
                    {country.driving_notes && (
                      <div className="border-b border-slate-100 pb-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-2">
                          Road Rules in {country.country_name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {country.driving_notes}
                        </p>
                      </div>
                    )}
                    {country.toll_information && (
                      <div className="border-b border-slate-100 pb-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-2">
                          Tolls & Road Charges
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
                          Parking in {city.city_name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {country.parking_notes}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Driving Tips for {city.city_name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Traffic in {country.country_name} drives on the{" "}
                      {country.driving_side === "left" ? "left" : "right"}.
                      The minimum age to rent a car is typically{" "}
                      {country.minimum_driver_age} years old, though young driver
                      surcharges may apply for drivers under 25. Always carry your
                      driving license, passport, and rental documentation. An
                      International Driving Permit is recommended for visitors whose
                      license is not in the local language.
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
              label="Rental Tips"
              title={`Car Rental Tips for ${city.city_name}`}
              subtitle={`Practical advice to help you get the best rental experience in ${city.city_name}.`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Book in advance",
                  body: `Booking ahead in ${city.city_name} often secures better rates and a stronger choice of vehicles, especially during peak travel periods and holiday weekends.`,
                },
                {
                  title: "Compare airport and city pickup",
                  body: `Airport pickup is convenient, but city pickup can sometimes be cheaper. Review both options before deciding which location best fits your trip.`,
                },
                {
                  title: "Check insurance carefully",
                  body: "Review what coverage is included in your booking and whether your credit card provides supplemental rental coverage before buying extra protection.",
                },
                {
                  title: "Bring the right payment card",
                  body: "Most suppliers require a credit card in the primary driver's name for the security deposit. Debit card acceptance is often more limited.",
                },
                {
                  title: "Understand the fuel policy",
                  body: "Many rentals are provided full-to-full. Confirm the policy before pickup and plan where to refuel before returning the vehicle.",
                },
                {
                  title: "Inspect the vehicle",
                  body: "Take photos and note any pre-existing damage before leaving the lot so you are not charged later for issues that were already there.",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    {tip.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {tip.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {hasFaq && (
          <section className="py-14 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="FAQs"
                title={`Car Rental in ${city.city_name} — Common Questions`}
              />
              <div className="flex flex-col gap-3">
                {city.faq.map((item, index) => (
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

        {(indexedGuides.length > 0 || nearbyCities.length > 0) && (
          <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Plan More"
                title={`More ways to plan your ${city.city_name} rental`}
                subtitle="Use nearby destinations and country guides to compare pickup strategies and driving context."
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {nearbyCities.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-slate-900 text-base mb-4">
                      Nearby rental destinations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nearbyCities.slice(0, 6).map((nearby) => (
                        <Link
                          key={nearby.city_slug}
                          href={nearbyCityUrl(nearby)}
                          className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-[#B7CDE3] hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 group-hover:text-[#163B66]">
                            {nearby.city_name}
                          </span>
                          <span className="text-slate-300 group-hover:text-[#2C5F95]">
                            <ChevronRight />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {indexedGuides.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-slate-900 text-base mb-4">
                      Country-level rental guides
                    </h3>
                    <div className="flex flex-col gap-3">
                      {indexedGuides.map((guide) => (
                        <Link
                          key={guide.guide_slug}
                          href={`/guide/${guide.guide_slug}/`}
                          className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-4 hover:border-[#B7CDE3] hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5F95] mb-1">
                              Country Guide
                            </p>
                            <p className="text-sm font-medium text-slate-800 group-hover:text-[#163B66]">
                              {guide.guide_title}
                            </p>
                          </div>
                          <span className="text-slate-300 group-hover:text-[#2C5F95] mt-0.5">
                            <ChevronRight />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
              Find the Best Car Rental Deals in {city.city_name}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare city and airport pickup options, review trusted suppliers,
              and choose the vehicle that fits your trip in {city.city_name}.
            </p>
            <a
              href={affiliateUrl(city.affiliate_sid_base, "bottom")}
              className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
            >
              Compare Car Rental Deals Now
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
                      href={`/car-rental/${countrySlug}/`}
                      className="text-sm text-slate-600 hover:text-[#2C5F95] transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      Car Rental in {country.country_name}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/car-rental/airports/"
                      className="text-sm text-slate-600 hover:text-[#2C5F95] transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      All Airport Rental Locations
                    </Link>
                  </li>
                </ul>
              </div>

              {cityAirports.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Airport Rentals
                  </h3>
                  <ul className="space-y-2">
                    {cityAirports.map((airport) => (
                      <li key={`${airport.iata_code}-link`}>
                        <Link
                          href={`/car-rental/airports/${airport.airport_slug}/`}
                          className="text-sm text-slate-600 hover:text-[#2C5F95] transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-slate-300">›</span>
                          {airport.iata_code} — {airport.airport_name_short}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nearbyCities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Nearby Destinations
                  </h3>
                  <ul className="space-y-2">
                    {nearbyCities.slice(0, 5).map((nearby) => (
                      <li key={nearby.city_slug}>
                        <Link
                          href={nearbyCityUrl(nearby)}
                          className="text-sm text-slate-600 hover:text-[#2C5F95] transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-slate-300">›</span>
                          Car Rental in {nearby.city_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {indexedGuides.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Travel Guides
                  </h3>
                  <ul className="space-y-2">
                    {indexedGuides.map((guide) => (
                      <li key={guide.guide_slug}>
                        <Link
                          href={`/guide/${guide.guide_slug}/`}
                          className="text-sm text-slate-600 hover:text-[#2C5F95] transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-slate-300">›</span>
                          {guide.guide_title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}