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
            light ? "text-stone-300" : "text-[#7A5C2E]"
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
            light ? "text-stone-200/90" : "text-slate-500"
          }`}
        >
          {subtitle}
        </p>
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

      <div className="min-h-screen bg-[#F8F7F4]">
        <section className="relative overflow-hidden">
          <img
            src={GUIDE_INDEX_HERO_IMAGE}
            alt="Car rental travel guides"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#161B22]/78 via-[#24303A]/68 to-[#7A5C2E]/36" />
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[520px] h-[520px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 -left-20 w-[420px] h-[420px] rounded-full bg-[#7A5C2E]/18 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-stone-200 text-sm font-semibold uppercase tracking-[0.24em] mb-4">
                Practical Country Guides
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
                Car Rental Travel Guides
              </h1>
              <p className="text-stone-100/90 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
                Explore practical country guides covering driving rules, toll roads,
                fuel, parking, airport pickup, and rental tips before you book.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={affiliateUrl("guide_index_hero")}
                  className="inline-flex items-center gap-2 bg-white text-[#24303A] hover:bg-stone-100 active:bg-stone-200 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg"
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
                <Link
                  href="/car-rental/airports/"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors border border-white/15"
                >
                  Browse Airports
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                "Practical driving advice",
                "Airport and city pickup tips",
                "Trusted rental guidance",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#F8F7F4] px-4 py-3"
                >
                  <span className="w-8 h-8 rounded-full bg-[#EFE7D6] text-[#7A5C2E] flex items-center justify-center font-bold">
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
              label="Country Guides"
              title="Browse Car Rental Guides by Country"
              subtitle="Learn the local rules and practical details before renting abroad."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {indexedGuides.map((guide) => (
                <Link
                  key={guide.guide_slug}
                  href={`/guide/${guide.guide_slug}/`}
                  className="group flex items-start gap-4 p-6 bg-white border border-stone-200 rounded-3xl hover:border-[#D8C5A0] hover:shadow-lg hover:shadow-stone-200/40 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#F3EBDD] flex items-center justify-center shrink-0 group-hover:bg-[#EADBBE] transition-colors">
                    <svg
                      className="w-5 h-5 text-[#7A5C2E]"
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
                    <p className="text-xs text-[#7A5C2E] font-semibold uppercase tracking-wide mb-1">
                      {countryName(guide.country_slug, countries)}
                    </p>
                    <h3 className="font-semibold text-slate-900 group-hover:text-[#5E451D] transition-colors text-base leading-snug">
                      {guide.guide_title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {guideSubtitle(guide, countries)}
                    </p>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#7A5C2E] transition-colors shrink-0 mt-0.5">
                    <ChevronRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {guideCountries.length > 0 && (
          <section className="py-14 sm:py-16 bg-white border-y border-stone-200">
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
                    className="group flex items-center justify-between gap-2 p-4 bg-[#F8F7F4] border border-stone-200 rounded-2xl hover:border-[#D8C5A0] hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-semibold text-slate-900 text-sm group-hover:text-[#5E451D] transition-colors">
                      {country.country_name}
                    </span>
                    <span className="text-slate-300 group-hover:text-[#7A5C2E] transition-colors">
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 sm:py-16 bg-[#F3EEE5] border-y border-stone-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ready to Compare Car Rental Options?
            </h2>
            <p className="text-slate-600 text-base mb-7 leading-relaxed">
              Find and compare rental vehicles across cities and airports
              worldwide. Connect directly with trusted suppliers with no booking fees.
            </p>
            <a
              href={affiliateUrl("guide_index_mid")}
              className="inline-flex items-center gap-2 bg-[#24303A] hover:bg-[#1B252D] active:bg-[#121920] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg text-base"
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

        <section className="py-16 sm:py-20">
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
                  className="flex flex-col gap-3 p-6 bg-white border border-stone-200 rounded-3xl"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#F3EBDD] flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-[#7A5C2E]"
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

        <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-[#24303A] to-[#161B22]">
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#7A5C2E]/15 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Compare Car Rental Deals Worldwide
            </h2>
            <p className="text-stone-200 text-base mb-8 leading-relaxed">
              Use the guides, then compare rental options across trusted suppliers
              serving airports and cities worldwide.
            </p>
            <a
              href={affiliateUrl("guide_index_bottom")}
              className="inline-flex items-center gap-2 bg-white text-[#24303A] hover:bg-stone-100 active:bg-stone-200 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl text-base"
            >
              Compare Car Rental Deals Now
            </a>
            <p className="mt-4 text-stone-300/70 text-xs">
              Free to use · No booking fees
            </p>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-stone-200">
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
                      className="text-sm text-slate-600 hover:text-[#7A5C2E] transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-300">›</span>
                      Homepage
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guide/"
                      className="text-sm text-slate-600 hover:text-[#7A5C2E] transition-colors flex items-center gap-1.5"
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
                          className="text-sm text-slate-600 hover:text-[#7A5C2E] transition-colors flex items-center gap-1.5"
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
                          className="text-sm text-slate-600 hover:text-[#7A5C2E] transition-colors flex items-center gap-1.5"
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