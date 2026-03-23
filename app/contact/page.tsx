import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact GetEasyCar — Get in Touch",
  description:
    "Contact the GetEasyCar team for questions about our platform, travel guides, rental destinations, or airport pickup information.",
  alternates: {
    canonical: "https://geteasycar.com/contact/",
  },
  openGraph: {
    title: "Contact GetEasyCar — Get in Touch",
    description:
      "Contact the GetEasyCar team for questions about our platform, travel guides, or rental resources.",
    url: "https://geteasycar.com/contact/",
    siteName: "Get Easy Car",
    type: "website",
  },
};

export default function ContactPage() {
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
              <Link
                href="/"
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="text-slate-300">/</span>
            </li>
            <li>
              <span
                className="text-slate-700 font-medium"
                aria-current="page"
              >
                Contact
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-xl">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Get In Touch
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Contact GetEasyCar
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              If you have questions about our platform, guides, or rental
              resources, feel free to reach out. We aim to respond to all
              enquiries promptly.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT OPTIONS ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
              Contact Options
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How to reach us
            </h2>
            <p className="mt-2 text-slate-500 text-base">
              Choose the most relevant contact method for your enquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">

            {/* Email card */}
            <div className="flex flex-col gap-5 p-7 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Email Support
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  For general questions or platform enquiries, send us an
                  email and we will get back to you as soon as possible.
                </p>
                <a
                  href="mailto:info@geteasycar.com"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@geteasycar.com
                </a>
              </div>
            </div>

            {/* Platform questions card */}
            <div className="flex flex-col gap-5 p-7 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Platform Questions
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Questions about our guides, rental destinations, or airport
                  pickup information? Browse our resources — most answers are
                  already covered.
                </p>
                <Link
                  href="/guide/"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  Browse Guides
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO ── */}
      <section className="py-10 sm:py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-5">
              Contact Information
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">
                    Email
                  </p>
                  <a
                    href="mailto:info@geteasycar.com"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    info@geteasycar.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">
                    Platform
                  </p>
                  <a
                    href="https://geteasycar.com"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    geteasycar.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HELPFUL LINKS ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
              Explore the Platform
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Browse our resources
            </h2>
            <p className="mt-2 text-slate-500 text-base">
              Most questions can be answered by browsing our guides and
              destination pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                label: "Travel Guides",
                sublabel: "Country rental guides",
                href: "/guide/",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                label: "Homepage",
                sublabel: "All destinations",
                href: "/",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: "About",
                sublabel: "About the platform",
                href: "/about/",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.sublabel}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"
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
              </Link>
            ))}
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
            Explore car rental destinations
          </h2>
          <p className="text-blue-100 text-base mb-8 leading-relaxed">
            Browse rental options across cities and airports, or read our
            country guides before you travel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/guide/"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-xl shadow-blue-900/20 w-full sm:w-auto justify-center"
            >
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Browse Travel Guides
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-colors border border-white/20 w-full sm:w-auto justify-center"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
