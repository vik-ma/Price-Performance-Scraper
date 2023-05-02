import React, { Suspense } from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { CompletedFetchProps, ScrapeType, FetchTypeProps } from "@/typings";
import Link from "next/link";

async function getCompletedFetches() {
  const { data } = await client.query({
    query: gql`
      {
        allCompletedFetches {
          productList
          benchmarkType
          timestamp
          timestampId
        }
      }
    `,
  });

  return data.allCompletedFetches as CompletedFetchProps[];
}

export default async function Fetches() {
  const gqlData = await getCompletedFetches();

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
        <Suspense fallback={<article aria-busy="true"></article>}>
          <ul className="full-scrape-list no-dot-list">
            {gqlData
              ?.slice(0)
              .reverse()
              .map((scrape: CompletedFetchProps) => {
                const scrapeType: string = scrape.benchmarkType.replace(
                  "-",
                  ""
                );
                const numProducts: number =
                  scrape.productList.split(",").length;
                const timestamp: string = scrape.timestampId;
                const formattedDate: string = `${timestamp.substring(
                  0,
                  4
                )}-${timestamp.substring(4, 6)}-${timestamp.substring(6, 8)}`;
                const formattedTime: string = `${timestamp.substring(
                  8,
                  10
                )}:${timestamp.substring(10, 12)}:${timestamp.substring(
                  12,
                  14
                )}`;
                return (
                  <li
                    className={`full-scrape-list-item ${scrapeTypeMap[scrapeType].cssNameBorder} no-dot-list-item`}
                    key={scrape.timestampId}
                  >
                    <Link
                      className="full-scrape-link"
                      href={`/scrapes/${scrape.timestampId}`}
                    >
                      <p className="full-scrape-list-item-text">
                        <strong
                          className={scrapeTypeMap[scrapeType].cssNameText}
                        >
                          {scrapeTypeMap[scrapeType].title}{" "}
                        </strong>
                        <strong className="full-scrape-list-title-product">
                          - {numProducts} Product{numProducts > 1 && "s"}
                        </strong>
                        <br />
                        {scrape.productList}
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
        </Suspense>
      </div>
    </>
  );
}
