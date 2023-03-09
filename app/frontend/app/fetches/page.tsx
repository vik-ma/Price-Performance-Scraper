import React from "react";
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
        <ul>
          {gqlData
            ?.slice(0)
            .reverse()
            .map((fetch: CompletedFetchProps) => (
              <li className="fullFetchListItem" key={fetch.timestampId}>
                <Link href={`/fetches/${fetch.timestampId}`}>
                  <strong>{fetch.benchmarkType}</strong>
                  <br />
                  {fetch.productList}
                  <br />
                  <small>{fetch.timestamp.substring(0, 19).replace("T", " ")}</small>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
