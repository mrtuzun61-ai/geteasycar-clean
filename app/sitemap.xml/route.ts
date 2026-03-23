import { getAirportsIndex, getCitiesIndex, getCountriesIndex, getGuidesIndex, getStatesIndex } from "@/lib/data";

const BASE_URL = "https://geteasycar.com";

function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}${path}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

export async function GET() {
  const [countries, states, cities, airports, guides] = await Promise.all([
    getCountriesIndex(),
    getStatesIndex(),
    getCitiesIndex(),
    getAirportsIndex(),
    getGuidesIndex(),
  ]);

  const urls: SitemapUrl[] = [
    {
      loc: absoluteUrl("/"),
      changefreq: "daily",
      priority: "1.0",
    },
    {
      loc: absoluteUrl("/about/"),
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      loc: absoluteUrl("/contact/"),
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      loc: absoluteUrl("/privacy/"),
      changefreq: "yearly",
      priority: "0.3",
    },
    {
      loc: absoluteUrl("/terms/"),
      changefreq: "yearly",
      priority: "0.3",
    },
    {
      loc: absoluteUrl("/guide/"),
      changefreq: "weekly",
      priority: "0.8",
    },
  ];

  for (const country of countries) {
    urls.push({
      loc: absoluteUrl(`/car-rental/${country.country_slug}/`),
      changefreq: "weekly",
      priority: "0.9",
    });
  }

  for (const state of states) {
    urls.push({
      loc: absoluteUrl(`/car-rental/${state.country_slug}/${state.state_slug}/`),
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  for (const city of cities) {
    const loc =
      city.has_state_layer && city.state_slug
        ? `/car-rental/${city.country_slug}/${city.state_slug}/${city.city_slug}/`
        : `/car-rental/${city.country_slug}/${city.city_slug}/`;

    urls.push({
      loc: absoluteUrl(loc),
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  for (const airport of airports) {
    urls.push({
      loc: absoluteUrl(`/car-rental/airports/${airport.airport_slug}/`),
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  for (const guide of guides) {
    urls.push({
      loc: absoluteUrl(`/guide/${guide.guide_slug}/`),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    return `  <url>
    <loc>${escapeXml(url.loc)}</loc>${
      url.lastmod ? `
    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""
    }${
      url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ""
    }${
      url.priority ? `
    <priority>${url.priority}</priority>` : ""
    }
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}