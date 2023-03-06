import React from "react";
import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import { ProductListingsProps, CompletedFetchProps } from "@/typings";

type PageProps = {
  params: {
    fetchId: string;
  };
};

const getProductListings = async (fetchId: string) => {
  const { data } = await client.query({
    query: gql`
      query {
        productListings(timestampId:"${fetchId}") {
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

  return data;
};

const getCompletedFetch = async (fetchId: string) => {
    const { data } = await client.query({
      query: gql`
        query {
            completedFetchById(timestampId:"${fetchId}") {
            productList
            benchmarkType
          }
        }
      `,
    });
  
    return data;
  }

export default async function FetchPage({ params: { fetchId } }: PageProps) {
  const gqlProductListingData = await getProductListings(fetchId);
  const gqlCompletedFetchData = await getCompletedFetch(fetchId);
  const heading = [
    "Product",
    "Store",
    "Price",
    "Price/Performance Ratio",
    "Benchmark Value",
  ];
  const timestamp = fetchId;
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(8, 10);
  const minute = timestamp.substring(10, 12);
  const second = timestamp.substring(12, 14);

  const formattedTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  const fetchInfo = gqlCompletedFetchData.completedFetchById[0]

  return (
    <>
      <h1>{fetchInfo.benchmarkType}</h1>
      <h2>{fetchInfo.productList}</h2>
      <h3>{formattedTimestamp}</h3>
      <table>
        <thead>
          <tr>
            {heading.map((head, headID) => (
              <th key={headID}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gqlProductListingData?.productListings.map(
            (listing: ProductListingsProps, index: number) => (
              <tr key={index}>
                <td>{listing.productCategory}</td> <td>{listing.storeName}</td>{" "}
                <td>{listing.price}</td>{" "}
                {/* {listing.productLink} {listing.productName}{" "} */}
                <td>{listing.pricePerformanceRatio}</td>{" "}
                <td>{listing.benchmarkValue}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}
