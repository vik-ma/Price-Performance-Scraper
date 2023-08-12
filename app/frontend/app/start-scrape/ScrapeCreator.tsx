"use client";
import React from "react";
import { useState } from "react";
import { ScrapeType } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";
import { GpuInfoProps, CpuInfoProps } from "@/typings";
import { useRouter } from "next/navigation";
import { useNewScrapeContext } from "../context/NewScrapeContext";
import Link from "next/link";

// POST Request to start Price Scraping in Django application
async function startPriceFetch(data = {}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/start_price_fetch/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}

// Arrow function to convert time in seconds to a string in minutes and seconds
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  if (seconds < 10) {
    return `0${minutes}:0${seconds}`;
  } else {
    return `0${minutes}:${seconds}`;
  }
};

export default function ScrapeCreator(scrapeType: ScrapeType) {
  // scrapeType is the Benchmark Type of the Price Scrape

  const scrapeTypeTitle: string =
    scrapeType.name === "CPU-Gaming"
      ? "CPU (Gaming Performance)"
      : scrapeType.name === "CPU-Normal"
      ? "CPU (Multi-threaded Performance)"
      : "GPU";

  // Arrow function to assign the corresponding ProductInfo section to the respective Benchmark Types
  const getProductInfo = () => {
    if (scrapeType.name === "GPU") {
      // Return gpuInfo if Benchmark Type is GPU
      return gpuInfo as GpuInfoProps;
    } 
    // Return cpuInfo if Benchmark Type is CPU-Gaming or CPU-Normal/Multithreading
    return cpuInfo as CpuInfoProps;
  };

  const productInfo = getProductInfo();

  // Limit of how many products can be added to a Price Scrape
  // GPU = 3, Either CPU = 7
  const productLimit: number = scrapeType.name === "GPU" ? 3 : 7;

  // Set for every different Tier in productInfo
  const tiers: Set<string> = new Set();
  Object.values(productInfo).forEach((product) => {
    // Loop over all values in productInfo
    const tier =
      scrapeType.name === "CPU-Gaming"
        ? product.gamingTier
        : scrapeType.name === "CPU-Normal"
        ? product.normalTier
        : product.tier;
    if (
      // Clause to stop empty CPU-Gaming values from being added
      (scrapeType.name === "CPU-Gaming" && product.gamingTier !== "") ||
      scrapeType.name !== "CPU-Gaming"
    ) {
      // Add unique tier to Set
      tiers.add(tier);
    }
  });

  // Array of tiers Set to map over
  const tiersArray: string[] = Array.from(tiers);
  tiersArray.sort();

  // Set of products the user has selected for Price Scraping
  const [selectedProducts, setSelectedProducts] = useState(new Set<string>([]));

  // Handle function for when user adds a product to selectedProducts
  const handleAddItemClick = (name: string) => {
    if (selectedProducts.size < productLimit) {
      setSelectedProducts((prev) => new Set(prev.add(name)));
    }
  };

  // Handle function for when user removes a product from selectedProducts
  const handleRemoveItemClick = (name: string) => {
    setSelectedProducts((prev) => {
      const newSelectedItems = new Set(prev);
      newSelectedItems.delete(name);
      return newSelectedItems;
    });
  };

  // Handle function to remove all products user has added to selectedProducts
  const handleClickClearItems = () => {
    if (selectedProducts.size > 0) {
      setSelectedProducts(new Set<string>([]));
    }
  };

  // Arrow function to convert the set of selectedProducts to a string to be sent in POST request
  const createScrapePostBody = () => {
    const productList = Array.from(selectedProducts).join(",");

    const data = {
      fetch_type: scrapeType.name,
      product_list: productList,
    };

    return data;
  };

  const router = useRouter();

  // useContext for variables shared between this component and start-scrape/page.tsx
  const {
    loadingScrape,
    setLoadingScrape,
    errorMsg,
    setErrorMsg,
    showErrorMsg,
    setShowErrorMsg,
    isScrapeAllowed,
    setIsScrapeAllowed,
    scrapeAllowedTimer,
    setScrapeAllowedTimer,
  } = useNewScrapeContext();

  // Handle function for starting a Price Scrape
  const handleClickStartPriceFetch = async () => {
    if (selectedProducts.size > 0) {
      // Create POST body
      const data = createScrapePostBody();

      // Clear any error messages
      setShowErrorMsg(false);
      setErrorMsg("");

      // State that shows a loading bar instead of Start Price Scrape button
      setLoadingScrape(true);

      try {
        const response = await startPriceFetch(data);

        // Remove loading bar
        setLoadingScrape(false);

        if (response.hasOwnProperty("success")) {
          // If API call has any response
          if (response.success) {
            // Send user to the page of the result if Price Scrape was successful
            router.push(`/scrapes/${response.message}`);
          } else if (response.hasOwnProperty("seconds_left")) {
            // Show cooldown until scrape is allowed if Price Scraping was rejected due to a cooldown
            setIsScrapeAllowed(false);
            setScrapeAllowedTimer(response.seconds_left);
          } else {
            // Show error message if POST request was successful but the actual Price Scraping in Django app ran into an error
            setErrorMsg(`An error occurred during price scraping.`);
            setShowErrorMsg(true);
          }
        } else {
          // Show error message if POST request body was faulty
          setErrorMsg(`An error occurred when communicating with the API.`);
          setShowErrorMsg(true);
        }
      } catch {
        // Show error message if API call has no response
        setLoadingScrape(false);
        setErrorMsg(`Failed to communicate with server.`);
        setShowErrorMsg(true);
      }
    } else {
      // Show error message if no products were selected when pressing button
      setErrorMsg("No product(s) selected");
      setShowErrorMsg(true);
    }
  };

  // Arrays for different filters
  const manufacturers: string[] = [];
  const generations: string[] = [];
  const sockets: string[] = [];

  // Populate every filter with each unique value for specific key in productInfo
  Object.values(productInfo).forEach((product) => {
    if (!manufacturers.includes(product.manufacturer)) {
      manufacturers.push(product.manufacturer);
    }
    if (!sockets.includes(product.socket)) {
      sockets.push(product.socket);
    }
    if (!generations.includes(product.generation)) {
      generations.push(product.generation);
    }
  });

  // useStates for every different filter
  const [selectedManufacturers, setSelectedManufacturers] =
    useState<string[]>(manufacturers);

  const [selectedSockets, setSelectedSockets] = useState<string[]>(sockets);

  const [selectedGenerations, setSelectedGenerations] =
    useState<string[]>(generations);

  // List of products for selection excluding the ones selected in filter(s)
  const filteredProductInfo = Object.fromEntries(
    Object.entries(productInfo).filter(([key, product]) => {
      return (
        selectedManufacturers.includes(product.manufacturer) &&
        selectedSockets.includes(product.socket) &&
        selectedGenerations.includes(product.generation)
      );
    })
  );

  // Handle function for when user checks or unchecks a checkbox for a filter
  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterKey: string,
    filterValue: string
  ) => {
    const isChecked = event.target.checked;
    if (filterKey === "manufacturer") {
      setSelectedManufacturers((prev) =>
        changeFilter(isChecked, prev, filterValue)
      );
    } else if (filterKey === "socket") {
      setSelectedSockets((prev) => changeFilter(isChecked, prev, filterValue));
    } else if (filterKey === "generation") {
      setSelectedGenerations((prev) =>
        changeFilter(isChecked, prev, filterValue)
      );
    }
  };

  // Arrow function to add or remove selected filter value
  const changeFilter = (
    isChecked: boolean,
    prev: string[],
    filterValue: string
  ) => {
    if (isChecked) {
      return [...prev, filterValue];
    } else {
      return prev.filter((name) => name !== filterValue);
    }
  };

  // Total number of available product to select
  const totalNumProducts: number = Object.keys(productInfo).length;

  // Number of available products to select after filter has been applied
  const filteredNumProducts: number = Object.keys(filteredProductInfo).length;

  // Handle function for when Toggle All button in Filter section is pressed
  const handleToggleAllClick = () => {
    if (filteredNumProducts < totalNumProducts) {
      // Filter all products if any filters are active
      setSelectedManufacturers(manufacturers);
      setSelectedSockets(sockets);
      setSelectedGenerations(generations);
    } else {
      // Remove all filters if all products are filtered
      setSelectedManufacturers([]);
      setSelectedSockets([]);
      setSelectedGenerations([]);
    }
  };

  return (
    <>
      <div className="selected-products-border">
        <div className="selected-products-container">
          <h2 className="selected-products-heading">
            Selected Products{" "}
            {/* Show number of selected products and the maximum allowed number of products to be selected.
                Display these numbers as red if the number of selected products is at limit. */}
            <span
              className={
                selectedProducts.size === productLimit ? "red-text" : ""
              }
            >
              ({selectedProducts.size}/{productLimit})
            </span>
          </h2>
          <button
            className="dark-button clear-items-button"
            onClick={handleClickClearItems}
          >
            <strong>Clear All</strong>
          </button>
          <p className="selected-products-type">
            <strong>{scrapeTypeTitle}</strong>
          </p>
          {/* Show hint to remove selected product only if an item has already been added */}
          {selectedProducts.size > 0 && (
            <p className="remove-product-hint">
              <em>Click on product to remove from list</em>
            </p>
          )}
          <ul className="selected-products-list no-dot-list">
            {/* Show all selected products */}
            {Array.from(selectedProducts).map((name) => {
              const productTier =
                scrapeType.name === "CPU-Gaming"
                  ? (productInfo[name] as { gamingTier: string })?.gamingTier
                  : scrapeType.name === "CPU-Normal"
                  ? (productInfo[name] as { normalTier: string })?.normalTier
                  : (productInfo[name] as { tier: string })?.tier;
              return (
                <li
                  className="selected-products-list-item no-dot-list-item"
                  key={name}
                >
                  <button
                    className={`background-color-tier-${productTier} product-selection`}
                    onClick={() => handleRemoveItemClick(name)}
                  >
                    <strong>{name}</strong>
                  </button>
                </li>
              );
            })}
          </ul>
          {/* Show message of when Price Scraping will be allowed again if there is a cooldown */}
          {!isScrapeAllowed ? (
            <div className="error-msg-container cooldown-container">
              <h3 className="error-msg-heading cooldown-heading">
                A scrape was recently started
                <br />
                Cooldown ends in {formatTime(scrapeAllowedTimer)}
              </h3>
            </div>
          ) : (
            <div className="start-price-button-container">
              {/* Show a loading bar if Price Scraping is ongoing */}
              {loadingScrape ? (
                <div className="horizontally-centered-container">
                  <progress></progress>

                  <h2>Scraping prices...</h2>

                  <p>This process can take up to 30 seconds.</p>
                </div>
              ) : (
                // Show Start Price Scrape button if price scraping is allowed and not ongoing
                <button
                  className="start-button"
                  onClick={handleClickStartPriceFetch}
                >
                  <strong>Start Price Scrape</strong>
                </button>
              )}
              {/* Show any error messages related to Price Scraping */}
              {showErrorMsg && (
                <div className="horizontally-centered-container error-msg-container">
                  <h2 className="error-msg-heading">{errorMsg}</h2>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <details>
        <summary className="filter-button filter-button-products" role="button">
          <strong>
            {/* Show number of filtered out products if any products has been filtered */}
            Filter Products{" "}
            {filteredNumProducts < totalNumProducts &&
              `(Showing ${filteredNumProducts} out of ${totalNumProducts} products)`}
          </strong>
        </summary>
        <div className="filter-products-container">
          <div className="product-filter-item">
            <h4 className="product-filter-heading">Manufacturer</h4>
            {/* Create checkboxes for all different manufacturers */}
            {manufacturers.map((manufacturer, index) => (
              <label className="product-filter-label" key={index}>
                <input
                  type="checkbox"
                  checked={selectedManufacturers.includes(manufacturer)}
                  onChange={(event) =>
                    handleFilterChange(event, "manufacturer", manufacturer)
                  }
                />
                {manufacturer}
              </label>
            ))}
            {scrapeType.name !== "GPU" && (
              <button
                className="dark-button toggle-all-filters-button"
                onClick={handleToggleAllClick}
              >
                <strong>Toggle All</strong>
              </button>
            )}
          </div>
          {/* Create checkboxes for all different sockets for CPU products */}
          {scrapeType.name !== "GPU" && (
            <div className="product-filter-item">
              <h4 className="product-filter-heading">Socket</h4>
              {sockets.map((sockets, index) => (
                <label className="product-filter-label" key={index}>
                  <input
                    type="checkbox"
                    checked={selectedSockets.includes(sockets)}
                    onChange={(event) =>
                      handleFilterChange(event, "socket", sockets)
                    }
                  />
                  {sockets}
                </label>
              ))}
            </div>
          )}
          {/* Create checkboxes for all different generations for CPU products */}
          {scrapeType.name !== "GPU" && (
            <div className="product-filter-item">
              <h4 className="product-filter-heading">Generation</h4>
              {generations.map((generations, index) => (
                <label className="product-filter-label" key={index}>
                  <input
                    type="checkbox"
                    checked={selectedGenerations.includes(generations)}
                    onChange={(event) =>
                      handleFilterChange(event, "generation", generations)
                    }
                  />
                  {generations}
                </label>
              ))}
            </div>
          )}
        </div>
      </details>
      <h6 className="product-add-hint">
        <em className="bold-white-text">
          Click on a product below to add to the list of products to be scraped
        </em>
      </h6>
      <div className="tiers-container">
        {/* Show every available product under their corresponding Benchmark Tier */}
        {tiersArray.map((tier) => (
          <div className="tiers-item" key={tier}>
            <h3 className={`tiers-title text-color-tier-${tier}`}>
              Tier {tier}
            </h3>
            <ul className="no-dot-list">
              {/* Show only the products which has passed the filters */}
              {Object.entries(filteredProductInfo)
                .filter(
                  ([name, product]) =>
                    (scrapeType.name === "CPU-Gaming"
                      ? product.gamingTier === tier
                      : scrapeType.name === "CPU-Normal"
                      ? product.normalTier === tier
                      : product.tier === tier) && !selectedProducts.has(name)
                )
                .map(([name, product]) => (
                  <li className="tiers-list-item no-dot-list-item" key={name}>
                    <button
                      className={`background-color-tier-${tier} product-selection`}
                      disabled={selectedProducts.size === productLimit}
                      onClick={() => handleAddItemClick(name)}
                    >
                      <strong>{name}</strong>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="benchmarks-hint">
        <em>
          <strong className="bold-white-text">
            Tiers are derived from the different models' average benchmark
            score.
            <br />
            See more detailed benchmark scores at{" "}
            <Link
              className="internal-link-color"
              href="/benchmarks"
              target="_blank"
            >
              Current Benchmarks
            </Link>
          </strong>
        </em>
      </p>
    </>
  );
}
