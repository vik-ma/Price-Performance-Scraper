import React from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
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

export default async function Fetches() {
  const gqlData = await getCompletedFetches();
  
  return (
    <>
      <div className="fetchContent">
        <h1>Completed Fetches</h1>
        {/* @ts-ignore */}
        {/* <FetchesList /> */}
        <p>asd</p>
      </div>
    </>
  );
}
