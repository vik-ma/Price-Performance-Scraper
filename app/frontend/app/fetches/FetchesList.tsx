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

export default async function FetchesList() {
  const gqlData = await getCompletedFetches();

  const fetchTypeMap: FetchTypeProps = {
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
      <ul>
        {gqlData
          ?.slice(0)
          .reverse()
          .map((fetch: CompletedFetchProps) => {
            const fetchType: string = fetch.benchmarkType.replace("-", "");
            return (
              <li key={fetch.timestampId}>
                <Link href={`/fetches/${fetch.timestampId}`}>
                  <strong className={fetchTypeMap[fetchType].cssNameText}>
                    {fetchTypeMap[fetchType].title}
                  </strong>
                  <br />
                  <small>
                    {fetch.timestamp.substring(0, 10)}
                    <br />
                    {fetch.timestamp.substring(11, 19)}
                  </small>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
