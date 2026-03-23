import type { Metadata } from "next";
import Link from "next/link";
import {
  getGuidesIndex,
  getCountries,
  type GuideIndexEntry,
  type CountryRecord,
} from "@/lib/data";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

const GUIDE_INDEX_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80";

function affiliateUrl(sid: string): string {
  return `${AFFILIATE_BASE}${sid}`;
}

export const metadata: Metadata = {
  title: "Car Rental Travel Guides | Get Easy Car",
  description:
    "Explore practical car rental travel guides covering driving rules, tolls, fuel, parking, and rental tips across popular countries.",
  alternates: {
    canonical: "https://geteasycar.com/guide/",
  },
  openGraph: {
    title: "Car Rental Travel Guides | Get Easy Car",
    description:
      "Explore practical car rental travel guides covering driving rules, tolls, fuel, parking, and rental tips across popular countries.",
    url: "https://geteasycar.com/guide/",
    siteName: "Get Easy Car",
    type: "website",
  },
};

function guideSubtitle(guide: GuideIndexEntry, countries: CountryRecord[]): string {
  const country = countries.find((c) => c.country_slug === guide.country_slug);
  const countryName =
    country?.country_name ??
    guide.country_slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return `Driving rules, tolls, fuel, parking, and rental tips for ${countryName}.`;
}

function countryName(slug: string, countries: CountryRecord[]): string {
  const country = countries.find((c) => c.country_slug === slug);
  return (
    country?.country_name ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
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

export default async function GuideIndexPage() {
  const [guides, countries] = await Promise.all([getGuidesIndex(), getCountries()]);

  const indexedGuides = guides.filter((g) => g.publication_state === "indexed");

  const guideCountrySlugs = Array.from(
    new Set(indexedGuides.map((guide) => guide.country_slug))
  );

  const guideCountries = countries.filter(
    (country) =>
      country.publication_state === "indexed" &&
      guideCountrySlugs.includes(country.country_slug)
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Car Rental Travel Guides | Get Easy Car",
    description:
      "Explore practical car rental travel guides covering driving rules, tolls, fuel, parking, and rental tips across popular countries.",
    url: "https://geteasycar.com/guide/",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${GUIDE_INDEX_HERO_IMAGE})` }}
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
                Practical Country Guides
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
                Car Rental Travel Guides
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl">
                Explore practical country guides covering driving rules, toll roads,
                fuel, parking, airport pickup, and rental tips before you book.
              </p>
              <a
                href={affiliateUrl("guide_index_hero")}
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
              >
                Compare Car Rental Deals Now
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
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium text-slate-600">
              {[
                "Practical Driving Advice",
                "Airport & City Pickup Tips",
                "Trusted Rental Guidance",
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
              label="Country Guides"
              title="Browse Car Rental Guides by Country"
              subtitle="Learn the local rules and practical details before renting abroad."
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
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                      {countryName(guide.country_slug, countries)}
                    </p>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                      {guide.guide_title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2">
                      {guideSubtitle(guide, countries)}
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

        {guideCountries.length > 0 && (
          <section className="py-12 sm:py-14 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="Country Hubs"
                title="Jump to Country Rental Pages"
                subtitle="Go directly to country-level rental hubs for cities, airports, and guides."
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {guideCountries.map((country) => (
                  <Link
                    key={country.country_slug}
                    href={`/car-rental/${country.country_slug}/`}
                    className="group flex items-center justify-between gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                  >
                    <span className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                      {country.country_name}
                    </span>
                    <span className="text-slate-300 group-hover:text-blue-500 transition-colors">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 sm:py-16 bg-blue-50 border-y border-blue-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to Compare Car Rental Options?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Find and compare rental vehicles across cities and airports
              worldwide. Connect directly with trusted suppliers — no booking fees.
            </p>
            <a
              href={affiliateUrl("guide_index_mid")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 text-base"
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
              label="Why These Guides Help"
              title="Use These Guides Before You Book"
              subtitle="A quick guide can save time, reduce stress, and help you avoid costly mistakes."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Understand local driving rules",
                  body: "Learn the basics before pickup, including traffic side, toll systems, fuel rules, and local road expectations.",
                },
                {
                  title: "Plan airport pickup better",
                  body: "See which airports serve your destination and understand how pickup works before you land.",
                },
                {
                  title: "Avoid common rental mistakes",
                  body: "Prepare the right documents, review insurance properly, and understand fuel and return policies in advance.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
              Compare Car Rental Deals Worldwide
            </h2>
            <p className="text-blue-100 text-base mb-8 leading-relaxed">
              Use the guides, then compare rental options across trusted suppliers
              serving airports and cities worldwide.
            </p>
            <a
              href={affiliateUrl("guide_index_bottom")}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl shadow-blue-900/20 text-base"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Platform
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      Homepage
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guide/"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      All Travel Guides
                    </Link>
                  </li>
                </ul>
              </div>

              {guideCountries.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Country Hubs
                  </h3>
                  <ul className="space-y-2">
                    {guideCountries.map((country) => (
                      <li key={country.country_slug}>
                        <Link
                          href={`/car-rental/${country.country_slug}/`}
                          className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-slate-300">›</span>
                          Car Rental in {country.country_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {indexedGuides.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Guide Pages
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