"use client";
import React from "react";
import { useState } from "react";
import {
  CompletedFetchProps,
  ProductListingsProps,
  FetchPageProps,
  ProductTableSortProps,
  TableHeadingProps,
} from "@/typings";
import Caret from "@/app/icons/Caret";

export default function GpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  const tableHeading: TableHeadingProps[] = [
    { Label: "Product", Key: "productName", Tooltip: "" },
    { Label: "Store", Key: "storeName", Tooltip: "" },
    { Label: "Model", Key: "productCategory", Tooltip: "" },
    {
      Label: "Benchmark Score",
      Key: "benchmarkValue",
      Tooltip: "Average benchmark score for GPU model",
    },
    { Label: "Price", Key: "price", Tooltip: "Price excluding shipping" },
    {
      Label: "Price / Performance Score",
      Key: "pricePerformanceRatio",
      Tooltip: "Higher is better",
    },
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

  const pprMaxValue: number = productListings[0].pricePerformanceRatio;
  const pprMinValue: number =
    productListings[productListings.length - 1].pricePerformanceRatio;

  const pprDiffValue: number = pprMaxValue - pprMinValue;

  const pprNumColors: number = 24;

  const storeNames = Array.from(
    new Set(sortedListings.map((listing) => listing.storeName))
  );

  const [selectedStores, setSelectedStores] = useState<string[]>(storeNames);

  const filteredListings = sortedListings.filter((listing) =>
    selectedStores.includes(listing.storeName)
  );

  return (
    <>
      <details>
        <summary className="filter-button" role="button">
          <strong>Filter Stores</strong>
        </summary>
        <div className="filter-container">
          {storeNames.map((storeName, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStores.includes(storeName)}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedStores((prevSelectedStores) => {
                      if (isChecked) {
                        return [...prevSelectedStores, storeName];
                      } else {
                        return prevSelectedStores.filter(
                          (name) => name !== storeName
                        );
                      }
                    });
                  }}
                />
                {storeName}
              </label>
            </div>
          ))}
        </div>
      </details>
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
                className={
                  headID === 0 || headID === 1 || headID === 2
                    ? "tableHead"
                    : "tableHead clickable"
                }
              >
                <span
                  data-tooltip={head.Tooltip !== "" ? head.Tooltip : undefined}
                >
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
          {filteredListings?.map(
            (listing: ProductListingsProps, index: number) => {
              const pprTextColor: number = Math.round(
                ((listing.pricePerformanceRatio - pprMinValue) / pprDiffValue) *
                  pprNumColors
              );
              return (
                <tr key={index}>
                  {listing.productLink !== "" ? (
                    <td>
                      <strong>
                        <a
                          href={listing.productLink}
                          target="_blank"
                          className="external-link"
                          data-tooltip="Go to product page on store 🡕"
                        >
                          {listing.productName}
                        </a>
                      </strong>
                    </td>
                  ) : (
                    <td>
                      <strong>
                        <em data-tooltip="No link available">
                          {listing.productName}
                        </em>
                      </strong>
                    </td>
                  )}{" "}
                  <td>
                    <strong>{listing.storeName}</strong>
                  </td>{" "}
                  <td>
                    <strong>{listing.productCategory}</strong>
                  </td>{" "}
                  {/* {listing.productLink} */}
                  <td>
                    <strong>{listing.benchmarkValue}</strong>
                  </td>{" "}
                  <td>
                    <strong>{listing.price}</strong>
                  </td>{" "}
                  <td className={`ppr-color-${pprTextColor}`}>
                    <strong>{listing.pricePerformanceRatio}</strong>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </>
  );
}
