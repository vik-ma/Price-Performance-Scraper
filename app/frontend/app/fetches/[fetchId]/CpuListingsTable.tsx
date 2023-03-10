"use client";
import React from "react";
import { useState } from "react";
import {
  CompletedFetchProps,
  ProductListingsProps,
  FetchPageProps,
} from "@/typings";

type ProductTableSortProps = {
  SortKey: keyof ProductListingsProps;
  SortDirection: "asc" | "desc";
};

type TableHeadingProps = {
  Label: string;
  Key: keyof ProductListingsProps;
};

export default function CpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  const tableHeading: TableHeadingProps[] = [
    { Label: "Product", Key: "productName" },
    { Label: "Store", Key: "storeName" },
    { Label: "Benchmark Value", Key: "benchmarkValue" },
    { Label: "Price", Key: "price" },
    { Label: "Price / Performance Score", Key: "pricePerformanceRatio" },
  ];

  const [sortTable, setSortTable] = useState<ProductTableSortProps>({
    SortKey: "pricePerformanceRatio",
    SortDirection: "desc",
  });

  const handleHeaderClick = (head: keyof ProductListingsProps) => {
    setSortTable({
      SortKey: head,
      SortDirection:
        head === sortTable.SortKey
          ? sortTable.SortDirection === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  };

  const sortedListings = [...productListings].sort((a, b) => {
    const columnA = a[sortTable.SortKey];
    const columnB = b[sortTable.SortKey];
    const direction = sortTable.SortDirection === "asc" ? 1 : -1;
    if (columnA < columnB) return -1 * direction;
    if (columnA > columnB) return 1 * direction;
    return 0;
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            {tableHeading.map((head, headID) => (
              <th
                key={headID}
                onClick={
                  headID === 0 || headID === 1
                    ? undefined
                    : () =>
                        handleHeaderClick(
                          head.Key as keyof ProductListingsProps
                        )
                }
              >
                {head.Label}{" "}
                {sortTable.SortKey === head.Key
                  ? sortTable.SortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedListings?.map(
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
