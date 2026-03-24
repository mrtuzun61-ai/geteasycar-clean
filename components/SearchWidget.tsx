"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
    initGetEasyCarPlaces?: () => void;
  }
}

type SearchWidgetProps = {
  affiliateUrl: string;
};

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[data-google-maps="geteasycar"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Google Maps script failed to load."))
      );
      return;
    }

    window.initGetEasyCarPlaces = () => resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initGetEasyCarPlaces`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "geteasycar";
    script.onerror = () =>
      reject(new Error("Google Maps script failed to load."));
    document.head.appendChild(script);
  });
}

export default function SearchWidget({
  affiliateUrl,
}: SearchWidgetProps) {
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef =
    useRef<any>(null);

  const [locationText, setLocationText] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    formattedAddress: string;
    placeId: string;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setErrorText("Google Maps API key is missing.");
      return;
    }

    let isMounted = true;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!isMounted || !locationInputRef.current || !window.google) return;

        const autocomplete = new window.google.maps.places.Autocomplete(
          locationInputRef.current,
          {
            fields: ["place_id", "name", "formatted_address"],
          }
        );

        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();

          const nextValue =
            place.formatted_address || place.name || "";

          setLocationText(nextValue);

          if (place.place_id && (place.name || place.formatted_address)) {
            setSelectedPlace({
              name: place.name || "",
              formattedAddress: place.formatted_address || "",
              placeId: place.place_id,
            });
            setErrorText("");
          } else {
            setSelectedPlace(null);
          }
        });

        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setErrorText("Google location search could not be loaded.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleLocationChange(value: string) {
    setLocationText(value);
    setSelectedPlace(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!locationText.trim()) {
      setErrorText("Please choose a location.");
      return;
    }

    if (!pickupDate) {
      setErrorText("Please select a pick-up date.");
      return;
    }

    if (!returnDate) {
      setErrorText("Please select a return date.");
      return;
    }

    if (returnDate < pickupDate) {
      setErrorText("Return date cannot be earlier than pick-up date.");
      return;
    }

    const url = new URL(affiliateUrl);

    url.searchParams.set("location", locationText.trim());
    url.searchParams.set("pickup_date", pickupDate);
    url.searchParams.set("return_date", returnDate);

    if (selectedPlace?.placeId) {
      url.searchParams.set("place_id", selectedPlace.placeId);
    }

    window.location.href = url.toString();
  }

  return (
    <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 pl-1">
              Pick-up Location
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <input
                ref={locationInputRef}
                type="text"
                placeholder={isReady ? "City or airport..." : "Loading location search..."}
                value={locationText}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 pl-1">
              Pick-up Date
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 pl-1">
              Return Date
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <input
                type="date"
                value={returnDate}
                min={pickupDate || undefined}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>

        {errorText && (
          <p className="text-sm text-red-600 mb-3">{errorText}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/25"
        >
          Search Best Car Deals Now
        </button>
      </form>
    </div>
  );
}