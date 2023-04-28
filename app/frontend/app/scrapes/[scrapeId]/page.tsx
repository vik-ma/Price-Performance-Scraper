import React from "react";
import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import {
  ProductListingsProps,
  CompletedFetchProps,
  FetchPageProps,
} from "@/typings";
import CpuListingsTable from "./CpuListingsTable";
import GpuListingsTable from "./GpuListingsTable";
import { notFound } from "next/navigation";

export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 60,
  fetchCache = "auto",
  runtime = "nodejs";

type PageProps = {
  params: {
    scrapeId: string;
  };
};

const getProductListings = async (scrapeId: string) => {
  const { data } = await client.query({
    query: gql`
      {
        productListings(timestampId:"${scrapeId}") {
            productCategory
            storeName
            price
            productLink
            productName
            pricePerformanceRatio
            benchmarkValue
        }
      }
    `,
  });

  return data.productListings as ProductListingsProps[];
};

const getCompletedFetch = async (scrapeId: string) => {
  const { data } = await client.query({
    query: gql`
      {
        completedFetchById(timestampId:"${scrapeId}") {
          productList
          benchmarkType
          timestamp
          timestampId
        }
      }
    `,
  });

  return data.completedFetchById[0] as CompletedFetchProps;
};

export default async function FetchPage({
  params: { scrapeId: scrapeId },
}: PageProps) {
  const gqlProductListingData = await getProductListings(scrapeId);
  const gqlCompletedFetchData = await getCompletedFetch(scrapeId);

  if (gqlCompletedFetchData === undefined) return notFound();

  const timestamp = scrapeId;
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(8, 10);
  const minute = timestamp.substring(10, 12);
  const second = timestamp.substring(12, 14);

  const formattedTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return (
    <>
      <title>
        {`${
          gqlCompletedFetchData.benchmarkType === "CPU-Gaming"
            ? "CPU (Gaming)"
            : gqlCompletedFetchData.benchmarkType === "CPU-Normal"
            ? "CPU (Multi-th.)"
            : "GPU"
        } - ${formattedTimestamp}`}
      </title>
      <div className="scrape-content">
        <h1
          className={`scrape-title ${
            gqlCompletedFetchData.benchmarkType === "GPU"
              ? "title-text-gpu"
              : gqlCompletedFetchData.benchmarkType === "CPU-Gaming"
              ? "title-text-cpu-g"
              : "title-text-cpu-n"
          }`}
        >
          {gqlCompletedFetchData.benchmarkType === "CPU-Gaming"
            ? "CPU (Gaming Performance)"
            : gqlCompletedFetchData.benchmarkType === "CPU-Normal"
            ? "CPU (Multi-threaded Performance)"
            : gqlCompletedFetchData.benchmarkType}
        </h1>
        <h2 className="scrape-title-product-list">
          {gqlCompletedFetchData.productList}
        </h2>
        <h3 className="scrape-timestamp">{formattedTimestamp}</h3>
        {gqlCompletedFetchData.benchmarkType === "GPU" ? (
          <GpuListingsTable
            params={{
              fetchInfo: gqlCompletedFetchData,
              productListings: gqlProductListingData,
            }}
          />
        ) : (
          <CpuListingsTable
            params={{
              fetchInfo: gqlCompletedFetchData,
              productListings: gqlProductListingData,
            }}
          />
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
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

  const scrapes: CompletedFetchProps[] = await data.allCompletedFetches;

  return scrapes.map((scrape) => ({
    scrapeId: scrape.timestampId,
  }));
}
