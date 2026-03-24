import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAirportBySlug,
  getAirportsByCountry,
  getAirportsIndex,
  getCityBySlug,
  getCountryBySlug,
  getGuidesByCountry,
} from "@/lib/data";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

const AIRPORT_HERO_IMAGES: Record<string, string> = {
  cdg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80",
  ory: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1800&q=80",
  nce: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
  lys: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1800&q=80",
  mrs: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80",
  bcn: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1800&q=80",
  mad: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1800&q=80",
  fco: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=80",
  lax: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1800&q=80",
  mco: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1800&q=80",
  mia: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1800&q=80",
  syd: "https://images.unsplash.com/photo-1523428096881-5bd79d043006?auto=format&fit=crop&w=1800&q=80",
  mel: "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1800&q=80",
  bne: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  per: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1800&q=80",
  adl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80",
};

function getAirportHeroImage(iataCode: string): string {
  return (
    AIRPORT_HERO_IMAGES[iataCode.toLowerCase()] ||
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80"
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

function cityUrl(city: {
  country_slug: string;
  state_slug: string | null;
  city_slug: string;
  has_state_layer: boolean;
}) {
  if (city.has_state_layer && city.state_slug) {
    return `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`;
  }
  return `/city-rental/${city.country_slug}/${city.city_slug}/`;
}

function getPickupSummary(
  pickupType: "on_site" | "shuttle" | "mixed",
  shuttleNotes: string | null
) {
  if (pickupType === "on_site") {
    return "Most travelers prefer airport pickup because counters are usually inside the terminal complex or a short walk from arrivals.";
  }
  if (pickupType === "shuttle") {
    return shuttleNotes
      ? shuttleNotes
      : "This airport commonly uses shuttle transfers to reach the rental lot, so allow extra time after landing.";
  }
  return "This airport may offer a mix of in-terminal counters and off-airport shuttle pickup depending on supplier and vehicle category.";
}

function getReturnSummary(
  pickupType: "on_site" | "shuttle" | "mixed",
  airportNameShort: string
) {
  if (pickupType === "on_site") {
    return `Returning your car at ${airportNameShort} is usually the simplest option because return lanes are generally signposted close to the terminal road system.`;
  }
  if (pickupType === "shuttle") {
    return `Return procedures at ${airportNameShort} may include dropping the vehicle at an off-airport lot and taking a shuttle back to the terminal, so leave extra time before your flight.`;
  }
  return `Return arrangements at ${airportNameShort} depend on the supplier. Some providers use on-airport return bays while others require a shuttle connection back to departures.`;
}

export async function generateStaticParams() {
  const airports = await getAirportsIndex();
  return airports
    .filter((airport) => airport.publication_state === "indexed")
    .map((airport) => ({
      airport: airport.airport_slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ airport: string }>;
}): Promise<Metadata> {
  const { airport: airportSlug } = await params;
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
      siteName: "GetEasyCar",
      type: "website",
    },
  };
}

export default async function AirportPage({
  params,
}: {
  params: Promise<{ airport: string }>;
}) {
  const { airport: airportSlug } = await params;

  const airport = await getAirportBySlug(airportSlug);

  if (!airport || airport.publication_state !== "indexed") {
    notFound();
  }

  const [country, city, countryAirports, countryGuides] = await Promise.all([
    getCountryBySlug(airport.country_slug),
    getCityBySlug(airport.city_slug, airport.country_slug, airport.state_slug),
    getAirportsByCountry(airport.country_slug),
    getGuidesByCountry(airport.country_slug),
  ]);

  if (!country || !city) {
    notFound();
  }

  const heroImage = getAirportHeroImage(airport.iata_code);
  const relatedAirports = countryAirports
    .filter(
      (item) =>
        item.publication_state === "indexed" &&
        item.airport_slug !== airport.airport_slug
    )
    .slice(0, 6);

  const indexedGuides = countryGuides
    .filter((guide) => guide.publication_state === "indexed")
    .slice(0, 6);

  const faqItems =
    airport.faq.length >= 3
      ? airport.faq
      : [
          {
            question: `Where do I pick up my rental car at ${airport.airport_name_short}?`,
            answer: getPickupSummary(airport.pickup_type, airport.shuttle_notes),
          },
          {
            question: `Should I rent a car at ${airport.airport_name_short} or in the city?`,
            answer: `Airport pickup at ${airport.airport_name_short} is usually the easiest option if you want to start driving immediately after arrival. City pickup can work for travelers who plan to spend time downtown before beginning a road trip.`,
          },
          {
            question: `How early should I return my rental car at ${airport.airport_name_short}?`,
            answer: getReturnSummary(airport.pickup_type, airport.airport_name_short),
          },
        ];

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
              {airport.breadcrumb_path.map((item, index) => (
                <li key={item.url} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-slate-300">
                      /
                    </span>
                  )}
                  {index === airport.breadcrumb_path.length - 1 ? (
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
            alt={`${airport.airport_name} car rental`}
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

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div className="max-w-3xl">
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-4">
                  Airport Rental Hub · {airport.iata_code}
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  {airport.h1}
                </h1>

                <p className="text-blue-50 text-lg leading-relaxed mb-8 max-w-2xl">
                  {airport.intro_paragraph}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={affiliateUrl(airport.affiliate_sid_base, "hero")}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Compare Car Rentals at {airport.iata_code}
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
                    href={cityUrl(city)}
                    className="inline-flex items-center justify-center gap-2 bg-white/12 hover:bg-white/18 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                  >
                    Explore {city.city_name}
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-4xl">
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Pickup Type
                    </p>
                    <p className="mt-1 text-white font-semibold capitalize">
                      {airport.pickup_type === "on_site"
                        ? "On-site"
                        : airport.pickup_type === "shuttle"
                          ? "Shuttle"
                          : "Mixed"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Distance
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {airport.distance_from_city_km} km
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      City
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {city.city_name}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Country
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {country.country_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/12 backdrop-blur-sm p-6">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                  Airport Snapshot
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                  What to expect at {airport.airport_name_short}
                </h2>
                <div className="space-y-3 text-sm text-blue-50/90">
                  <p>{getPickupSummary(airport.pickup_type, airport.shuttle_notes)}</p>
                  <p>
                    Terminal details: {airport.terminal_info}
                  </p>
                  <p>
                    Most travelers choose airport pickup here for easier luggage handling
                    and immediate road access after arrival.
                  </p>
                </div>
                <a
                  href={affiliateUrl(airport.affiliate_sid_base, "sidebar")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Check Prices at {airport.iata_code}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium text-slate-600">
              {[
                "Strong airport availability",
                "Trusted rental partners",
                "Easy comparison flow",
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

        <section className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Pickup Experience"
              title={`Picking up your rental car at ${airport.airport_name_short}`}
              subtitle="Know where to go, how much time to allow, and what kind of handoff to expect."
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Terminal access
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {airport.terminal_info}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Pickup style
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {getPickupSummary(airport.pickup_type, airport.shuttle_notes)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Distance from city
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {airport.airport_name_short} sits about {airport.distance_from_city_km} km
                  from central {city.city_name}, which makes airport pickup especially useful
                  for late arrivals, early departures, and direct regional driving.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              light
              label="Airport vs City"
              title={`Should you rent at ${airport.iata_code} or in ${city.city_name}?`}
              subtitle="Airport pickup is usually best for convenience. City pickup may work if you plan to stay downtown before driving."
            />
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="grid grid-cols-3 text-sm">
                <div className="p-4 font-semibold text-white border-b border-white/10">
                  Feature
                </div>
                <div className="p-4 font-semibold text-white border-b border-white/10">
                  Airport
                </div>
                <div className="p-4 font-semibold text-white border-b border-white/10">
                  City
                </div>

                <div className="p-4 text-slate-300 border-b border-white/10">
                  Convenience after arrival
                </div>
                <div className="p-4 text-white border-b border-white/10">
                  High
                </div>
                <div className="p-4 text-slate-300 border-b border-white/10">
                  Medium
                </div>

                <div className="p-4 text-slate-300 border-b border-white/10">
                  Vehicle choice
                </div>
                <div className="p-4 text-white border-b border-white/10">
                  Usually broader
                </div>
                <div className="p-4 text-slate-300 border-b border-white/10">
                  Often narrower
                </div>

                <div className="p-4 text-slate-300 border-b border-white/10">
                  Best for luggage
                </div>
                <div className="p-4 text-white border-b border-white/10">
                  Excellent
                </div>
                <div className="p-4 text-slate-300 border-b border-white/10">
                  Moderate
                </div>

                <div className="p-4 text-slate-300">
                  Best for city-only stays
                </div>
                <div className="p-4 text-white">
                  Sometimes less ideal
                </div>
                <div className="p-4 text-slate-300">
                  Often better
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href={affiliateUrl(airport.affiliate_sid_base, "comparison")}
                className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                Compare Current Airport Rental Deals
              </a>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 bg-[#F2F6FA] border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Return Process"
              title={`Returning your rental car at ${airport.airport_name_short}`}
              subtitle="The hand-back process matters just as much as pickup, especially for morning flights and tight check-in windows."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  What to expect
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {getReturnSummary(airport.pickup_type, airport.airport_name_short)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Smart return tips
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Refill fuel if your booking requires full-to-full return, allow extra
                  time for terminal traffic, and photograph the vehicle after parking if
                  you are returning outside desk hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to compare rental cars at {airport.airport_name_short}?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Compare airport pickup options, review supplier access details, and choose
              the vehicle that fits your route, budget, and arrival time.
            </p>
            <a
              href={affiliateUrl(airport.affiliate_sid_base, "mid")}
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
            <SectionHeading
              label="Local Driving"
              title={`Driving after pickup from ${airport.airport_name_short}`}
              subtitle={`Use these country-level basics before leaving ${airport.airport_name}.`}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <div className="flex flex-col gap-3">
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

        {relatedAirports.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Related Airports"
                title={`More airport rental locations in ${country.country_name}`}
                subtitle="Use these nearby airport pages to compare access points before choosing where to collect your car."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedAirports.map((item) => (
                  <Link
                    key={item.airport_slug}
                    href={`/car-rental/airports/${item.airport_slug}/`}
                    className="group flex flex-col gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#B7CDE3] hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex bg-[#2C5F95] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg tracking-wider">
                        {item.iata_code}
                      </span>
                      <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                        <ChevronRight />
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-900 font-semibold text-base leading-snug">
                        {item.airport_name}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        {country.country_name}
                      </p>
                    </div>
                    <p className="text-[#2C5F95] text-sm font-medium">
                      View airport page
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {indexedGuides.length > 0 && (
          <section className="py-14 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Guides"
                title={`Country guides for ${country.country_name}`}
                subtitle="Read practical driving and rental guidance before choosing your pickup strategy."
              />
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
            </div>
          </section>
        )}

        <section className="py-14 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="FAQs"
              title={`Car rental at ${airport.airport_name_short} — common questions`}
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
              Find the best car rental deals at {airport.airport_name_short}
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare pickup options, review terminal access, and choose the right
              vehicle before you land.
            </p>
            <a
              href={affiliateUrl(airport.affiliate_sid_base, "bottom")}
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