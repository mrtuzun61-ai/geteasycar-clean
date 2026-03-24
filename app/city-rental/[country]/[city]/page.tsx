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

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

const CITY_HERO_IMAGES: Record<string, string> = {
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=80",
  barcelona:
    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1800&q=80",
  madrid:
    "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1800&q=80",
  rome:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=80",
  "los-angeles":
    "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1800&q=80",
  orlando:
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1800&q=80",
  sydney:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8d4a5?auto=format&fit=crop&w=1800&q=80",
  miami:
    "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1800&q=80",
};

function getCityHeroImage(
  citySlug: string,
  cityName: string,
  countryName: string
): string {
  return (
    CITY_HERO_IMAGES[citySlug] ||
    `https://images.unsplash.com/featured/1800x1000/?${encodeURIComponent(
      `${cityName},${countryName},city,travel`
    )}`
  );
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

function FaqAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="p-5">
        <p className="font-semibold text-slate-900 text-sm mb-2">{question}</p>
        <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const cities = await getCitiesIndex();
  return cities
    .filter((c) => c.publication_state === "indexed" && c.has_state_layer === false)
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
    getCityBySlug(citySlug, countrySlug,),
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
      siteName: "Get Easy Car",
      type: "website",
    },
  };
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

  const hasPracticalInfo =
    !!country.driving_notes ||
    !!country.toll_information ||
    !!country.fuel_notes ||
    !!country.parking_notes;

  const heroImage = getCityHeroImage(
    city.city_slug,
    city.city_name,
    country.country_name
  );

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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-700/75 to-blue-500/65" />
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
                {country.country_name} · Car Rental
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                {city.h1}
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl">
                {city.intro_paragraph}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={affiliateUrl(city.affiliate_sid_base, "hero")}
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Compare Car Rentals in {city.city_name}
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
                {cityAirports.length > 0 && (
                  <Link
                    href={`/car-rental/airports/${cityAirports[0].airport_slug}/`}
                    className="inline-flex items-center justify-center gap-2 bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                  >
                    Airport Pickup
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium text-slate-600">
              {[
                "Free Cancellation Available",
                "No Hidden Platform Fees",
                "Trusted Rental Partners",
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

        <section className="py-12 sm:py-14 bg-blue-50 border-y border-blue-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to Compare Rental Cars in {city.city_name}?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Find and compare rental vehicles across {city.city_name} and
              surrounding areas. Connect directly with trusted suppliers — no
              booking fees.
            </p>
            <a
              href={affiliateUrl(city.affiliate_sid_base, "mid")}
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

        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <SectionHeading
                  label="Local Driving"
                  title={`Driving in ${city.city_name}`}
                  subtitle="Key information before you set off."
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
                      {country.minimum_driver_age} years old, though young
                      driver surcharges may apply for drivers under 25. Carry
                      your driving license, passport, and rental documentation
                      at all times. An International Driving Permit is
                      recommended for visitors whose license is not in the local
                      language.
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
                  icon: (
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  ),
                  title: "Book in Advance",
                  body: `Rental availability in ${city.city_name} is strong, but booking ahead secures better rates and your preferred vehicle category — especially during peak travel periods.`,
                },
                {
                  icon: (
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  title: "Check Insurance Options",
                  body: `Review what coverage is included in your rental. Some credit cards offer supplemental coverage — check your card benefits before purchasing additional insurance at the counter.`,
                },
                {
                  icon: (
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
                        d="M15 9a2 2 0 10-4 0v5a2 2 0 01-2 2h6m-6-4h4m8 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Understand Fuel Policy",
                  body: `Most rentals come with a full tank and ask you to return it full. Confirm the fuel policy at pickup and note the nearest fuel station to your return location.`,
                },
                {
                  icon: (
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  ),
                  title: "Bring a Credit Card",
                  body: `A credit card in the primary driver's name is required by most suppliers for the security deposit. Some suppliers do not accept debit cards for the deposit even if they accept them for payment.`,
                },
                {
                  icon: (
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
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2"
                      />
                    </svg>
                  ),
                  title: "Carry Your Documents",
                  body: `You will need your driving license, passport or national ID, and booking confirmation. If your license is not in English or the local language, carry an International Driving Permit.`,
                },
                {
                  icon: (
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
                  ),
                  title: "Inspect Before You Drive",
                  body: `Walk around the vehicle with the rental agent before driving away. Note any existing damage on the inspection form and photograph it — this protects you from being charged for pre-existing issues.`,
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    {tip.icon}
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
                  <FaqAccordionItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {indexedGuides.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Travel Guides"
                title={`Car Rental Guides for ${country.country_name}`}
                subtitle={`Essential information for renting a car in ${country.country_name}.`}
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
              Find the Best Car Rental Deals in {city.city_name}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare options across all suppliers serving {city.city_name}.
              Transparent pricing, trusted partners.
            </p>
            <a
              href={affiliateUrl(city.affiliate_sid_base, "bottom")}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
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
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      Car Rental in {country.country_name}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/guide/`}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      All Travel Guides
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
                          className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
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
                          className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
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