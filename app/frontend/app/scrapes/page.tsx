import React, { Suspense } from "react";
import { CompletedFetchProps, FetchTypeProps } from "@/typings";
import Link from "next/link";
import PaginationControls from "../components/PaginationControls";
import { notFound } from "next/navigation";

// Function to retrieve all completed Price Scrapes from Django API
async function getCompletedFetches() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_all_completed_fetches/`,
    // Wait 20 seconds before fetching again
    { next: { revalidate: 20 } }
  );
  const data: CompletedFetchProps[] = await res.json();

  return data;
}

export default async function Fetches({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const completedFetchData = await getCompletedFetches();

  const scrapesPerPage: number = 18;

  const numScrapes: number = completedFetchData?.length;

  const maxPages: number = Math.ceil(numScrapes / scrapesPerPage);

  if (
    Object.keys(searchParams).length !== 0 &&
    isNaN(Number(searchParams["page"]))
  )
    return notFound();

  if (
    Number(searchParams["page"]) < 1 ||
    Number(searchParams["page"]) > maxPages
  )
    return notFound();

  const page = searchParams["page"] ?? "1";

  const start = (Number(page) - 1) * scrapesPerPage;
  const end = start + scrapesPerPage;

  const paginatedScrapes = completedFetchData?.reverse().slice(start, end);

  // HashMap to assign different text, text colors and border colors to the different Benchmark Types
  const scrapeTypeMap: FetchTypeProps = {
    GPU: {
      title: "GPU",
      cssNameText: "color-text-gpu",
      cssNameBorder: "color-border-gpu",
    },
    CPUGaming: {
      title: "CPU (Gaming Performance)",
      cssNameText: "color-text-cpu-g",
      cssNameBorder: "color-border-cpu-g",
    },
    CPUNormal: {
      title: "CPU (Multi-threaded Performance)",
      cssNameText: "color-text-cpu-n",
      cssNameBorder: "color-border-cpu-n",
    },
  };

  return (
    <>
      <div className="scrape-content">
        {/* Show loading icon if data is loading */}
        <Suspense
          fallback={
            <div className="centered-container">
              <article aria-busy="true"></article>
            </div>
          }
        >
          <div className="full-scrape-list">
            {/* Show every completed Price Scrape with the most recent ones on top */}
            {paginatedScrapes.map((scrape: CompletedFetchProps) => {
              // Remove the "-" from scrapeType value to make it compatible with scrapeTypeMap
              const scrapeType: string = scrape.benchmark_type.replace("-", "");

              // Get the number of products in Price Scrape
              const numProducts: number = scrape.product_list.split(",").length;

              const timestamp: string = scrape.timestamp_id;
              // Format the date and timestamp of Price Scrape
              const formattedDate: string = `${timestamp.substring(
                0,
                4
              )}-${timestamp.substring(4, 6)}-${timestamp.substring(6, 8)}`;
              const formattedTime: string = `${timestamp.substring(
                8,
                10
              )}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
              return (
                // Display every item in the color of their respective Benchmark Type
                <Link
                  className="full-scrape-link"
                  href={`/scrapes/${scrape.timestamp_id}`}
                  key={scrape.timestamp_id}
                >
                  <div className="full-scrape-list-item">
                    <p className="full-scrape-list-item-text">
                      <strong className={scrapeTypeMap[scrapeType].cssNameText}>
                        {scrapeTypeMap[scrapeType].title}{" "}
                      </strong>
                      <strong className="full-scrape-list-title-product">
                        -{" "}
                        <span className="full-scrape-list-title-product-span">
                          {numProducts} Product{numProducts > 1 && "s"}
                        </span>
                      </strong>
                      <br />
                      {scrape.product_list}
                      <br />
                      <small className="full-scrape-list-item-timestamp">
                        {`${formattedDate} ${formattedTime}`}
                      </small>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <PaginationControls
            hasNextPage={end < numScrapes}
            hasPrevPage={start > 0}
            maxPages={maxPages}
            totalCount={numScrapes}
            pageSize={scrapesPerPage}
          />
        </Suspense>
      </div>
    </>
  );
}
