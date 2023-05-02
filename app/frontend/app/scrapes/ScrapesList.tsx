import React from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import Link from "next/link";
import { CompletedFetchProps, FetchTypeProps } from "@/typings";

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

export default async function ScrapesList() {
  const gqlData = await getCompletedFetches();

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
      <ul className="no-dot-list">
        {gqlData
          ?.slice(0)
          .reverse()
          .map((scrape: CompletedFetchProps) => {
            const scrapeType: string = scrape.benchmarkType.replace("-", "");
            const timestamp: string = scrape.timestampId
            const formattedDate: string = `${timestamp.substring(0, 4)}-${timestamp.substring(4, 6)}-${timestamp.substring(6, 8)}`;
            const formattedTime: string = `${timestamp.substring(8, 10)}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
            return (
              <li className="no-dot-list-item" key={scrape.timestampId}>
                <Link href={`/scrapes/${scrape.timestampId}`}>
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
    </div>
  );
}
