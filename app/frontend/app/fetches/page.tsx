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

  const fetchTypeMap: FetchTypeProps = {
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
        <h1>Completed Fetches</h1>
        <Suspense fallback={<article aria-busy="true"></article>}>
          <ul>
            {gqlData
              ?.slice(0)
              .reverse()
              .map((fetch: CompletedFetchProps) => {
                const fetchType: string = fetch.benchmarkType.replace("-", "");
                const numProducts: number = fetch.productList.split(",").length;
                return (
                  <li
                    className={`full-fetch-list-item ${fetchTypeMap[fetchType].cssNameBorder}`}
                    key={fetch.timestampId}
                  >
                    <Link
                      className="full-fetch-link"
                      href={`/fetches/${fetch.timestampId}`}
                    >
                      <p className="full-fetch-list-item-text">
                        <strong className={fetchTypeMap[fetchType].cssNameText}>
                          {fetchTypeMap[fetchType].title}{" "}
                        </strong>
                        <strong className="full-fetch-list-title-product">
                          - {numProducts} Product{numProducts > 1 && "s"}
                        </strong>
                        <br />
                        {fetch.productList}
                        <br />
                        <small className="full-fetch-list-item-timestamp">
                          {fetch.timestamp.substring(0, 19).replace("T", " ")}
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
