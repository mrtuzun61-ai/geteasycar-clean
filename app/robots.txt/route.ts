export async function GET() {
  const robots = `
User-agent: *
Allow: /

Sitemap: https://geteasycar.com/sitemap.xml
`;

  return new Response(robots.trim(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}