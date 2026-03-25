import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getGuidesIndex, getGuideBySlug, getCountryBySlug } from "@/lib/data";
import { getGuideHeroImage } from "@/lib/images";

const AFFILIATE_BASE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=";

function affiliateUrl(sidBase: string, position: string): string {
  return `${AFFILIATE_BASE}${sidBase}_${position}`;
}

type GuideFaqItem = {
  question: string;
  answer: string;
};

type GuideSection = {
  section_title: string;
  content: string;
};

export async function generateStaticParams() {
  const guides = await getGuidesIndex();

  return guides
    .filter((g: any) => g.publication_state === "indexed")
    .map((g: any) => ({
      "guide-slug": g.guide_slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "guide-slug": string }>;
}): Promise<Metadata> {
  const { "guide-slug": guideSlug } = await params;
  const guide = await getGuideBySlug(guideSlug);

  if (!guide || guide.publication_state !== "indexed") {
    return { title: "Guide Not Found" };
  }

  const canonical = `https://geteasycar.com${guide.canonical_url}`;

  return {
    title: guide.meta_title || guide.guide_title || "Car Rental Guide",
    description:
      guide.meta_description ||
      guide.intro_paragraph ||
      "Country-level car rental guide.",
    alternates: { canonical },
    openGraph: {
      title: guide.meta_title || guide.guide_title || "Car Rental Guide",
      description:
        guide.meta_description ||
        guide.intro_paragraph ||
        "Country-level car rental guide.",
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

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function FaqItem({ question, answer }: GuideFaqItem) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <p className="font-semibold text-slate-900 text-base mb-2">{question}</p>
      <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
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

export default async function GuidePage({
  params,
}: {
  params: Promise<{ "guide-slug": string }>;
}) {
  const { "guide-slug": guideSlug } = await params;

  const guide = await getGuideBySlug(guideSlug);

  if (!guide || guide.publication_state !== "indexed") {
    notFound();
  }

  const country = await getCountryBySlug(guide.country_slug);

  if (!country || country.publication_state !== "indexed") {
    notFound();
  }

  const heroImage = getGuideHeroImage(
    guide.guide_slug,
    guide.guide_title,
    country.country_name
  );

  const faqItems: GuideFaqItem[] = Array.isArray(guide.faq) ? guide.faq : [];
  const hasFaq = faqItems.length > 0;

  const sections: GuideSection[] = Array.isArray(guide.sections)
    ? guide.sections
    : [];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: guide.meta_title || guide.guide_title,
    description:
      guide.meta_description ||
      guide.intro_paragraph ||
      `Car rental guide for ${country.country_name}`,
    url: `https://geteasycar.com${guide.canonical_url}`,
    dateModified: guide.last_updated,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: guide.breadcrumb_path.map(
        (item: { label: string; url: string }, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `https://geteasycar.com${item.url}`,
        })
      ),
    },
  };

  const faqSchema = hasFaq
    ? {
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

      <div className="min-h-screen bg-[#F8F7F4] text-slate-800">
        <nav
          aria-label="Breadcrumb"
          className="bg-white border-b border-stone-200"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              {guide.breadcrumb_path.map(
                (item: { label: string; url: string }, index: number) => (
                  <li key={item.url} className="flex items-center gap-1.5">
                    {index > 0 && (
                      <span aria-hidden="true" className="text-slate-300">
                        /
                      </span>
                    )}
                    {index === guide.breadcrumb_path.length - 1 ? (
                      <span
                        className="text-slate-700 font-medium"
                        aria-current="page"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.url}
                        className="hover:text-[#7A5C2E] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              )}
            </ol>
          </div>
        </nav>

        <section className="relative overflow-hidden">
          <img
            src={heroImage}
            alt={guide.guide_title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#161B22]/82 via-[#24303A]/72 to-[#7A5C2E]/38" />

          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute -top-20 right-0 w-[520px] h-[520px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-[420px] h-[420px] rounded-full bg-[#7A5C2E]/18 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-stone-200 text-sm font-semibold uppercase tracking-[0.24em] mb-4">
                Country Guide · {country.country_name}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
                {guide.h1 || guide.guide_title}
              </h1>

              <p className="text-stone-100/90 text-lg sm:text-xl leading-relaxed max-w-2xl">
                {guide.intro_paragraph ||
                  `Practical car rental guidance for ${country.country_name}.`}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/car-rental/${country.country_slug}/`}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-bold text-[#24303A] hover:bg-stone-100 transition-colors"
                >
                  Go to {country.country_name} Rental Hub
                </Link>

                <Link
                  href="/guide/"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/15 transition-colors"
                >
                  All Guides
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoCard label="Country" value={country.country_name} />
              <InfoCard
                label="Driving Side"
                value={
                  country.driving_side === "left"
                    ? "Drive on the left"
                    : "Drive on the right"
                }
              />
              <InfoCard
                label="Minimum Age"
                value={`${country.minimum_driver_age}+ years`}
              />
              <InfoCard label="Currency" value={country.currency_code} />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Guide"
              title={`Renting a Car in ${country.country_name}`}
              subtitle="Essential information before you pick up your vehicle."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <article
                      key={index}
                      className="rounded-3xl border border-stone-200 bg-white p-7"
                    >
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {section.section_title || `Section ${index + 1}`}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {section.content || ""}
                      </p>
                    </article>
                  ))
                ) : (
                  <>
                    {country.driving_notes && (
                      <article className="rounded-3xl border border-stone-200 bg-white p-7">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          Driving Rules
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {country.driving_notes}
                        </p>
                      </article>
                    )}

                    {country.toll_information && (
                      <article className="rounded-3xl border border-stone-200 bg-white p-7">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          Tolls and Charges
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {country.toll_information}
                        </p>
                      </article>
                    )}

                    {country.fuel_notes && (
                      <article className="rounded-3xl border border-stone-200 bg-white p-7">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          Fuel
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {country.fuel_notes}
                        </p>
                      </article>
                    )}

                    {country.parking_notes && (
                      <article className="rounded-3xl border border-stone-200 bg-white p-7">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          Parking
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {country.parking_notes}
                        </p>
                      </article>
                    )}
                  </>
                )}
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-white border border-stone-200 rounded-3xl p-6">
                    <h3 className="font-bold text-slate-900 text-base mb-4">
                      Quick Snapshot
                    </h3>
                    <div className="space-y-3">
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

                  <div className="bg-[#F3EEE5] border border-[#E5D8BF] rounded-3xl p-6">
                    <h3 className="font-bold text-slate-900 text-base mb-3">
                      Ready to Book?
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Compare car rental suppliers across {country.country_name}{" "}
                      and connect directly with trusted partners.
                    </p>
                    <a
                      href={affiliateUrl(country.affiliate_sid_base, "guide_sidebar")}
                      className="inline-flex items-center gap-2 bg-[#24303A] hover:bg-[#1B252D] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                    >
                      Compare Car Rentals
                    </a>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-3xl p-6">
                    <h3 className="font-bold text-slate-900 text-base mb-3">
                      Quick Links
                    </h3>
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/car-rental/${country.country_slug}/`}
                        className="text-sm text-slate-600 hover:text-[#7A5C2E] transition-colors"
                      >
                        Country Rental Hub
                      </Link>
                      <Link
                        href="/guide/"
                        className="text-sm text-slate-600 hover:text-[#7A5C2E] transition-colors"
                      >
                        All Guides
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {hasFaq && (
          <section className="py-16 sm:py-20 bg-white border-y border-stone-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                label="FAQs"
                title={`Renting a Car in ${country.country_name} — Common Questions`}
              />
              <div className="space-y-3">
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
        )}

        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Country Hub"
              title={`Jump to ${country.country_name} Rental Pages`}
              subtitle="Go directly to the country-level rental hub."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href={`/car-rental/${country.country_slug}/`}
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#7A5C2E] font-semibold uppercase tracking-wide mb-1">
                    Country Hub
                  </p>
                  <h3 className="font-semibold text-slate-900 group-hover:text-[#5E451D] transition-colors text-base leading-snug">
                    Car Rental in {country.country_name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Cities · Airports · Guides
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-[#7A5C2E] transition-colors shrink-0 mt-0.5">
                  <ChevronRight />
                </span>
              </Link>
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
              Find the Best Car Rental Deals in {country.country_name}
            </h2>
            <p className="text-stone-200 text-base mb-8 leading-relaxed">
              Compare car rental suppliers across {country.country_name} and
              book with trusted partners.
            </p>
            <a
              href={affiliateUrl(country.affiliate_sid_base, "guide_bottom")}
              className="inline-flex items-center gap-2 bg-white text-[#24303A] hover:bg-stone-100 active:bg-stone-200 font-extrabold px-8 py-4 rounded-xl transition-colors shadow-xl text-base"
            >
              Compare Car Rental Deals Now
            </a>
            <p className="mt-4 text-stone-300/70 text-xs">
              Free to use · No booking fees
            </p>
          </div>
        </section>
      </div>
    </>
  );
}