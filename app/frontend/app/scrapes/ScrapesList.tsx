import React, { Suspense } from "react";
import Link from "next/link";
import { CompletedFetchProps, FetchTypeProps } from "@/typings";


// Function to retrieve all completed Price Scrapes from Django API
async function getCompletedFetches() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_all_completed_fetches/`,
    { next: { revalidate: 0 } }
  );
  const data: CompletedFetchProps[] = await res.json();

  return data;
}

export default async function ScrapesList() {
  const completedFetchData = await getCompletedFetches();

  // HashMap to assign different text and text colors to the different Benchmark Types
  const scrapeTypeMap: FetchTypeProps = {
    GPU: {
      title: "GPU",
      cssNameText: "color-text-gpu",
    },
    CPUGaming: {
      title: "CPU (Gaming)",
      cssNameText: "color-text-cpu-g",
    },
    CPUNormal: {
      title: "CPU (Multi-th.)",
      cssNameText: "color-text-cpu-n",
    },
  };

  return (
    <div className="sidebar-fetch-items">
      {/* Show loading icon if data is loading */}
      <Suspense fallback={<article aria-busy="true"></article>}>
        <ul className="no-dot-list">
          {/* Show every completed Price Scrape with the most recent ones on top */}
          {completedFetchData
            ?.slice(0)
            .reverse()
            .map((scrape: CompletedFetchProps) => {
              // Remove the "-" from scrapeType value to make it compatible with scrapeTypeMap
              const scrapeType: string = scrape.benchmark_type.replace("-", "");

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
                <li className="no-dot-list-item" key={scrape.timestamp_id}>
                  <Link href={`/scrapes/${scrape.timestamp_id}`}>
                    {/* Display every item in the color of their respective Benchmark Type */}
                    <strong className={scrapeTypeMap[scrapeType].cssNameText}>
                      {scrapeTypeMap[scrapeType].title}
                    </strong>
                    <br />
                    <small>
                      {formattedDate}
                      <br />
                      {formattedTime}
                    </small>
                  </Link>
                </li>
              );
            })}
        </ul>
      </Suspense>
    </div>
  );
}
