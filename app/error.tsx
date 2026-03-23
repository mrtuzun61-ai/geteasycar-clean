"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── MINIMAL NAV ── */}
      <header className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                <circle cx="7.5" cy="14.5" r="1.5" />
                <circle cx="16.5" cy="14.5" r="1.5" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              GetEasyCar
            </span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center">

          {/* Error icon badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 mb-8 mx-auto">
            <svg
              className="w-9 h-9 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error badge */}
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-3">
            Something went wrong
          </p>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Unexpected Error
          </h1>

          {/* Supporting text */}
          <p className="text-slate-500 text-lg leading-relaxed mb-4 max-w-md mx-auto">
            An unexpected error occurred while loading this page. You can try
            refreshing the page or return to the homepage.
          </p>

          {/* Error digest for debugging — shown only when available */}
          {error.digest && (
            <p className="text-xs text-slate-400 font-mono mb-8 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 inline-block">
              Error ID: {error.digest}
            </p>
          )}

          {!error.digest && <div className="mb-8" />}

          {/* Primary and secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 w-full sm:w-auto justify-center"
              type="button"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reload Page
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-base px-7 py-3.5 rounded-xl transition-colors border border-slate-200 hover:border-blue-200 w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 text-blue-500"
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

          {/* Helpful links */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Explore Instead
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  label: "Browse Travel Guides",
                  href: "/guide/",
                  icon: (
                    <svg
                      className="w-4 h-4 text-blue-500"
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
                  ),
                },
                {
                  label: "Car Rental in France",
                  href: "/car-rental/france/",
                  icon: <span className="text-base leading-none">🇫🇷</span>,
                },
                {
                  label: "Car Rental in Spain",
                  href: "/car-rental/spain/",
                  icon: <span className="text-base leading-none">🇪🇸</span>,
                },
                {
                  label: "Car Rental in Italy",
                  href: "/car-rental/italy/",
                  icon: <span className="text-base leading-none">🇮🇹</span>,
                },
                {
                  label: "Car Rental in the United States",
                  href: "/car-rental/united-states/",
                  icon: <span className="text-base leading-none">🇺🇸</span>,
                },
                {
                  label: "Car Rental in Australia",
                  href: "/car-rental/australia/",
                  icon: <span className="text-base leading-none">🇦🇺</span>,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:border hover:border-blue-100 hover:shadow-sm transition-all duration-150 border border-transparent"
                >
                  <span className="flex items-center justify-center w-5 h-5 shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700 transition-colors">
                    {item.label}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors ml-auto shrink-0"
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
        </div>
      </main>

      {/* ── MINIMAL FOOTER ── */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} GetEasyCar. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              Home
            </Link>
            <Link
              href="/guide/"
              className="hover:text-slate-600 transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/privacy/"
              className="hover:text-slate-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact/"
              className="hover:text-slate-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
