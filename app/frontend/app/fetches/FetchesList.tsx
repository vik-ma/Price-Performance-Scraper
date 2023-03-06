import React from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";

type CompletedFetchProps = {
  productList: string;
  benchmarkType: string;
  timestamp: string;
  timestampId: string;
};

async function getCompletedFetches() {
  const { data } = await client.query({
    query: gql`
      query {
        allCompletedFetches {
          productList
          benchmarkType
          timestamp
          timestampId
        }
      }
    `,
  });

  return data;
}

export default async function FetchesList() {
  const gqlData = await getCompletedFetches();

  return (
    <ul>
      {gqlData?.allCompletedFetches.map((fetch: CompletedFetchProps) => (
        <li key={fetch.timestampId}>
          {fetch.productList}
          <br />
          {fetch.benchmarkType} -{" "}
          {fetch.timestamp.substring(0, 19).replace("T", " ")}
        </li>
      ))}
    </ul>
  );
}
