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
                      {listing.productName}
                    </a>
                  </td>
                ) : (
                  <td>
                    <em data-tooltip="No link available">
                      {listing.productName}
                    </em>
                  </td>
                )}{" "}
                <td>{listing.storeName}</td> <td>{listing.productCategory}</td>{" "}
                {/* {listing.productLink} */}
                <td>{listing.benchmarkValue}</td> <td>{listing.price}</td>{" "}
                <td>{listing.pricePerformanceRatio}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}
