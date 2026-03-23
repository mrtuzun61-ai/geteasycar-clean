import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About GetEasyCar — Car Rental Discovery Platform",
  description:
    "GetEasyCar helps travelers compare car rental options across cities, airports, and countries with clear guidance and practical travel resources.",
  alternates: {
    canonical: "https://geteasycar.com/about/",
  },
  openGraph: {
    title: "About GetEasyCar — Car Rental Discovery Platform",
    description:
      "GetEasyCar helps travelers compare car rental options across cities, airports, and countries.",
    url: "https://geteasycar.com/about/",
    siteName: "Get Easy Car",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── BREADCRUMB ── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-slate-50 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-slate-300">/</span>
            </li>
            <li>
              <span className="text-slate-700 font-medium" aria-current="page">
                About
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500">
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-blue-900/25 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Who We Are
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
              About GetEasyCar
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
              GetEasyCar helps travelers compare car rental options across
              cities, airports, and countries — with clear guidance and
              practical travel resources to support smarter rental decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
                Helping travelers make smarter car rental decisions
              </h2>
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Clear guidance before booking",
                    body: "We provide country guides, airport pickup tips, and practical rental advice so you arrive informed and prepared — not surprised.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    ),
                    title: "Transparent rental discovery",
                    body: "We connect you to trusted rental partners without hidden platform fees or confusing search layers — just a clear path to booking.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                    ),
                    title: "Global destination coverage",
                    body: "From major international airports to city center pickup locations, GetEasyCar covers destinations across Europe, the Americas, and beyond.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-base mb-1">
                        {item.title}
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual block */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "100+", label: "Cities covered" },
                    { value: "20+", label: "Airports listed" },
                    { value: "5+", label: "Country guides" },
                    { value: "Free", label: "To use, always" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white border border-slate-200 rounded-2xl p-5 text-center"
                    >
                      <p className="text-3xl font-extrabold text-blue-600 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE PROVIDE ── */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
              What We Provide
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Everything you need before you rent
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
              GetEasyCar is built around three core pillars to support your
              rental journey from research to pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Car Rental Discovery",
                body: "Browse rental options across hundreds of cities and airports. We connect you directly to trusted suppliers with a straightforward booking path and no platform fees.",
                link: { label: "Browse destinations →", href: "/" },
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Travel Guides",
                body: "Country-specific guides covering driving rules, toll roads, fuel, parking, license requirements, and age restrictions — everything you need to drive confidently abroad.",
                link: { label: "Read guides →", href: "/guide/" },
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                ),
                title: "Airport Pickup Tips",
                body: "Detailed airport pickup information including terminal locations, shuttle instructions, counter positions, and distance from city center for all major rental airports.",
                link: { label: "View airports →", href: "/" },
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-5 p-7 bg-white border border-slate-200 rounded-2xl shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {card.body}
                  </p>
                </div>
                <Link
                  href={card.link.href}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {card.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRAVELERS USE US ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
                Why GetEasyCar
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Why travelers use GetEasyCar
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                We built GetEasyCar to solve a simple problem: finding rental
                car options and understanding local rental rules in one place,
                without noise or complexity.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    title: "Easy comparison",
                    body: "Compare rental options from trusted suppliers across hundreds of locations worldwide without creating an account or navigating complex filter systems.",
                  },
                  {
                    title: "Helpful guides",
                    body: "Read practical, accurate guides for each country before you travel — covering everything from ZTL zones to International Driving Permit requirements.",
                  },
                  {
                    title: "Global destinations",
                    body: "Coverage spans Europe, North America, and Australia — with major cities, regional airports, and popular tourist destinations all included.",
                  },
                  {
                    title: "Simple booking path",
                    body: "Every page leads to a single, clear action. No popups, no forced registration, no hidden fees. A clean path from discovery to your rental supplier.",
                  },
                ].map((item, index) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-extrabold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-base mb-1">
                        {item.title}
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust block */}
            <div className="flex flex-col gap-4">
              <div className="bg-blue-600 rounded-2xl p-7 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  We are a discovery platform
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  GetEasyCar is not a rental company. We do not own vehicles or
                  operate rental counters. We connect travelers to trusted
                  rental suppliers and provide the guidance to make an informed
                  choice before booking.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Get in touch
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Questions about the platform or our content? We are happy to
                  help.
                </p>
                <a
                  href="mailto:info@geteasycar.com"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5"
                >
                  info@geteasycar.com
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
            Start exploring rental options
          </h2>
          <p className="text-blue-100 text-base mb-8 leading-relaxed">
            Browse car rental destinations, read country guides, or compare
            options at major airports — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/guide/"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-xl shadow-blue-900/20 w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Travel Guides
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-colors border border-white/20 w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
