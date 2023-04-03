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
      <div className="fetch-content">
        <Suspense fallback={<article aria-busy="true"></article>}>
          <ul>
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
                return (
                  <li
                    className={`full-fetch-list-item ${scrapeTypeMap[scrapeType].cssNameBorder}`}
                    key={scrape.timestampId}
                  >
                    <Link
                      className="full-fetch-link"
                      href={`/scrapes/${scrape.timestampId}`}
                    >
                      <p className="full-fetch-list-item-text">
                        <strong
                          className={scrapeTypeMap[scrapeType].cssNameText}
                        >
                          {scrapeTypeMap[scrapeType].title}{" "}
                        </strong>
                        <strong className="full-fetch-list-title-product">
                          - {numProducts} Product{numProducts > 1 && "s"}
                        </strong>
                        <br />
                        {scrape.productList}
                        <br />
                        <small className="full-fetch-list-item-timestamp">
                          {scrape.timestamp.substring(0, 19).replace("T", " ")}
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
