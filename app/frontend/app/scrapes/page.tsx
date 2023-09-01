import React, { Suspense } from "react";
import { CompletedFetchProps, FetchTypeProps } from "@/typings";
import Link from "next/link";
import PaginationControls from "../components/PaginationControls";

// Function to retrieve all completed Price Scrapes from Django API
async function getCompletedFetches() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_all_completed_fetches/`,
    { next: { revalidate: 0 } }
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

  const page = searchParams["page"] ?? "1";

  const scrapes_per_page: number = 18;

  const start = (Number(page) - 1) * scrapes_per_page;
  const end = start + scrapes_per_page;

  const paginatedScrapes = completedFetchData?.reverse().slice(start, end);

  const numScrapes: number = completedFetchData?.length;

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
        <Suspense fallback={<article aria-busy="true"></article>}>
          <ul className="full-scrape-list no-dot-list">
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
                <li
                  className={`full-scrape-list-item ${scrapeTypeMap[scrapeType].cssNameBorder} no-dot-list-item`}
                  key={scrape.timestamp_id}
                >
                  <Link
                    className="full-scrape-link"
                    href={`/scrapes/${scrape.timestamp_id}`}
                  >
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
                  </Link>
                </li>
              );
            })}
          </ul>
          <PaginationControls
            hasNextPage={end < numScrapes}
            hasPrevPage={start > 0}
            numScrapes={numScrapes}
          />
        </Suspense>
      </div>
    </>
  );
}
