import React from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import Link from "next/link";
import { CompletedFetchProps } from "@/typings";

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

  return (
    <div className="sidebar-fetch-items">
      <ul>
        {gqlData
          ?.slice(0)
          .reverse()
          .map((fetch: CompletedFetchProps) => (
            <li key={fetch.timestampId}>
              <Link href={`/fetches/${fetch.timestampId}`}>
                {/* {fetch.productList}
              <br /> */}
                <strong>
                  {fetch.benchmarkType === "CPU-Normal"
                    ? `CPU (Multi-th.)`
                    : fetch.benchmarkType === "CPU-Gaming"
                    ? `CPU (Gaming)`
                    : `${fetch.benchmarkType}`}
                </strong>
                <br />
                <small>
                  {fetch.timestamp.substring(0, 10)}
                  <br />
                  {fetch.timestamp.substring(11, 19)}
                </small>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
