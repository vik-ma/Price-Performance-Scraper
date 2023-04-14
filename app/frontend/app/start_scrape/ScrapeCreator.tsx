"use client";
import React from "react";
import { useState } from "react";
import { ScrapeType } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";
import { GpuInfoProps, CpuInfoProps } from "@/typings";
import { useRouter } from "next/navigation";
import { useNewScrapeContext } from "../context/NewScrapeContext";
import Link from "next/link";

async function startPriceFetch(data = {}) {
  const response = await fetch(`http://localhost:8000/api/start_price_fetch/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

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
  const scrapeTypeTitle: string =
    scrapeType.name === "CPU-Gaming"
      ? "CPU (Gaming Performance)"
      : scrapeType.name === "CPU-Normal"
      ? "CPU (Multi-threaded Performance)"
      : "GPU";

  const getProductInfo = () => {
    if (scrapeType.name === "GPU") {
      return gpuInfo as GpuInfoProps;
    } else if (scrapeType.name === "CPU-Gaming") {
      const cpuInfoGaming = { ...cpuInfo };
      delete cpuInfoGaming["Intel Core i9-13900" as keyof typeof cpuInfoGaming];
      return cpuInfoGaming as CpuInfoProps;
    }
    return cpuInfo as CpuInfoProps;
  };

  const productInfo = getProductInfo();

  const productLimit: number = scrapeType.name === "GPU" ? 5 : 10;

  const tiers: Set<string> = new Set();
  Object.values(productInfo).forEach((product) => {
    const tier =
      scrapeType.name === "CPU-Gaming"
        ? product.gamingTier
        : scrapeType.name === "CPU-Normal"
        ? product.normalTier
        : product.tier;
    if (
      (scrapeType.name === "CPU-Gaming" && product.gamingTier !== "") ||
      scrapeType.name !== "CPU-Gaming"
    ) {
      tiers.add(tier);
    }
  });

  const tiersArray: string[] = Array.from(tiers);
  tiersArray.sort();

  const [selectedProducts, setSelectedProducts] = useState(new Set<string>([]));

  const handleAddItemClick = (name: string) => {
    if (selectedProducts.size < productLimit) {
      setSelectedProducts((prev) => new Set(prev.add(name)));
    }
  };

  const handleRemoveItemClick = (name: string) => {
    setSelectedProducts((prev) => {
      const newSelectedItems = new Set(prev);
      newSelectedItems.delete(name);
      return newSelectedItems;
    });
  };

  const handleClickClearItems = () => {
    if (selectedProducts.size > 0) {
      setSelectedProducts(new Set<string>([]));
    }
  };

  const createScrapePostBody = () => {
    const productList = Array.from(selectedProducts).join(",");

    const data = {
      fetch_type: scrapeType.name,
      product_list: productList,
    };

    return data;
  };

  const router = useRouter();

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

  const handleClickStartPriceFetch = async () => {
    if (selectedProducts.size > 0) {
      const data = createScrapePostBody();

      setShowErrorMsg(false);
      setErrorMsg("");
      setLoadingScrape(true);
      try {
        const response = await startPriceFetch(data);

        setLoadingScrape(false);

        if (response.hasOwnProperty("success")) {
          if (response.success) {
            router.push(`/scrapes/${response.message}`);
          } else if (response.hasOwnProperty("seconds_left")) {
            setIsScrapeAllowed(false);
            setScrapeAllowedTimer(response.seconds_left);
          } else {
            setErrorMsg(`An error occurred during price scraping.`);
            setShowErrorMsg(true);
          }
        } else {
          setErrorMsg(`An error occurred when communicating with the API.`);
          setShowErrorMsg(true);
        }
      } catch {
        setLoadingScrape(false);
        setErrorMsg(`Failed to communicate with server.`);
        setShowErrorMsg(true);
      }
    } else {
      setErrorMsg("No product(s) selected");
      setShowErrorMsg(true);
    }
  };

  const manufacturers: string[] = [];
  const generations: string[] = [];
  const sockets: string[] = [];

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

  const [selectedManufacturers, setSelectedManufacturers] =
    useState<string[]>(manufacturers);

  const [selectedSockets, setSelectedSockets] = useState<string[]>(sockets);

  const [selectedGenerations, setSelectedGenerations] =
    useState<string[]>(generations);

  const filteredProductInfo = Object.fromEntries(
    Object.entries(productInfo).filter(([key, product]) => {
      return (
        selectedManufacturers.includes(product.manufacturer) &&
        selectedSockets.includes(product.socket) &&
        selectedGenerations.includes(product.generation)
      );
    })
  );

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

  const totalNumProducts: number = Object.keys(productInfo).length;

  const filteredNumProducts: number = Object.keys(filteredProductInfo).length;

  const handleToggleAllClick = () => {
    if (filteredNumProducts < totalNumProducts) {
      setSelectedManufacturers(manufacturers);
      setSelectedSockets(sockets);
      setSelectedGenerations(generations);
    } else {
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
          {selectedProducts.size > 0 && (
            <p className="hint-text">
              <em>Click on product to remove from list</em>
            </p>
          )}
          <ul className="selected-products-list">
            {Array.from(selectedProducts).map((name) => {
              const productTier =
                scrapeType.name === "CPU-Gaming"
                  ? (productInfo[name] as { gamingTier: string })?.gamingTier
                  : scrapeType.name === "CPU-Normal"
                  ? (productInfo[name] as { normalTier: string })?.normalTier
                  : (productInfo[name] as { tier: string })?.tier;
              return (
                <li className="selected-products-list-item" key={name}>
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
              {loadingScrape ? (
                <div className="horizontally-centered-container">
                  <progress></progress>

                  <h2>Scraping prices...</h2>

                  <p>This process will take a few seconds.</p>
                </div>
              ) : (
                <button
                  className="start-button"
                  onClick={handleClickStartPriceFetch}
                >
                  <strong>Start Price Scrape</strong>
                </button>
              )}
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
            Filter Products{" "}
            {filteredNumProducts < totalNumProducts &&
              `(Showing ${filteredNumProducts} out of ${totalNumProducts} products)`}
          </strong>
        </summary>
        <div className="filter-products-container">
          <div className="product-filter-item">
            <h4 className="product-filter-heading">Manufacturer</h4>
            {manufacturers.map((manufacturer, index) => (
              <label key={index}>
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
          {scrapeType.name !== "GPU" && (
            <div className="product-filter-item">
              <h4 className="product-filter-heading">Socket</h4>
              {sockets.map((sockets, index) => (
                <label key={index}>
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
          {scrapeType.name !== "GPU" && (
            <div className="product-filter-item">
              <h4 className="product-filter-heading">Generation</h4>
              {generations.map((generations, index) => (
                <label key={index}>
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
        <em>
          Click on a product below to add to the list of products to be scraped
        </em>
      </h6>
      <div className="tiers-container">
        {tiersArray.map((tier) => (
          <div className="tiers-item" key={tier}>
            <h3 className={`tiers-title text-color-tier-${tier}`}>
              Tier {tier}
            </h3>
            <ul>
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
                  <li className="tiers-list-item" key={name}>
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
          <strong>
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
