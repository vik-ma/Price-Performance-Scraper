import React from "react";
import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import { ProductListingsProps } from "@/typings";

type PageProps = {
  params: {
    fetchId: string;
  };
};

const getFetch = async (fetchId: string) => {
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

export default async function FetchPage({ params: { fetchId } }: PageProps) {
  const gqlData = await getFetch(fetchId);
  const heading = [
    "Product",
    "Store",
    "Price",
    "Price/Performance Ratio",
    "Benchmark Value",
  ];

  return (
    <table>
      <thead>
        <tr>
          {heading.map((head, headID) => (
            <th key={headID}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {gqlData?.productListings.map(
          (listing: ProductListingsProps, index: number) => (
            <tr key={index}>
              <td>{listing.productCategory}</td> <td>{listing.storeName}</td> <td>{listing.price}</td>{" "}
              {/* {listing.productLink} {listing.productName}{" "} */}
              <td>{listing.pricePerformanceRatio}</td> <td>{listing.benchmarkValue}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
