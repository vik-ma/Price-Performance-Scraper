"use client";
import { useState, useEffect, useRef } from "react";
import {
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
  // Number that represents which window resize breakpoint has been passed
  // 0 is above resizeBp1
  // 1 is between resizeBp1 (including) and resizeBp2 (excluding)
  // 2 is resizeBp2 and below
  const [windowResizeStage, setWindowResizeStage] = useState<number>(0);

  // Value that stores the last width of the window before hitting a breakpoint
  const previousWindowWidthRef = useRef<number>(0);

  // Breakpoints that represent the window width in pixels
  // When these are passed, the windowResizeStage changes
  const resizeBp1: number = 1199;
  const resizeBp2: number = 991;
  const resizeBp3: number = 767;
  const resizeBp4: number = 500;

  // Array of all headings for the Price Scrape listing table, along with each heading's properties
  const tableHeading: TableHeadingProps[] = [
    {
      Label: "Product",
      Key: "product_name",
      TooltipText: "",
      TooltipPlacement: "",
    },
    {
      Label: "Store",
      Key: "store_name",
      TooltipText: "Link to product may not work for older scrapes",
      // Place tooltip text to the right of text on smaller screens
      TooltipPlacement: windowResizeStage >= 2 ? "right" : "",
    },
    {
      Label: "Model",
      Key: "product_category",
      TooltipText: "",
      TooltipPlacement: "",
    },
    {
      Label:
        windowResizeStage === 4
          ? // Combine Model and Benchmark Score into one column on screens below 500 pixel widths
            "Model"
          : windowResizeStage < 4 && windowResizeStage > 1
          ? // Shorten the label text between 501 and 1199 pixel widths
            "Bench."
          : "Benchmark Score",
      Key: "benchmark_value",
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
      // Abbreviate the label text to initials below 767 pixel widths
      Label: windowResizeStage >= 3 ? "P. P. S." : "Price / Performance Score",
      Key: "price_performance_ratio",
      TooltipText:
        // Show the full term of abbreviated label in tooltip
        windowResizeStage >= 3
          ? "Price/Performance Score (Higher is better)"
          : "Higher is better",
      TooltipPlacement: windowResizeStage >= 3 ? "left" : "",
    },
  ];

  // useState for which column the Product Listing table should sort by, and in what direction ("asc" or "desc")
  const [sortTable, setSortTable] = useState<ProductTableSortProps>({
    SortKey: "price_performance_ratio",
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
  const pprMaxValue: number = productListings[0].price_performance_ratio;
  // Lowest Price/Performance Score (Ratio) of any Product Listing in Price Scrape
  const pprMinValue: number =
    productListings[productListings.length - 1].price_performance_ratio;

  // Difference in highest PPS to lowest PPS, used to calculate relative value between them later
  const pprDiffValue: number = pprMaxValue - pprMinValue;

  // Number of different colors that visually represents how good the PPS is
  const pprNumColors: number = 24;

  // List of all stores in Price Scrape
  const storeNames: string[] = [];
  // List of all product models in Price Scrape
  const productModels: string[] = [];

  // Add all different stores and product models gathered from Price Scrape to a list where
  // Product Listings featuring these can be filtered out
  Object.values(sortedListings).forEach((listing) => {
    if (!storeNames.includes(listing.store_name)) {
      storeNames.push(listing.store_name);
    }
    if (!productModels.includes(listing.product_category)) {
      productModels.push(listing.product_category);
    }
  });

  // Sort filter options alphabetically
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
      selectedStores.includes(listing.store_name) &&
      selectedProductModels.includes(listing.product_category)
  );

  const gpuProductInfo: GpuInfoProps = gpuInfo;

  // Assign specific colors to the different product models in Price Scrape
  const modelColor: NumberMap = fetchInfo.product_list
    .split(", ")
    .reduce((acc, cur, idx) => {
      acc[cur] = idx;
      return acc;
    }, {} as NumberMap);

  // Setting to display different product models in different colors
  const [colorCodingEnabled, setColorCodingEnabled] = useState<boolean>(true);

  // Scroll to top of page on page load
  // Also get user width and set windowResizeStage based on which resize breakpoint has been passed
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);

      const currWidth = window.visualViewport?.width as number;

      if (currWidth > resizeBp1) {
        setWindowResizeStage(0);
      } else if (currWidth <= resizeBp1 && currWidth > resizeBp2) {
        setWindowResizeStage(1);
      } else if (currWidth <= resizeBp2 && currWidth > resizeBp3) {
        setWindowResizeStage(2);
      } else if (currWidth <= resizeBp3 && currWidth > resizeBp4) {
        setWindowResizeStage(3);
      } else if (currWidth <= resizeBp4) {
        setWindowResizeStage(4);
      }
    }, 5);
  }, []);

  // Change windowResizeStage when user window changes past a breakpoint
  useEffect(() => {
    // Function to make useEffect only trigger when an actual breakpoint is passed
    const handleResize = () => {
      const currWidth = window.innerWidth;
      if (currWidth > resizeBp1) {
        if (previousWindowWidthRef.current <= resizeBp1)
          setWindowResizeStage(0);
      } else if (currWidth <= resizeBp1 && currWidth > resizeBp2) {
        if (
          previousWindowWidthRef.current > resizeBp1 ||
          previousWindowWidthRef.current <= resizeBp2
        )
          setWindowResizeStage(1);
      } else if (currWidth <= resizeBp2 && currWidth > resizeBp3) {
        if (
          previousWindowWidthRef.current > resizeBp2 ||
          previousWindowWidthRef.current <= resizeBp3
        )
          setWindowResizeStage(2);
      } else if (currWidth <= resizeBp3 && currWidth > resizeBp4) {
        if (
          previousWindowWidthRef.current > resizeBp3 ||
          previousWindowWidthRef.current <= resizeBp4
        )
          setWindowResizeStage(3);
      } else if (currWidth <= resizeBp3) {
        if (previousWindowWidthRef.current > resizeBp4) setWindowResizeStage(4);
      }
      previousWindowWidthRef.current = currWidth;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle function for when user checks or unchecks a checkbox to filter out stores
  const handleStoreFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    store_name: string
  ) => {
    const isChecked = event.target.checked;
    setSelectedStores((prev) => {
      if (isChecked) {
        return [...prev, store_name];
      } else {
        return prev.filter((name) => name !== store_name);
      }
    });
  };

  // Handle function for when user checks or unchecks a checkbox to filter out product models
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
          {/* Show number of filtered out stores if any stores has been filtered */}
          <strong>Filter Stores</strong>{" "}
          <span className="filter-button-products-text">
            {selectedStores.length < storeNames.length &&
              `(Showing ${selectedStores.length} out of ${storeNames.length} stores)`}
          </span>
        </summary>
        <div className="filter-listing-container">
          {/* Create checkboxes for every different store in Price Scrape */}
          {storeNames.map((store_name, index) => (
            <div key={index} className="listing-table-label-container">
              <label className="listing-table-label">
                <input
                  type="checkbox"
                  checked={selectedStores.includes(store_name)}
                  onChange={(event) =>
                    handleStoreFilterChange(event, store_name)
                  }
                />
                {store_name}
              </label>
            </div>
          ))}
        </div>
      </details>
      <details>
        <summary className="filter-button" role="button">
          {/* Show number of filtered out product models if any product models has been filtered */}
          <strong>Filter Models</strong>{" "}
          <span className="filter-button-products-text">
            {selectedProductModels.length < productModels.length &&
              `(Showing ${selectedProductModels.length} out of ${productModels.length} models)`}
          </span>
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
        <label className="color-toggle-label-listings">
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
            {/* Create all table headings in tableHeading array */}
            {tableHeading.map((head, headID) => (
              <th
                key={headID}
                onClick={
                  headID === 0 || headID === 1 || headID === 2
                    ? // Every head except index 0, 1 and 2 is clickable
                      undefined
                    : () =>
                        handleHeaderClick(
                          // Clicking these headers will sort the Product Listing table based on this column
                          head.Key as keyof ProductListingsProps
                        )
                }
                className={
                  windowResizeStage < 2
                    ? // Display all table heads on screens over 991 px wide
                      headID === 0
                      ? "listing-table-head listing-table-head-first"
                      : headID === tableHeading.length - 1
                      ? "listing-table-head listing-table-head-last listing-table-head-last-gpu"
                      : "listing-table-head"
                    : headID === 0
                    ? // Don't display first column for screens below 991 px wide
                      "display-none"
                    : headID === 1
                    ? "listing-table-head listing-table-head-first"
                    : headID === 2 && windowResizeStage === 4
                    ? // Don't display third column for screens below 500 px wide
                      "display-none"
                    : headID === tableHeading.length - 1
                    ? "listing-table-head listing-table-head-last listing-table-head-last-gpu"
                    : "listing-table-head"
                }
              >
                <span
                  className={
                    headID === 3 || headID === 4 || headID === 5
                      ? // Add pointer cursor to clickable headings
                        "clickable"
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
                    windowResizeStage >= 3 &&
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
                  windowResizeStage < 3 &&
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
                ((listing.price_performance_ratio - pprMinValue) /
                  pprDiffValue) *
                  pprNumColors
              );
              // Color of the specific Product Model
              const colorNum: number = modelColor[
                listing.product_category
              ] as number;
              // Benchmark Tier of the specific Product Model
              const tierNum = (
                gpuProductInfo[listing.product_category] as {
                  tier: string;
                }
              )?.tier;
              return (
                <tr key={index}>
                  {windowResizeStage < 2 && (
                    // Only display first column on screens wider than 991 px
                    <td className="gpu-product-text">
                      <strong>{listing.product_name}</strong>
                    </td>
                  )}
                  {listing.product_link !== "" ? (
                    // Create a link to the actual Product Listing
                    <td className="word-break">
                      <strong>
                        <a
                          href={listing.product_link}
                          target="_blank"
                          className="external-link"
                          data-tooltip="Go to product page on store 🡕"
                          data-placement={windowResizeStage >= 2 ? "right" : ""}
                        >
                          {listing.store_name}
                        </a>
                      </strong>
                    </td>
                  ) : (
                    // Don't add link if no link exists
                    <td className="word-break">
                      <strong>
                        <em data-tooltip="No link available">
                          {listing.store_name}
                        </em>
                      </strong>
                    </td>
                  )}
                  <td className="gpu-model-text">
                    <div
                      className={
                        colorCodingEnabled
                          ? // Assign the specific color of the Product Model as a background
                            // if color-coding is enabled
                            `model-background model-gradient-${colorNum}`
                          : "text-centered"
                      }
                    >
                      {/* Shorten the Product Model name for screens smaller than 500 px width */}
                      {windowResizeStage > 2 ? (
                        <strong
                          className="model-tooltip"
                          data-tooltip={listing.product_category}
                        >
                          {/* Shorten the Product Model name */}
                          {listing.product_category
                            .split(" ")
                            .slice(2)
                            .join(" ")}
                        </strong>
                      ) : (
                        <strong>{listing.product_category}</strong>
                      )}
                    </div>
                    {/* Display the Benchmark Value in this column, below the Product Model,
                        for screens smaller than 500px width */}
                    {windowResizeStage > 3 && (
                      // Display the product's Benchmark Value in the color of the Product Model's Benchmark Tier
                      <div className="text-centered benchmark-value-shortened-gpu">
                        <strong
                          className={`text-color-tier-${tierNum}`}
                          data-tooltip={`Tier ${tierNum}`}
                        >
                          {listing.benchmark_value}
                        </strong>
                      </div>
                    )}
                  </td>
                  {/* Display this column only for screens wider than 500 px */}
                  {windowResizeStage <= 3 && (
                    // Display the product's Benchmark Value in the color of the Product Model's Benchmark Tier
                    <td className={`text-color-tier-${tierNum}`}>
                      <strong data-tooltip={`Tier ${tierNum}`}>
                        {listing.benchmark_value}
                      </strong>
                    </td>
                  )}
                  <td className="nowrap price-cell">
                    <strong>{listing.price} kr</strong>
                  </td>
                  <td
                    className={
                      // Assign the Price/Performance Score the specific text color based on how good it is
                      windowResizeStage > 3
                        ? `ppr-color-${pprTextColor} text-centered`
                        : `ppr-color-${pprTextColor}`
                    }
                  >
                    <strong>{listing.price_performance_ratio}</strong>
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
