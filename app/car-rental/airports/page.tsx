import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Airport Car Rental Locations Worldwide | GetEasyCar",
  description:
    "Compare car rental options at major international airports. Learn how airport pickup works, avoid mistakes, and find the best rental deals worldwide.",
  alternates: {
    canonical: "https://geteasycar.com/car-rental/airports/",
  },
};

interface AirportIndex {
  iata_code: string;
  airport_slug: string;
  airport_name: string;
  city_slug: string;
  country_slug: string;
  publication_state: string;
}

function readAirports(): AirportIndex[] {
  try {
    const filePath = path.join(process.cwd(), "data", "index", "airports.json");
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

const AFFILIATE =
  "https://www.dpbolvw.net/click-101574986-15736982?sid=airport_index";

export default function AirportsIndexPage() {
  const airports = readAirports().filter(
    (a) => a.publication_state === "indexed"
  );

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#0F2742] via-[#163B66] to-[#2C5F95] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            Airport Car Rental Locations
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Find and compare car rental options at major international airports.
            Choose the right pickup location, avoid hidden costs, and start your trip smoothly.
          </p>

          <a
            href={AFFILIATE}
            className="mt-8 inline-block bg-white text-blue-700 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Compare Airport Rental Deals
          </a>
        </div>
      </section>

      {/* SEO INTRO */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 space-y-5 text-slate-600 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">
            Renting a Car at the Airport — What You Need to Know
          </h2>

          <p>
            Renting a car directly at the airport is one of the most convenient ways to start your trip.
            Airport rental locations allow you to pick up your vehicle immediately after landing, avoiding
            public transport delays or expensive taxi rides.
          </p>

          <p>
            However, airport rentals can sometimes be more expensive than city locations. The difference
            usually comes from airport surcharges, higher demand, and premium location convenience.
            Understanding how airport rental systems work can help you save money and avoid common mistakes.
          </p>

          <p>
            In most major airports, rental companies operate either inside the terminal or via shuttle
            services. Knowing this in advance can help you plan your arrival more efficiently and reduce waiting time.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Popular Airport Pickup Locations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {airports.map((airport) => (
              <Link
                key={airport.airport_slug}
                href={`/car-rental/airports/${airport.airport_slug}/`}
                className="group flex flex-col gap-3 p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {airport.iata_code}
                  </span>
                  <span className="text-slate-300 group-hover:text-blue-500">
                    →
                  </span>
                </div>

                <p className="font-semibold text-slate-900">
                  {airport.airport_name}
                </p>

                <p className="text-xs text-slate-400">
                  {airport.city_slug.replace("-", " ")},{" "}
                  {airport.country_slug.replace("-", " ")}
                </p>

                <p className="text-xs text-blue-600 font-medium">
                  View rental options
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION BLOCK */}
      <section className="py-14 bg-slate-50 border-y">
        <div className="max-w-4xl mx-auto px-4 space-y-6 text-sm text-slate-600">
          <h2 className="text-2xl font-bold text-slate-900">
            Airport vs City Car Rental — Key Differences
          </h2>

          <p>
            Airport rentals are designed for convenience, while city rentals are often cheaper.
            If you arrive late at night or have luggage, airport pickup is usually the best option.
          </p>

          <p>
            City rentals can be a better choice if you are staying for several days and want to
            reduce costs. However, you may need transportation to reach the rental office.
          </p>

          <p>
            Always compare both options before booking. In many cases, airport deals can be competitive
            when booked in advance through comparison platforms.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Compare Car Rental Deals at Airports Worldwide
          </h2>
          <p className="text-slate-600 mb-6">
            Find the best prices, compare suppliers, and choose the right vehicle for your trip.
          </p>

          <a
            href={AFFILIATE}
            className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition"
          >
            Compare Deals Now
          </a>
        </div>
      </section>
    </div>
  );
}