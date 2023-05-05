"use client";
import { useState, useEffect } from "react";
import {
  ProductListingsProps,
  FetchPageProps,
  ProductTableSortProps,
  TableHeadingProps,
  CpuInfoProps,
  NumberMap,
} from "@/typings";
import Caret from "@/app/icons/Caret";
import { cpuInfo } from "@/app/ProductInfo";

export default function CpuListingsTable({
  params: { fetchInfo, productListings },
}: FetchPageProps) {
  // Width of user window
  const [windowWidth, setWindowWidth] = useState<number>(1920);

  // Array of all headings for the Price Scrape listing table, along with each heading's properties
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
      // Place tooltip text to the right of text on very small screens
      TooltipPlacement: windowWidth <= 500 ? "right" : "",
    },
    {
      Label:
        windowWidth <= 500
          ? // Combine Model and Benchmark Score into one column on screens below 500 pixel widths
            "Model"
          : windowWidth > 500 && windowWidth <= 767
          ? // Shorten the label text between 501 and 767 pixel widths
            "Bench."
          : "Benchmark Score",
      Key: "benchmarkValue",
      TooltipText:
        "Average benchmark score for CPU model at the time of scrape",
      TooltipPlacement: "",
    },
    {
      Label: "Price",
      Key: "price",
      TooltipText: "Price excluding shipping",
      TooltipPlacement: "",
    },
    {
      // Abbreviate the label text to initials below 767 pixel widths
      Label: windowWidth <= 767 ? "P. P. S." : "Price / Performance Score",
      Key: "pricePerformanceRatio",
      TooltipText:
        // Show the full term of abbreviated label in tooltip
        windowWidth <= 767
          ? "Price/Performance Score (Higher is better)"
          : "Higher is better",
      TooltipPlacement: windowWidth <= 767 ? "left" : "",
    },
  ];

  // useState for which column the Product Listing table should sort by, and in what direction ("asc" or "desc")
  const [sortTable, setSortTable] = useState<ProductTableSortProps>({
    SortKey: "pricePerformanceRatio",
    SortDirection: "desc",
  });

  // Handle function for when user clicks on a table heading which sorts the table by that column
  const handleHeaderClick = (head: keyof ProductListingsProps) => {
    setSortTable({
      // SortKey = Which column the table should be sorted after
      SortKey: head,
      // SortDirection = Whether the items should be sorted in ascending or descending order
      SortDirection:
        head === sortTable.SortKey
          ? sortTable.SortDirection === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  };

  // Array of all Product Listings for Price Scrape in the order that they have been sorted in
  const sortedListings = [...productListings].sort((a, b) => {
    const columnA = a[sortTable.SortKey];
    const columnB = b[sortTable.SortKey];
    const direction = sortTable.SortDirection === "asc" ? 1 : -1;
    if (columnA < columnB) return -1 * direction;
    if (columnA > columnB) return 1 * direction;
    return 0;
  });

  // Highest Price/Performance Score (Ratio) of any Product Listing in Price Scrape
  const pprMaxValue: number = productListings[0].pricePerformanceRatio;
  // Lowest Price/Performance Score (Ratio) of any Product Listing in Price Scrape
  const pprMinValue: number =
    productListings[productListings.length - 1].pricePerformanceRatio;

  // Difference in highest PPS to lowest PPS, used to calculate relative value between them later
  const pprDiffValue: number = pprMaxValue - pprMinValue;

  // Number of different colors that visually represents how good the PPS is
  const pprNumColors: number = 24;

  // List of all stores in Price Scrape
  const storeNames: string[] = [];
  // List of all product podels in Price Scrape
  const productModels: string[] = [];

  // Add all different stores and product models gathered from Price Scrape to a list where
  // Product Listings featuring these can be filtered out
  Object.values(sortedListings).forEach((listing) => {
    if (!storeNames.includes(listing.storeName)) {
      storeNames.push(listing.storeName);
    }
    if (!productModels.includes(listing.productCategory)) {
      productModels.push(listing.productCategory);
    }
  });

  // Sort filters alphabetically
  storeNames.sort();
  productModels.sort();

  // List of stores gathered from Price Scrape that will show up in Product Listing table
  const [selectedStores, setSelectedStores] = useState<string[]>(storeNames);

  // List of product models in Price Scrape that will show up in Product Listing table
  const [selectedProductModels, setSelectedProductModels] =
    useState<string[]>(productModels);

  // Product Listings which will appear in Product Listing table.
  // (Product Listings which contain a store or product model that is not contained in
  // selectedStores or selectedProductModels will be filtered out.)
  const filteredListings = sortedListings.filter(
    (listing) =>
      selectedStores.includes(listing.storeName) &&
      selectedProductModels.includes(listing.productCategory)
  );

  const cpuProductInfo: CpuInfoProps = cpuInfo;

  // Benchmark Type property as it is named in ProductInfo.tsx
  const benchmarkType: string =
    fetchInfo.benchmarkType === "CPU-Gaming" ? "gamingTier" : "normalTier";

  // Assign specific colors to the different product models in Price Scrape
  const modelColor: NumberMap = fetchInfo.productList
    .split(", ")
    .reduce((acc, cur, idx) => {
      acc[cur] = idx;
      return acc;
    }, {} as NumberMap);

  // Setting to display different product models in different colors
  const [colorCodingEnabled, setColorCodingEnabled] = useState<boolean>(true);

  // Get the user window width and scroll to top of page on page load
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  // Change windowWidth when user window changes
  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
  }, []);

  // Handle function for when user checks or unchecks a checkbox to filter stores
  const handleStoreFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    storeName: string
  ) => {
    const isChecked = event.target.checked;
    setSelectedStores((prevSelectedStores) => {
      if (isChecked) {
        return [...prevSelectedStores, storeName];
      } else {
        return prevSelectedStores.filter((name) => name !== storeName);
      }
    });
  };

  // Handle function for when user checks or unchecks a checkbox to filter product models
  const handleModelFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    model: string
  ) => {
    const isChecked = event.target.checked;
    setSelectedProductModels((prev) => {
      if (isChecked) {
        return [...prev, model];
      } else {
        return prev.filter((name) => name !== model);
      }
    });
  };

  return (
    <>
      <details>
        <summary className="filter-button" role="button">
          <strong>Filter Stores</strong>
        </summary>
        <div className="filter-listing-container">
          {/* Create checkboxes for every different store in Price Scrape */}
          {storeNames.map((storeName, index) => (
            <div key={index}>
              <label className="listing-table-label">
                <input
                  type="checkbox"
                  checked={selectedStores.includes(storeName)}
                  onChange={(event) =>
                    handleStoreFilterChange(event, storeName)
                  }
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
          {/* Create checkboxes for every different product model in Price Scrape
              and color the label with its specific color, if color-coding is enabled */}
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
                    onChange={(event) => handleModelFilterChange(event, model)}
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
          Enable color coding for different CPU models
        </label>
      </div>
      <table className="listing-table" role="grid">
        <thead>
          <tr>
            {/* Create all table headings in tableHeading array */}
            {tableHeading.map((head, headID) => (
              <th
                key={headID}
                onClick={
                  headID === 0 || headID === 1
                  // Every head except index 0 and 1 is clickable
                    ? undefined
                    : () =>
                        handleHeaderClick(
                          // Clicking these headers will sort the Product Listing table based on this column
                          head.Key as keyof ProductListingsProps
                        )
                }
                className={
                  windowWidth > 500
                  // Display all table heads on screens over 500 px wide
                    ? headID === 0
                      ? "table-head listing-table-head listing-table-head-first"
                      : headID === tableHeading.length - 1
                      ? "table-head listing-table-head listing-table-head-last listing-table-head-last-cpu"
                      : "table-head listing-table-head"
                    : headID === 0
                    // Don't display first column for screens below 500 px wide
                    ? "display-none"
                    : headID === 1
                    ? "table-head listing-table-head listing-table-head-first"
                    : headID === tableHeading.length - 1
                    ? "table-head listing-table-head listing-table-head-last listing-table-head-last-cpu"
                    : "table-head listing-table-head"
                }
              >
                <span
                  className={
                    headID === 2 || headID === 3 || headID === 4
                      // Add pointer cursor to clickable headings
                      ? "clickable"
                      : ""
                  }
                  data-tooltip={
                    // Don't add tooltips to tableHeading indices with empty TooltipText
                    head.TooltipText !== "" ? head.TooltipText : undefined
                  }
                  data-placement={
                    // Add default placement of tooltip to tableHeading indices with empty TooltipPlacement
                    head.TooltipPlacement !== "" ? head.TooltipPlacement : ""
                  }
                >
                  {/* Show the arrow indicating which direction the column is sorted to the
                      left of the table heading text on screens smaller than 767 px width */}
                  {sortTable.SortKey === head.Key &&
                    windowWidth <= 767 &&
                    (sortTable.SortDirection === "asc" ? (
                      <span className="arrow-left-side">
                        {/* 180 = Arrow pointing up */}
                        <Caret rotate={180} />
                      </span>
                    ) : (
                      <span className="arrow-left-side">
                        {/* Default = Arrow pointing down */}
                        <Caret />
                      </span>
                    ))}
                  <strong>{head.Label}</strong>
                </span>
                {/* Show the arrow indicating which direction the column is sorted to the
                    right of the table heading text on screens wider than 767 px width */}
                {sortTable.SortKey === head.Key &&
                  windowWidth > 767 &&
                  (sortTable.SortDirection === "asc" ? (
                    <span className="arrow-right-side">
                      {/* 180 = Arrow pointing up */}
                      <Caret rotate={180} />
                    </span>
                  ) : (
                    <span className="arrow-right-side">
                      {/* Default = Arrow pointing down */}
                      <Caret />
                    </span>
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Fill every row in the table with a Product Listing from the Price Scrape,
              excluding the ones filtered out. */}
          {filteredListings?.map(
            (listing: ProductListingsProps, index: number) => {
              // Calculate how good the PPS is compared to the best and worst PPS
              // in the Price Scrape, and assign a color based on the value
              const pprTextColor: number = Math.round(
                ((listing.pricePerformanceRatio - pprMinValue) / pprDiffValue) *
                  pprNumColors
              );
              // Color of the specific Product Model
              const colorNum: number = modelColor[
                listing.productCategory
              ] as number;
              // Benchmark Tier of the specific Product Model
              const tierNum = (
                cpuProductInfo[listing.productCategory] as {
                  [key: string]: string;
                }
              )?.[benchmarkType];
              return (
                <tr key={index}>
                  {windowWidth > 500 && (
                    // Only display first column on screens wider than 500 px
                    <td className="nowrap">
                      <strong>
                        <div
                          className={
                            colorCodingEnabled
                              // Assign the specific color of the Product Model as a background
                              // if color-coding is enabled
                              ? `model-background model-gradient-${colorNum}`
                              : "text-centered"
                          }
                        >
                          {listing.productCategory}
                        </div>
                      </strong>
                    </td>
                  )}
                  {listing.productLink !== "" ? (
                    // Create a link to the actual Product Listing
                    <td className="word-break">
                      <strong>
                        <a
                          href={listing.productLink}
                          target="_blank"
                          className="external-link"
                          data-tooltip="Go to product page on store 🡕"
                          data-placement={windowWidth <= 500 ? "right" : ""}
                        >
                          {listing.storeName}
                        </a>
                      </strong>
                    </td>
                  ) : (
                    // Don't add link if no link exists
                    <td className="word-break">
                      <strong>
                        <em data-tooltip="No link available">
                          {listing.storeName}
                        </em>
                      </strong>
                    </td>
                  )}
                  <td>
                    {/* Combine first and second columns for screens smaller than 500 px width */}
                    {windowWidth <= 500 ? (
                      <>
                        <div
                          className={
                            colorCodingEnabled
                            // Assign the specific color of the Product Model as a background
                            // if color-coding is enabled
                              ? `model-background model-gradient-${colorNum} model-shortened-cpu`
                              : "model-shortened-cpu"
                          }
                        >
                          <strong
                            className="model-tooltip"
                            data-tooltip={listing.productCategory}
                          >
                            {/* Shorten the Product Model name */}
                            {listing.productCategory.split(" ").slice(-1)}
                          </strong>
                        </div>
                        <div
                          // Display the product's Benchmark Value in the color of the Product Model's Benchmark Tier 
                          className={`text-color-tier-${tierNum} benchmark-value-shortened-cpu text-centered`}
                        >
                          <strong data-tooltip={`Tier ${tierNum}`}>
                            {listing.benchmarkValue}
                          </strong>
                        </div>
                      </>
                    ) : (
                      //  Display the product's Benchmark Value in the color of the Product Model's Benchmark Tier
                      <div className={`text-color-tier-${tierNum}`}>
                        <strong data-tooltip={`Tier ${tierNum}`}>
                          {listing.benchmarkValue}
                        </strong>
                      </div>
                    )}
                  </td>
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
