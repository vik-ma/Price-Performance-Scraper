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
  return (
    <>
      <h2>{scrapeTypeTitle}</h2>
      <div className="tiers-container">
        {Array.from(tiers).map((tier) => (
          <div key={tier}>
            <h3 className="tiers-title">Tier {tier}</h3>
            <ul>
              {Object.entries(gpuInfo)
                .filter(([name, gpu]) => gpu.tier === tier)
                .map(([name, gpu]) => (
                  <li key={name}><strong>{name}</strong></li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
