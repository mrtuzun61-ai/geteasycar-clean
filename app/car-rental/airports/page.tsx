import type { Metadata } from "next";
import Link from "next/link";
import {
  getAirportsIndex,
  getCountriesIndex,
  getCountryBySlug,
  getGuidesIndex,
} from "@/lib/data";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

const HUB_HERO_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80";

const COUNTRY_HERO_IMAGES: Record<string, string> = {
  france:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  spain:
    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
  italy:
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=80",
  australia:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8d77f?auto=format&fit=crop&w=1200&q=80",
  "united-states":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
};

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

export const metadata: Metadata = {
  title: "Airport Car Rental Guides — Compare Major Pickup Locations",
  description:
    "Compare airport car rental pickup points across major destinations. Browse airport rental guides, country hubs, and smarter booking paths.",
  alternates: {
    canonical: "https://geteasycar.com/car-rental/airports/",
  },
  openGraph: {
    title: "Airport Car Rental Guides — Compare Major Pickup Locations",
    description:
      "Compare airport car rental pickup points across major destinations and browse smarter airport rental guidance.",
    url: "https://geteasycar.com/car-rental/airports/",
    siteName: "GetEasyCar",
    type: "website",
  },
};

export default async function AirportsHubPage() {
  const [airports, countries, guides] = await Promise.all([
    getAirportsIndex(),
    getCountriesIndex(),
    getGuidesIndex(),
  ]);

  const indexedAirports = airports.filter(
    (airport) => airport.publication_state === "indexed"
  );

  const indexedCountries = countries.filter(
    (country) => country.publication_state === "indexed"
  );

  const indexedGuides = guides
    .filter((guide) => guide.publication_state === "indexed")
    .slice(0, 6);

  const countriesWithImages = await Promise.all(
    indexedCountries.map(async (country) => {
      const fullCountry = await getCountryBySlug(country.country_slug);
      return {
        ...country,
        affiliateSidBase:
          fullCountry?.affiliate_sid_base || `country_${country.country_slug}`,
        image:
          COUNTRY_HERO_IMAGES[country.country_slug] ||
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
      };
    })
  );

  const groupedAirports = countriesWithImages
    .map((country) => ({
      ...country,
      airports: indexedAirports.filter(
        (airport) => airport.country_slug === country.country_slug
      ),
    }))
    .filter((country) => country.airports.length > 0);

  const featuredAirports = indexedAirports.slice(0, 9);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Airport Car Rental Guides — Compare Major Pickup Locations",
    description:
      "Compare airport car rental pickup points across major destinations. Browse airport rental guides, country hubs, and smarter booking paths.",
    url: "https://geteasycar.com/car-rental/airports/",
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
          name: "Airports",
          item: "https://geteasycar.com/car-rental/airports/",
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is it better to rent a car at the airport or in the city?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Airport pickup is usually the best option for travelers who want convenience after landing, broader vehicle choice, and easier access to highways. City pickup can make sense if you plan to stay downtown before starting your drive.",
        },
      },
      {
        "@type": "Question",
        name: "Are airport car rentals usually more expensive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Airport rentals can sometimes cost more because of airport concession fees, but they often provide stronger availability and a wider choice of suppliers. The best approach is to compare airport and city options before booking.",
        },
      },
      {
        "@type": "Question",
        name: "What should I know before picking up a rental car at the airport?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check whether the supplier is on-site or requires a shuttle, review fuel and return policies, confirm driving documents, and allow enough time for pickup lines or transfer delays after landing.",
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
                <span className="text-slate-700 font-medium" aria-current="page">
                  Airports
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <section className="relative overflow-hidden">
          <img
            src={HUB_HERO_IMAGE}
            alt="Airport car rental hub"
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
                  Global Airport Rental Hub
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                  Compare Airport Car Rental Pickup Locations
                </h1>

                <p className="text-blue-50 text-lg leading-relaxed mb-8 max-w-2xl">
                  Explore major airport rental pickup points across top travel
                  destinations, compare country hubs, and find smarter airport
                  booking paths before you land.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={affiliateUrl("airports_hub", "hero")}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Compare Airport Car Rentals
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
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-white/12 hover:bg-white/18 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/20"
                  >
                    Back to Home
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Airports Indexed
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {indexedAirports.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Countries
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      {groupedAirports.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/12 px-4 py-4 backdrop-blur-sm">
                    <p className="text-blue-100 text-xs uppercase tracking-wide font-semibold">
                      Best Use
                    </p>
                    <p className="mt-1 text-white font-semibold">
                      Arrival pickup planning
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/12 backdrop-blur-sm p-6">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                  Why airport pages matter
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Choose the right pickup point before you fly
                </h2>
                <div className="space-y-3 text-sm text-blue-50/90">
                  <p>Compare on-site and shuttle pickup expectations.</p>
                  <p>Review airport versus city pickup strategies.</p>
                  <p>Move directly into country and city rental pages.</p>
                </div>
                <a
                  href={affiliateUrl("airports_hub", "sidebar")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Check Airport Deals
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium text-slate-600">
              {[
                "Broader airport availability",
                "Trusted rental partners",
                "Stronger route planning",
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
              label="Featured Airports"
              title="Major airport rental locations"
              subtitle="Start with some of the strongest airport pickup pages currently available."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredAirports.map((airport) => (
                <Link
                  key={airport.airport_slug}
                  href={`/car-rental/airports/${airport.airport_slug}/`}
                  className="group flex flex-col gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#B7CDE3] hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex bg-[#2C5F95] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg tracking-wider">
                      {airport.iata_code}
                    </span>
                    <span className="text-slate-300 group-hover:text-[#2C5F95] transition-colors">
                      <ChevronRight />
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-base leading-snug">
                      {airport.airport_name}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      {airport.city_slug.replace(/-/g, " ")}
                    </p>
                  </div>
                  <p className="text-[#2C5F95] text-sm font-medium">
                    View airport guide
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              light
              label="Airport vs City"
              title="Airport pickup or city pickup?"
              subtitle="Use airport pickup when convenience matters most. Use city pickup when you plan to stay downtown before driving."
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
                  Often smaller
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
                href={affiliateUrl("airports_hub", "comparison")}
                className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                Compare Airport Rental Prices
              </a>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 bg-[#F2F6FA] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Browse by Country"
              title="Airport rental hubs by destination"
              subtitle="Jump into the countries where airport pickup pages are already available."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groupedAirports.map((country) => (
                <div
                  key={country.country_slug}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <div className="relative h-48">
                    <img
                      src={country.image}
                      alt={`${country.country_name} airport rentals`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F2742]/55 via-[#163B66]/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">
                        Country Airport Hub
                      </p>
                      <h3 className="text-white text-2xl font-bold tracking-tight">
                        {country.country_name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-slate-500">
                        {country.airports.length} indexed airport pages
                      </p>
                      <Link
                        href={`/car-rental/${country.country_slug}/`}
                        className="text-sm font-semibold text-[#2C5F95] hover:text-[#163B66] transition-colors"
                      >
                        Country hub →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {country.airports.slice(0, 4).map((airport) => (
                        <Link
                          key={airport.airport_slug}
                          href={`/car-rental/airports/${airport.airport_slug}/`}
                          className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-[#B7CDE3] hover:bg-white transition-all"
                        >
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C5F95] mb-1">
                              {airport.iata_code}
                            </p>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-[#163B66]">
                              {airport.airport_name}
                            </p>
                          </div>
                          <span className="text-slate-300 group-hover:text-[#2C5F95]">
                            <ChevronRight />
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                      <a
                        href={affiliateUrl(country.affiliateSidBase, "hub")}
                        className="inline-flex items-center justify-center gap-2 bg-[#163B66] hover:bg-[#1E4C82] text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
                      >
                        Compare Cars in {country.country_name}
                      </a>
                      <Link
                        href={`/car-rental/${country.country_slug}/`}
                        className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-[#B7CDE3] text-slate-700 font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                      >
                        Explore Country Pages
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {indexedGuides.length > 0 && (
          <section className="py-14 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Travel Guides"
                title="Airport rental guidance and driving help"
                subtitle="Use these editorial pages before choosing an airport pickup strategy."
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
                        Guide
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
              title="Airport car rental — common questions"
            />
            <div className="flex flex-col gap-3">
              {[
                {
                  q: "Is it better to rent at the airport or in the city?",
                  a: "Airport pickup is usually the best option for convenience, luggage handling, and immediate access after arrival. City pickup can make sense if you plan to stay in the center before driving.",
                },
                {
                  q: "Are airport rentals more expensive?",
                  a: "They can be, especially where airport concession fees apply. But airport locations also tend to offer broader availability and better supplier choice, so comparing options is important.",
                },
                {
                  q: "What should I check before booking airport pickup?",
                  a: "Look at pickup type, shuttle requirements, terminal access, return process, fuel policy, and document requirements before you confirm your reservation.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="border border-slate-200 rounded-xl bg-white p-5"
                >
                  <p className="font-semibold text-slate-900 text-sm mb-2">
                    {item.q}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.a}
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
              Find the best airport rental deals now
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Compare airport pickup points, review travel guidance, and choose the
              best car before you land.
            </p>
            <a
              href={affiliateUrl("airports_hub", "bottom")}
              className="inline-flex items-center gap-2 bg-white text-[#163B66] hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
            >
              Compare Airport Car Rental Deals
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