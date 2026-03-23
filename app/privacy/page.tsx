import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | GetEasyCar",
  description:
    "This page explains how GetEasyCar handles information, cookies, and analytics on this platform.",
  alternates: {
    canonical: "https://geteasycar.com/privacy/",
  },
  openGraph: {
    title: "Privacy Policy | GetEasyCar",
    description:
      "This page explains how GetEasyCar handles information, cookies, and analytics on this platform.",
    url: "https://geteasycar.com/privacy/",
    siteName: "Get Easy Car",
    type: "website",
  },
};

const LAST_UPDATED = "March 2026";

export default function PrivacyPage() {
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
              <span
                className="text-slate-700 font-medium"
                aria-current="page"
              >
                Privacy Policy
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
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Privacy Policy
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-4">
              This page explains how GetEasyCar handles information, cookies,
              and analytics on this platform.
            </p>
            <p className="text-blue-200/70 text-sm">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

            {/* Sidebar navigation */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  On this page
                </p>
                <nav aria-label="Privacy policy sections">
                  <ul className="space-y-2">
                    {[
                      { label: "Information We Collect", href: "#information" },
                      { label: "Cookies", href: "#cookies" },
                      { label: "Third-Party Links", href: "#third-party" },
                      { label: "Data Security", href: "#security" },
                      { label: "Contact", href: "#contact" },
                    ].map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-start gap-2 leading-snug"
                        >
                          <span className="text-slate-300 shrink-0 mt-0.5">
                            ›
                          </span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3 flex flex-col gap-10">

              {/* Introduction */}
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"
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
                  <p className="text-slate-700 text-sm leading-relaxed">
                    GetEasyCar is a rental car discovery platform. We do not
                    require users to register, log in, or submit personal
                    information to use this platform. This policy explains
                    what limited data may be collected as part of normal
                    platform operation.
                  </p>
                </div>
              </div>

              {/* Section 1 — Information We Collect */}
              <article
                id="information"
                className="scroll-mt-24 border-b border-slate-100 pb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-extrabold">1</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Information We Collect
                  </h2>
                </div>
                <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    GetEasyCar does not require users to provide any personal
                    information to access or use the platform. No registration,
                    email address, or account is required to browse destinations,
                    read travel guides, or follow affiliate links to rental
                    suppliers.
                  </p>
                  <p>
                    As part of normal website operation, some basic and anonymous
                    usage data may be collected automatically. This may include:
                  </p>
                  <ul className="flex flex-col gap-3 mt-1">
                    {[
                      {
                        title: "Basic analytics data",
                        body: "Aggregate information about page views, traffic sources, and general visitor behaviour — used to understand how the platform is being used and to improve content.",
                      },
                      {
                        title: "Anonymous usage data",
                        body: "Technical information such as browser type, device category, and general geographic region. This data is not linked to any individual identity.",
                      },
                      {
                        title: "No personal data required",
                        body: "You do not need to provide your name, email address, payment details, or any other personal information to use GetEasyCar.",
                      },
                    ].map((item) => (
                      <li
                        key={item.title}
                        className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 mb-0.5">
                            {item.title}
                          </p>
                          <p className="text-slate-500">{item.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* Section 2 — Cookies */}
              <article
                id="cookies"
                className="scroll-mt-24 border-b border-slate-100 pb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-extrabold">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Cookies
                  </h2>
                </div>
                <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    GetEasyCar may use cookies and similar tracking technologies
                    as part of normal website operation. Cookies are small text
                    files stored on your device by your browser.
                  </p>
                  <p>
                    Cookies on this platform may be used for the following
                    purposes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                    {[
                      {
                        icon: (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        ),
                        title: "Analytics",
                        body: "Understanding how visitors use the platform to improve content and navigation.",
                      },
                      {
                        icon: (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ),
                        title: "Performance",
                        body: "Improving platform speed, reliability, and overall user experience.",
                      },
                      {
                        icon: (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ),
                        title: "Visitor Insights",
                        body: "Understanding which pages and content are most useful to visitors.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm mb-1">
                            {item.title}
                          </p>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1">
                    Most browsers allow you to control or disable cookies
                    through browser settings. Disabling cookies may affect the
                    functionality of some platform features.
                  </p>
                </div>
              </article>

              {/* Section 3 — Third-Party Links */}
              <article
                id="third-party"
                className="scroll-mt-24 border-b border-slate-100 pb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-extrabold">3</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Third-Party Links
                  </h2>
                </div>
                <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    GetEasyCar is a rental car discovery platform. The platform
                    contains links to external car rental suppliers and booking
                    partners. When you click on these links, you will be
                    directed to an external website operated by a third party.
                  </p>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <p className="text-slate-600">
                      Bookings are completed directly with rental suppliers on
                      their own platforms. GetEasyCar is not a party to any
                      rental contract and does not process payments. The privacy
                      policies and terms of those external providers will apply
                      once you leave our platform.
                    </p>
                  </div>
                  <p>
                    We are not responsible for the privacy practices or content
                    of any external websites linked from GetEasyCar. We
                    recommend reviewing the privacy policy of any third-party
                    website before submitting personal information to them.
                  </p>
                </div>
              </article>

              {/* Section 4 — Data Security */}
              <article
                id="security"
                className="scroll-mt-24 border-b border-slate-100 pb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-extrabold">4</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Data Security
                  </h2>
                </div>
                <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    We take reasonable technical and organisational measures to
                    protect the platform and any data associated with its
                    operation against unauthorised access, loss, or misuse.
                  </p>
                  <p>
                    As GetEasyCar does not collect or store personal user data
                    as part of the standard browsing experience, the risk of
                    personal data exposure through use of this platform is
                    limited. No login credentials, payment information, or
                    sensitive personal data is stored on this platform.
                  </p>
                  <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      If you have security concerns related to this platform,
                      please contact us at{" "}
                      <a
                        href="mailto:info@geteasycar.com"
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        info@geteasycar.com
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </article>

              {/* Section 5 — Contact */}
              <article id="contact" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-extrabold">5</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Contact
                  </h2>
                </div>
                <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    If you have questions about this privacy policy or how
                    GetEasyCar handles data, please contact us:
                  </p>
                  <div className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl w-full max-w-sm">
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
                  <p className="text-slate-400 text-xs mt-2">
                    This privacy policy was last updated in {LAST_UPDATED}. We
                    reserve the right to update this policy at any time. Changes
                    will be reflected on this page.
                  </p>
                </div>
              </article>
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
            Explore GetEasyCar
          </h2>
          <p className="text-blue-100 text-base mb-8 leading-relaxed">
            Browse car rental destinations and read our country guides before
            your next trip.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Homepage
            </Link>
            <Link
              href="/guide/"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Browse Travel Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}