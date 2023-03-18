"use client";
import React from "react";
import { useState } from "react";
import {
  CompletedFetchProps,
  ProductListingsProps,
  FetchPageProps,
  ProductTableSortProps,
  TableHeadingProps,
  GpuInfoProps,
} from "@/typings";
import Caret from "@/app/icons/Caret";
import { gpuInfo } from "@/app/ProductInfo";

export default function GpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  const tableHeading: TableHeadingProps[] = [
    {
      Label: "Product",
      Key: "productName",
      Tooltip: "",
    },
    {
      Label: "Store",
      Key: "storeName",
      Tooltip: "Link to product may not work for older scrapes",
    },
    { Label: "Model", Key: "productCategory", Tooltip: "" },
    {
      Label: "Benchmark Score",
      Key: "benchmarkValue",
      Tooltip: "Average benchmark score for GPU model at the time of scrape",
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

  const gpuProductInfo: GpuInfoProps = gpuInfo;

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
              const cssName: string = (
                gpuProductInfo[listing.productCategory] as { cssName: string }
              )?.cssName;
              return (
                <tr key={index}>
                  <td>
                    <strong>{listing.productName}</strong>
                  </td>{" "}
                  {listing.productLink !== "" ? (
                    <td className="word-break">
                      <strong>
                        <a
                          href={listing.productLink}
                          target="_blank"
                          className="external-link"
                          data-tooltip="Go to product page on store 🡕"
                        >
                          {listing.storeName}
                        </a>
                      </strong>
                    </td>
                  ) : (
                    <td className="word-break">
                      <strong>
                        <em data-tooltip="No link available">
                          {listing.storeName}
                        </em>
                      </strong>
                    </td>
                  )}{" "}
                  <td className="nowrap">
                    <strong>
                      <div className={`model-background ${cssName}`}>
                        {listing.productCategory}
                      </div>
                    </strong>
                  </td>{" "}
                  <td>
                    <strong>{listing.benchmarkValue}</strong>
                  </td>{" "}
                  <td className="nowrap">
                    <strong>{listing.price} kr</strong>
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
