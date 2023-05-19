import React from "react";
import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import { ProductListingsProps, CompletedFetchProps } from "@/typings";
import CpuListingsTable from "./CpuListingsTable";
import GpuListingsTable from "./GpuListingsTable";
import { notFound } from "next/navigation";

// All default values if no revalidate
// export const dynamic = "auto",
//   dynamicParams = true,
//   // revalidate = 60,
//   fetchCache = "auto",
//   runtime = "nodejs";

type PageProps = {
  params: {
    scrapeId: string;
  };
};

// Arrow function to retrieve all Product Listings in completed Price Scrape ID via GraphQL
const getProductListings = async (scrapeId: string) => {
  // const { data } = await client.query({
  //   query: gql`
  //     {
  //       productListings(timestamp_id:"${scrapeId}") {
  //           product_category
  //           store_name
  //           price
  //           product_link
  //           product_name
  //           price_performance_ratio
  //           benchmark_value
  //       }
  //     }
  //   `,
  // });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_product_listings_from_timestamp_id/${scrapeId}/`,
    { cache: "force-cache" }
  );
  const data: ProductListingsProps[] = await res.json();

  return data;
  // return data.productListings as ProductListingsProps[];
};

// Arrow function to retrieve completed Price Scrape ID information via GraphQL
const getCompletedFetch = async (scrapeId: string) => {
  // const { data } = await client.query({
  //   query: gql`
  //     {
  //       completedFetchById(timestamp_id:"${scrapeId}") {
  //         product_list
  //         benchmark_type
  //         timestamp
  //         timestamp_id
  //       }
  //     }
  //   `,
  // });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_completed_fetch_by_timestamp_id/${scrapeId}/`,
    { cache: "force-cache" }
  );

  const data: CompletedFetchProps = await res.json();

  return data;

  // return data.completedFetchById[0] as CompletedFetchProps;
};

export default async function FetchPage({
  params: { scrapeId: scrapeId },
}: PageProps) {
  const productListingData = await getProductListings(scrapeId);
  const completedFetchData = await getCompletedFetch(scrapeId);

  // Display scrapes/not-found.tsx if user types in a Scrape ID that doesn't exist
  if (completedFetchData.hasOwnProperty("error")) return notFound();

  const timestamp: string = scrapeId;
  const year: string = timestamp.substring(0, 4);
  const month: string = timestamp.substring(4, 6);
  const day: string = timestamp.substring(6, 8);
  const hour: string = timestamp.substring(8, 10);
  const minute: string = timestamp.substring(10, 12);
  const second: string = timestamp.substring(12, 14);

  const formattedTimestamp: string = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return (
    <>
      {/* Change Title of webpage to show the Benchmark Type and Date+Time of Price Scrape */}
      <title>
        {`${
          completedFetchData.benchmark_type === "CPU-Gaming"
            ? "CPU (Gaming)"
            : completedFetchData.benchmark_type === "CPU-Normal"
            ? "CPU (Multi-th.)"
            : "GPU"
        } - ${formattedTimestamp}`}
      </title>
      <div className="scrape-content">
        {/* Display the Price Scrape's Benchmark Type in its respective color */}
        <h1
          className={`scrape-title ${
            completedFetchData.benchmark_type === "GPU"
              ? "title-text-gpu"
              : completedFetchData.benchmark_type === "CPU-Gaming"
              ? "title-text-cpu-g"
              : "title-text-cpu-n"
          }`}
        >
          {completedFetchData.benchmark_type === "CPU-Gaming"
            ? "CPU (Gaming Performance)"
            : completedFetchData.benchmark_type === "CPU-Normal"
            ? "CPU (Multi-threaded Performance)"
            : completedFetchData.benchmark_type}
        </h1>
        {/* Display list of products in Price Scrape */}
        <h2 className="scrape-title-product-list">
          {completedFetchData.product_list}
        </h2>
        {/* Display date and time of Price Scrape */}
        <h3 className="scrape-timestamp">{formattedTimestamp}</h3>
        {/* Display GPUListingsTable.tsx if Price Scrape Benchmark Type was GPU */}
        {completedFetchData.benchmark_type === "GPU" ? (
          <GpuListingsTable
            params={{
              fetchInfo: completedFetchData,
              productListings: productListingData,
            }}
          />
        ) : (
          // Display CPUListingsTable.tsx if Price Scrape Benchmark Type was CPU-Gaming or CPU-Normal(Multi-threading)
          <CpuListingsTable
            params={{
              fetchInfo: completedFetchData,
              productListings: productListingData,
            }}
          />
        )}
      </div>
    </>
  );
}

// Function to statically generate all completed Price Scrape pages
export async function generateStaticParams() {
  // const { data } = await client.query({
  //   query: gql`
  //     {
  //       allCompletedFetches {
  //         product_list
  //         benchmark_type
  //         timestamp
  //         timestamp_id
  //       }
  //     }
  //   `,
  // });

  // const scrapes: CompletedFetchProps[] = await data.allCompletedFetches;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_all_completed_fetches/`
  );
  const scrapes: CompletedFetchProps[] = await res.json();

  return scrapes.map((scrape) => ({
    scrapeId: scrape.timestamp_id,
  }));
}
