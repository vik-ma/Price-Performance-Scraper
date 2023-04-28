"use client";
import React from "react";
import { useState, useEffect } from "react";
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
import Link from "next/link";

export default function GpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  const [windowWidth, setWindowWidth] = useState<number>(1920);

  const tableHeading: TableHeadingProps[] = [
    {
      Label: "Product",
      Key: "productName",
      TooltipText: "",
      TooltipPlacement: "",
    },
    {
      Label: "Store",
      Key: "storeName",
      TooltipText: "Link to product may not work for older scrapes",
      TooltipPlacement: windowWidth <= 991 ? "right" : "",
    },
    {
      Label: "Model",
      Key: "productCategory",
      TooltipText: "",
      TooltipPlacement: "",
    },
    {
      Label:
        windowWidth <= 500
          ? "Model"
          : windowWidth > 500 && windowWidth <= 1200
          ? "Bench."
          : "Benchmark Score",
      Key: "benchmarkValue",
      TooltipText:
        "Average benchmark score for GPU model at the time of scrape",
      TooltipPlacement: "",
    },
    {
      Label: "Price",
      Key: "price",
      TooltipText: "Price excluding shipping",
      TooltipPlacement: "",
    },
    {
      Label: windowWidth <= 767 ? "P. P. S." : "Price / Performance Score",
      Key: "pricePerformanceRatio",
      TooltipText:
        windowWidth <= 767
          ? "Price/Performance Score (Higher is better)"
          : "Higher is better",
      TooltipPlacement: windowWidth <= 767 ? "left" : "",
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

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
  }, []);

  return (
    <>
      <details>
        <summary className="filter-button" role="button">
          <strong>Filter Stores</strong>
        </summary>
        <div className="filter-listing-container">
          {storeNames.map((storeName, index) => (
            <div key={index}>
              <label className="listing-table-label">
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
          {productModels.map((model, index) => {
            const colorNum: number = modelColor[model] as number;
            return (
              <div key={index}>
                <label
                  className={
                    colorCodingEnabled
                      ? `model-text-color-${colorNum}`
                      : "model-text-color-no-color"
                  }
                >
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
                  <strong>{model}</strong>
                </label>
              </div>
            );
          })}
        </div>
      </details>
      <div className="color-toggle-container">
        <label>
          <input
            type="checkbox"
            checked={colorCodingEnabled}
            onChange={() => setColorCodingEnabled(!colorCodingEnabled)}
          />
          Enable color coding for different GPU models
        </label>
      </div>
      <table className="listing-table" role="grid">
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
                  windowWidth > 991
                    ? headID === 0
                      ? "table-head listing-table-head listing-table-head-first"
                      : headID === 3 || headID === 4 || headID === 5
                      ? "table-head listing-table-head"
                      : headID === tableHeading.length - 1
                      ? "table-head listing-table-head listing-table-head-last"
                      : "table-head listing-table-head"
                    : headID === 0
                    ? "display-none"
                    : headID === 1
                    ? "table-head listing-table-head listing-table-head-first"
                    : headID === 2 && windowWidth <= 500
                    ? "display-none"
                    : headID === tableHeading.length - 1
                    ? "table-head listing-table-head listing-table-head-last"
                    : "table-head listing-table-head"
                }
              >
                <span
                  className={
                    headID === 3 || headID === 4 || headID === 5
                      ? "clickable"
                      : ""
                  }
                  data-tooltip={
                    head.TooltipText !== "" ? head.TooltipText : undefined
                  }
                  data-placement={
                    head.TooltipPlacement !== "" ? head.TooltipPlacement : ""
                  }
                >
                  {sortTable.SortKey === head.Key &&
                    windowWidth <= 767 &&
                    (sortTable.SortDirection === "asc" ? (
                      <span className="arrow-left-side">
                        <Caret rotate={180} />
                      </span>
                    ) : (
                      <span className="arrow-left-side">
                        <Caret />
                      </span>
                    ))}
                  <strong>{head.Label}</strong>
                </span>
                {sortTable.SortKey === head.Key &&
                  windowWidth > 767 &&
                  (sortTable.SortDirection === "asc" ? (
                    <span className="arrow-right-side">
                      <Caret rotate={180} />
                    </span>
                  ) : (
                    <span className="arrow-right-side">
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
                  {windowWidth > 991 && (
                    <td className="gpu-product-text">
                      <strong>{listing.productName}</strong>
                    </td>
                  )}
                  {listing.productLink !== "" ? (
                    <td className="word-break">
                      <strong>
                        <a
                          href={listing.productLink}
                          target="_blank"
                          className="external-link"
                          data-tooltip="Go to product page on store 🡕"
                          data-placement={windowWidth < 900 ? "right" : ""}
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
                    <div
                      className={
                        colorCodingEnabled
                          ? `model-background model-gradient-${colorNum}`
                          : "text-centered"
                      }
                    >
                      {windowWidth <= 500 ? (
                        <strong
                          className="model-tooltip"
                          data-tooltip={listing.productCategory}
                        >
                          {listing.productCategory
                            .split(" ")
                            .slice(2)
                            .join(" ")}
                        </strong>
                      ) : (
                        <strong>{listing.productCategory}</strong>
                      )}
                    </div>
                    {windowWidth <= 500 && (
                      <div className="text-centered benchmark-value-shortened-gpu">
                        <strong
                          className={`text-color-tier-${tierNum}`}
                          data-tooltip={`Tier ${tierNum}`}
                        >
                          {listing.benchmarkValue}
                        </strong>
                      </div>
                    )}
                  </td>
                  {windowWidth > 500 && (
                    <td className={`text-color-tier-${tierNum}`}>
                      <strong data-tooltip={`Tier ${tierNum}`}>
                        {listing.benchmarkValue}
                      </strong>
                    </td>
                  )}
                  <td className="nowrap price-cell">
                    <strong>{listing.price} kr</strong>
                  </td>
                  <td
                    className={
                      windowWidth <= 500
                        ? `ppr-color-${pprTextColor} text-centered`
                        : `ppr-color-${pprTextColor}`
                    }
                  >
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
