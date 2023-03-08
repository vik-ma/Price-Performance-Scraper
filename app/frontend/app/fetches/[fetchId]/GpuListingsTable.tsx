"use client";
import React from "react";
import {
  CompletedFetchProps,
  ProductListingsProps,
  FetchPageProps,
} from "@/typings";

export default function GpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  const tableHeading = [
    "Product",
    "Store",
    "Product Category",
    "Benchmark Value",
    "Price",
    "Price/Performance Score",
  ];

  return (
    <>
      <table>
        <thead>
          <tr>
            {tableHeading.map((head, headID) => (
              <th key={headID}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productListings?.map(
            (listing: ProductListingsProps, index: number) => (
              <tr key={index}>
                <td>{listing.productName}</td> <td>{listing.storeName}</td>{" "}
                <td>{listing.productCategory}</td>{" "}
                {/* {listing.productLink} */}
                <td>{listing.benchmarkValue}</td>{" "}
                <td>{listing.price}</td>{" "}
                <td>{listing.pricePerformanceRatio}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}
