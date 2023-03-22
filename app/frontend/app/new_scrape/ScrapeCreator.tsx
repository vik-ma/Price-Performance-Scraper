"use client";
import React from "react";
import { useState } from "react";
import { ScrapeType } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";
import { GpuInfoProps, CpuInfoProps } from "@/typings";
import { useRouter } from "next/navigation";

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
    }
    return cpuInfo as CpuInfoProps;
  };

  // const gpuProductInfo: GpuInfoProps = gpuInfo;
  // const cpuProductInfo: CpuInfoProps = cpuInfo;

  const productInfo = getProductInfo();

  const productLimit: number = scrapeType.name === "GPU" ? 5 : 10;

  // const getTiers = () => {
  //   if (scrapeType.name === "CPU-Gaming") {
  //     return new Set(Object.values(productInfo).map((product) => product.tier));
  //   }
  // };

  // const tiers = new Set(Object.values(gpuInfo).map((gpu) => gpu.tier));

  // const tiers = new Set(
  //   Object.values(productInfo).map((product) =>
  //   (product.gamingTier !== "") &&
  //   (
  //     scrapeType.name === "CPU-Gaming"
  //       ? product.gamingTier
  //       : scrapeType.name === "CPU-Normal"
  //       ? product.normalTier
  //       : product.tier
  //   ))
  // );

  const tiers: Set<string> = new Set();
  Object.values(productInfo).forEach((product) => {
    if (product.gamingTier !== "") {
      const tier =
        scrapeType.name === "CPU-Gaming"
          ? product.gamingTier
          : scrapeType.name === "CPU-Normal"
          ? product.normalTier
          : product.tier;
      tiers.add(tier);
    }
  });

  const tiersArray: string[] = Array.from(tiers);
  tiersArray.sort();

  const sortedTiers: Set<string> = new Set(tiersArray);

  const [selectedItems, setSelectedItems] = useState(new Set<string>([]));

  const handleAddItemClick = (name: string) => {
    if (selectedItems.size < productLimit) {
      setSelectedItems((prev) => new Set(prev.add(name)));
    }
  };

  const handleRemoveItemClick = (name: string) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      newSelectedItems.delete(name);
      return newSelectedItems;
    });
  };

  const handleClickClearItems = () => {
    if (selectedItems.size > 0) {
      setSelectedItems(new Set<string>([]));
    }
  };

  const createScrapePostBody = () => {
    if (selectedItems.size > 0) {
      const productList = Array.from(selectedItems).join(",");

      const data = {
        fetch_type: scrapeType.name,
        product_list: productList,
      };

      return data;
    }
  };

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);

  const handleClickStartPriceFetch = async () => {
    const data = createScrapePostBody();

    setShowErrorMsg(false);
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await startPriceFetch(data);

      setLoading(false);

      if (response.hasOwnProperty("success")) {
        if (response.success) {
          router.push(`/fetches/${response.message}`);
        } else {
          setErrorMsg(`An error occured during price scraping.`);
          setShowErrorMsg(true);
        }
      } else {
        setErrorMsg(`An error occured when communicating with the API.`);
        setShowErrorMsg(true);
      }
    } catch {
      setLoading(false);
      setErrorMsg(`Failed to communicate with server.`);
      setShowErrorMsg(true);
    }
  };

  return (
    <>
      <h2>{scrapeTypeTitle}</h2>
      {loading ? (
        <div className="horizontally-centered-container ">
          <progress></progress>

          <h2>Scraping prices...</h2>

          <p>This process will take a few seconds.</p>
        </div>
      ) : (
        <button onClick={handleClickStartPriceFetch}>Start Price Scrape</button>
      )}
      {showErrorMsg && (
        <div className="horizontally-centered-container ">
          <h2>{errorMsg}</h2>
        </div>
      )}

      <div className="selected-items-container">
        <h2 className="selected-items-heading">
          Selected Items ({selectedItems.size}/{productLimit})
        </h2>
        <button className="clear-items-button" onClick={handleClickClearItems}>
          <strong>Clear All</strong>
        </button>
        <ul>
          {Array.from(selectedItems).map((name) => {
            const productTier =
              scrapeType.name === "CPU-Gaming"
                ? (productInfo[name] as { gamingTier: string })?.gamingTier
                : scrapeType.name === "CPU-Normal"
                ? (productInfo[name] as { normalTier: string })?.normalTier
                : (productInfo[name] as { tier: string })?.tier;
            return (
              <li key={name}>
                <button
                  className={`background-color-tier-${productTier}`}
                  onClick={() => handleRemoveItemClick(name)}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="tiers-container">
        {tiersArray.map((tier) => (
          <div className="tiers-item" key={tier}>
            <h3 className={`tiers-title text-color-tier-${tier}`}>
              Tier {tier}
            </h3>
            <ul>
              {Object.entries(productInfo)
                .filter(
                  ([name, product]) =>
                    (scrapeType.name === "CPU-Gaming"
                      ? product.gamingTier === tier
                      : scrapeType.name === "CPU-Normal"
                      ? product.normalTier === tier
                      : product.tier === tier) && !selectedItems.has(name)
                )
                .map(([name, product]) => (
                  <li key={name}>
                    <button
                      className={`background-color-tier-${tier}`}
                      onClick={() => handleAddItemClick(name)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
