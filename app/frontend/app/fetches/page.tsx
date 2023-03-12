import React, { Suspense } from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { CompletedFetchProps } from "@/typings";
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

  return (
    <>
      <div className="fetchContent">
        <h1>Completed Fetches</h1>
        <Suspense fallback={<article aria-busy="true"></article>}>
          <ul>
            {gqlData
              ?.slice(0)
              .reverse()
              .map((fetch: CompletedFetchProps) => (
                <li className="fullFetchListItem" key={fetch.timestampId}>
                  <Link
                    className="fullFetchLink"
                    href={`/fetches/${fetch.timestampId}`}
                  >
                    <p>
                      <strong className={fetch.benchmarkType}>
                        {fetch.benchmarkType === "CPU-Normal"
                          ? `CPU (Multi-threaded Performance)`
                          : fetch.benchmarkType === "CPU-Gaming"
                          ? `CPU (Gaming Performance)`
                          : `${fetch.benchmarkType}`}
                      </strong>
                      <br />
                      {fetch.productList}
                      <br />
                      <small>
                        {fetch.timestamp.substring(0, 19).replace("T", " ")}
                      </small>
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </Suspense>
      </div>
    </>
  );
}
