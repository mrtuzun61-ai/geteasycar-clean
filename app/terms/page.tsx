import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | GetEasyCar",
  description:
    "Terms and conditions governing the use of the GetEasyCar platform.",
  alternates: {
    canonical: "https://geteasycar.com/terms/",
  },
  openGraph: {
    title: "Terms of Service | GetEasyCar",
    description:
      "Terms and conditions governing the use of the GetEasyCar platform.",
    url: "https://geteasycar.com/terms/",
    siteName: "Get Easy Car",
    type: "website",
  },
};

const LAST_UPDATED = "March 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-200 uppercase tracking-widest text-sm mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-blue-100 text-lg">
            These terms govern the use of the GetEasyCar platform.
          </p>
          <p className="text-blue-200 text-sm mt-4">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          <article>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              1. Platform Purpose
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              GetEasyCar is an independent car rental discovery platform.
              The platform provides travel information, guides, and links
              to external car rental providers.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              2. No Rental Services Provided
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              GetEasyCar does not provide rental vehicles, process bookings,
              or collect payment for rentals. All rentals are completed
              directly with third-party providers.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              3. External Links
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              The platform may contain links to external websites operated
              by third-party providers. GetEasyCar is not responsible for
              the content, services, or policies of those external sites.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              4. Platform Availability
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We aim to keep the platform available and accurate,
              but we cannot guarantee uninterrupted access or
              error-free content.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              5. Contact
            </h2>
            <p className="text-slate-600 text-sm">
              If you have questions about these terms please contact:
            </p>

            <a
              href="mailto:info@geteasycar.com"
              className="text-blue-600 font-semibold mt-2 inline-block"
            >
              info@geteasycar.com
            </a>
          </article>

          <div className="pt-8 border-t border-slate-200">
            <Link
              href="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              ← Back to Homepage
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}