"use client";
import React from "react";
import {
  CompletedFetchProps,
  ProductListingsProps,
  FetchPageProps,
} from "@/typings";

export default function CpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  const tableHeading = [
    "Product",
    "Store",
    "Benchmark Value",
    "Price",
    "Price / Performance Score",
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
                {listing.productLink !== "" ? (
                  <td>
                    <a
                      href={listing.productLink}
                      target="_blank"
                      className="externalLink"
                      data-tooltip="Go to product page on store 🡕"
                    >
                      {listing.productCategory}
                    </a>
                  </td>
                ) : (
                  <td>
                    <em data-tooltip="No link available">
                      {listing.productCategory}
                    </em>
                  </td>
                )}{" "}
                <td>{listing.storeName}</td> <td>{listing.benchmarkValue}</td>{" "}
                {/* {listing.productLink} {listing.productName}{" "} */}
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
