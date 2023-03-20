"use client";
import React from "react";
import { useState } from "react";
import { ScrapeType } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";
import { GpuInfoProps, CpuInfoProps } from "@/typings";

export default function ScrapeCreator(scrapeType: ScrapeType) {
  const scrapeTypeTitle: string =
    scrapeType.name === "CPU-Gaming"
      ? "CPU (Gaming Performance)"
      : scrapeType.name === "CPU-Normal"
      ? "CPU (Multi-threaded Performance)"
      : "GPU";

  const tiers = new Set(Object.values(gpuInfo).map((gpu) => gpu.tier));

  const [selectedItems, setSelectedItems] = useState(new Set<string>([]));

  const handleAddItemClick = (name: string) => {
    setSelectedItems((prev) => new Set(prev.add(name)));
  };

  const handleRemoveItemClick = (name: string) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      newSelectedItems.delete(name);
      return newSelectedItems;
    });
  };

  const gpuProductInfo: GpuInfoProps = gpuInfo;
  return (
    <>
      <h2>{scrapeTypeTitle}</h2>
      <h2>Selected Items</h2>
      <div className="tiers-container">
        {Array.from(tiers).map((tier) => (
          <div className="tiers-item" key={tier}>
            <h3 className={`tiers-title text-color-tier-${tier}`}>
              Tier {tier}
            </h3>
            <ul>
              {Object.entries(gpuInfo)
                .filter(
                  ([name, gpu]) => gpu.tier === tier && !selectedItems.has(name)
                )
                .map(([name, gpu]) => (
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
        <div className="tiers-item">
          <h2>Selected Items</h2>
          <ul>
            {Array.from(selectedItems).map((name) => {
              const tier = (gpuProductInfo[name] as { tier: string })?.tier;
              return (
                <li key={name}>
                  <button
                    className={`background-color-tier-${tier}`}
                    onClick={() => handleRemoveItemClick(name)}
                  >
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
