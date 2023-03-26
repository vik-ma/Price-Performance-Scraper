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
  NumberMap,
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

  const storeNames: string[] = [];
  const productModels: string[] = [];

  Object.values(sortedListings).forEach((listing) => {
    if (!storeNames.includes(listing.storeName)) {
      storeNames.push(listing.storeName);
    }
    if (!productModels.includes(listing.productCategory)) {
      productModels.push(listing.productCategory);
    }
  });

  storeNames.sort();
  productModels.sort();

  const [selectedStores, setSelectedStores] = useState<string[]>(storeNames);

  const [selectedProductModels, setSelectedProductModels] =
    useState<string[]>(productModels);

  const filteredListings = sortedListings.filter(
    (listing) =>
      selectedStores.includes(listing.storeName) &&
      selectedProductModels.includes(listing.productCategory)
  );

  const gpuProductInfo: GpuInfoProps = gpuInfo;

  const modelColor: NumberMap = fetchInfo.productList
    .split(", ")
    .reduce((acc, cur, idx) => {
      acc[cur] = idx;
      return acc;
    }, {} as NumberMap);

  const [colorCodingEnabled, setColorCodingEnabled] = useState<boolean>(true);

  return (
    <>
      <details>
        <summary className="filter-button" role="button">
          <strong>Filter Stores</strong>
        </summary>
        <div className="filter-listing-container">
          {storeNames.map((storeName, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStores.includes(storeName)}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedStores((prev) => {
                      if (isChecked) {
                        return [...prev, storeName];
                      } else {
                        return prev.filter((name) => name !== storeName);
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
      <details>
        <summary className="filter-button" role="button">
          <strong>Filter Product Models</strong>
        </summary>
        <div className="filter-listing-container">
          {productModels.map((model, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedProductModels.includes(model)}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedProductModels((prev) => {
                      if (isChecked) {
                        return [...prev, model];
                      } else {
                        return prev.filter((name) => name !== model);
                      }
                    });
                  }}
                />
                {model}
              </label>
            </div>
          ))}
        </div>
      </details>
      <div className="color-toggle-container">
        <input
          type="checkbox"
          checked={colorCodingEnabled}
          onChange={() => setColorCodingEnabled(!colorCodingEnabled)}
        />
        <label htmlFor="colorCodingEnabled">
          Enable color coding for different GPU models
        </label>
      </div>
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
                {sortTable.SortKey === head.Key &&
                  (sortTable.SortDirection === "asc" ? (
                    <span className="arrow">
                      <Caret rotate={180} />
                    </span>
                  ) : (
                    <span className="arrow">
                      <Caret />
                    </span>
                  ))}
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
              const colorNum: number = modelColor[
                listing.productCategory
              ] as number;
              const tierNum = (
                gpuProductInfo[listing.productCategory] as {
                  tier: string;
                }
              )?.tier;
              return (
                <tr key={index}>
                  <td>
                    <strong>{listing.productName}</strong>
                  </td>
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
                  )}
                  <td className="nowrap">
                    <strong>
                      <div
                        className={
                          colorCodingEnabled
                            ? `model-background model-gradient-${colorNum}`
                            : ""
                        }
                      >
                        {listing.productCategory}
                      </div>
                    </strong>
                  </td>
                  <td className={`text-color-tier-${tierNum}`}>
                    <strong data-tooltip={`Tier ${tierNum}`}>
                      {listing.benchmarkValue}
                    </strong>
                  </td>
                  <td className="nowrap price-cell">
                    <strong>{listing.price} kr</strong>
                  </td>
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
