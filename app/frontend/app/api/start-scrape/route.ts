export async function POST(request: Request) {
    const data = await request.json();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/start_price_fetch/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

    return response;
}

export async function GET() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_scrape_allowed/`,
    {
      // Don't cache response
      cache: "no-store",
    }
  );

  return response;
}