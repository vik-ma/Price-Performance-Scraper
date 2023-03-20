"use client";
import React from "react";
import { useState } from "react";
import { ScrapeType } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";

export default function ScrapeCreator(scrapeType: ScrapeType) {
  const scrapeTypeTitle: string =
    scrapeType.name === "CPU-Gaming"
      ? "CPU (Gaming Performance)"
      : scrapeType.name === "CPU-Normal"
      ? "CPU (Multi-threaded Performance)"
      : "GPU";

  const tiers = new Set(Object.values(gpuInfo).map((gpu) => gpu.tier));

  const [selectedItems, setSelectedItems] = useState(new Set<string>([]));

  const handleItemClick = (name: string) => {
    setSelectedItems(
      (prevSelectedItems) => new Set(prevSelectedItems.add(name))
    );
  };



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
                .filter(([name, gpu]) => gpu.tier === tier && !selectedItems.has(name))
                .map(([name, gpu]) => (
                  <li key={name}>
                    <button onClick={() => handleItemClick(name)}>
                      {name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <h2>Selected Items</h2>
        <ul>
          {[...selectedItems].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
