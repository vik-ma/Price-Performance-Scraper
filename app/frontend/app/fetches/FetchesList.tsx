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
    <ul>
      {gqlData?.map((fetch: CompletedFetchProps) => (
        <li key={fetch.timestampId}>
          <Link href={`/fetches/${fetch.timestampId}`}>
            {fetch.productList}
            <br />
            {fetch.benchmarkType} -{" "}
            {fetch.timestamp.substring(0, 19).replace("T", " ")}
          </Link>
        </li>
      ))}
    </ul>
  );
}
