"use client";
import React from "react";
import { useState } from "react";
import {
  CompletedFetchProps,
  ProductListingsProps,
  FetchPageProps,
  ProductTableSortProps,
  TableHeadingProps
} from "@/typings";
import Caret from "@/app/icons/Caret";

export default function GpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {

  const tableHeading: TableHeadingProps[] = [
    { Label: "Product", Key: "productName", Tooltip: ""},
    { Label: "Store", Key: "storeName", Tooltip: ""},
    { Label: "Model", Key: "productCategory", Tooltip: ""},
    { Label: "Benchmark Score", Key: "benchmarkValue", Tooltip: "Average benchmark score for GPU model"},
    { Label: "Price", Key: "price", Tooltip: "Price excluding shipping"},
    { Label: "Price / Performance Score", Key: "pricePerformanceRatio", Tooltip: "Higher is better"},
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
      <table role="grid">
        <thead>
          <tr>
          {tableHeading.map((head, headID) => (
              <th
                key={headID}
                onClick={
                  headID === 0 || headID === 1 || headID === 2
                    ? undefined
                    : () =>
                        handleHeaderClick(
                          head.Key as keyof ProductListingsProps
                        )
                }
                className={headID === 0 || headID === 1 || headID === 2 ? "" : "clickable"}
              >
                <span data-tooltip={head.Tooltip !== "" ? head.Tooltip : undefined}>
                  <strong>{head.Label}</strong>
                </span>
                {sortTable.SortKey === head.Key ? (
                  sortTable.SortDirection === "asc" ? (
                    <span className="arrow">
                      {" "}
                      <Caret rotate={180} />
                    </span>
                  ) : (
                    <span className="arrow">
                      {" "}
                      <Caret />
                    </span>
                  )
                ) : (
                  ""
                )}
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
