"use client";
import React from "react";
import { useState } from "react";
import { BenchmarksDataProps, GpuInfoProps, CpuInfoProps } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";
import GPUIcon from "../icons/GPUIcon";
import CPUGIcon from "../icons/CPUGIcon";
import CPUNIcon from "../icons/CPUNIcon";

interface TimestampMap {
  [key: string]: string;
}

export default function BenchmarkTable({ benchmarks }: BenchmarksDataProps) {
  // Tabs for different Benchmark Types (1 = GPU, 2 = CPU-Gaming, 3 = CPU-Normal/Multithread)
  const [tabIndex, setTabIndex] = useState(1);

  // Arrow function to change Benchmark Type tab and clear any existing error message
  const toggleTab = (index: number) => {
    setTabIndex(index);
  };

  // Information of Benchmark Tier for every product
  const gpuProductInfo: GpuInfoProps = gpuInfo;
  const cpuProductInfo: CpuInfoProps = cpuInfo;

  // Setting to display different Benchmark Tiers in different colors
  const [colorCodingEnabled, setColorCodingEnabled] = useState<boolean>(true);

  // HashMap for every Benchmark Type's timestamp value
  const timestampMap: TimestampMap = {
    gpu: benchmarks["GPU"].timestamp as unknown as string,
    cpuG: benchmarks["CPU-Gaming"].timestamp as unknown as string,
    cpuN: benchmarks["CPU-Normal"].timestamp as unknown as string,
  };

  return (
    <div className="benchmark-wrapper">
      <div className="benchmark-table-container">
        {/* Tabs to select Benchmark Type */}
        <div className="benchmark-table-tabs-container">
          <div
            className={
              tabIndex === 1
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(1)}
          >
            <span className="benchmark-header-icon">
              <GPUIcon />
            </span>
            GPU
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(2)}
          >
            <span className="benchmark-header-icon">
              <CPUGIcon />
            </span>
            CPU (Gaming)
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(3)}
          >
            <span className="benchmark-header-icon">
              <CPUNIcon />
            </span>
            <span className="benchmark-table-tab-cpu-n">CPU (Multi-threading)</span>
            
          </div>
        </div>
        <div className="color-toggle-container benchmark-color-toggle-container">
          <label className="color-toggle-label-benchmarks">
            <input
              type="checkbox"
              checked={colorCodingEnabled}
              onChange={() => setColorCodingEnabled(!colorCodingEnabled)}
            />
            Enable color coding for different benchmark tiers
          </label>
        </div>
        <div className="benchmark-table-content-tabs">
          <div
            className={
              tabIndex === 1
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>GPU Benchmarks</h2>
            <table className="benchmark-table" role="grid">
              <thead>
                <tr>
                  <th className="benchmark-table-head listing-table-head listing-table-head-first">
                    <strong>Model</strong>
                  </th>
                  <th className="benchmark-table-head listing-table-head">
                    <strong>Benchmark Score</strong>
                  </th>
                  <th className="benchmark-table-head listing-table-head listing-table-head-last">
                    <strong>Tier</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Populate table with every product and their Benchmark Value */}
                {Object.entries(benchmarks["GPU"])
                  .filter(([key]) => key !== "timestamp")
                  .map(([key, value]) => {
                    const tier = (gpuProductInfo[key] as { tier: string })
                      ?.tier;
                    return (
                      <tr key={key}>
                        {/* Display every product and their values in specific color of their Benchmark Tier. 
                            Show all entries in the same color if color coding is disabled */}
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data`
                              : "benchmark-table-data"
                          }
                        >
                          {key}
                        </td>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data`
                              : "benchmark-table-data"
                          }
                        >
                          {value.toString()}
                        </td>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data no-wrap-constant`
                              : "benchmark-table-data no-wrap-constant"
                          }
                        >
                          Tier {tier}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <p className="benchmark-timestamp">
              <em>
                Benchmarks updated at{" "}
                <strong className="bold-white-text">{timestampMap.gpu}</strong>
              </em>
            </p>
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>CPU Benchmarks (Gaming Performance)</h2>
            <table className="benchmark-table" role="grid">
              <thead>
                <tr>
                  <th className="benchmark-table-head listing-table-head listing-table-head-first">
                    <strong>Model</strong>
                  </th>
                  <th className="benchmark-table-head listing-table-head">
                    <strong>Benchmark Score</strong>
                  </th>
                  <th className="benchmark-table-head listing-table-head listing-table-head-last">
                    <strong>Tier</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(benchmarks["CPU-Gaming"])
                  .filter(([key]) => key !== "timestamp")
                  .map(([key, value]) => {
                    const tier = (cpuProductInfo[key] as { gamingTier: string })
                      ?.gamingTier;
                    return (
                      <tr key={key}>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data`
                              : "benchmark-table-data"
                          }
                        >
                          {key}
                        </td>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data`
                              : "benchmark-table-data"
                          }
                        >
                          {value.toString()}
                        </td>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data no-wrap-constant`
                              : "benchmark-table-data no-wrap-constant"
                          }
                        >
                          Tier {tier}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <p className="benchmark-timestamp">
              <em>
                Benchmarks updated at{" "}
                <strong className="bold-white-text">{timestampMap.cpuG}</strong>
              </em>
            </p>
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>CPU Benchmarks (Multi-threaded Performance)</h2>
            <table className="benchmark-table" role="grid">
              <thead>
                <tr>
                  <th className="benchmark-table-head listing-table-head listing-table-head-first">
                    <strong>Model</strong>
                  </th>
                  <th className="benchmark-table-head listing-table-head listing-table-head">
                    <strong>Benchmark Score</strong>
                  </th>
                  <th className="benchmark-table-head listing-table-head listing-table-head-last">
                    <strong>Tier</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(benchmarks["CPU-Normal"])
                  .filter(([key]) => key !== "timestamp")
                  .map(([key, value]) => {
                    const tier = (cpuProductInfo[key] as { normalTier: string })
                      ?.normalTier;
                    return (
                      <tr key={key}>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data`
                              : "benchmark-table-data"
                          }
                        >
                          {key}
                        </td>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data`
                              : "benchmark-table-data"
                          }
                        >
                          {value.toString()}
                        </td>
                        <td
                          className={
                            colorCodingEnabled
                              ? `text-color-tier-${tier} benchmark-table-data no-wrap-constant`
                              : "benchmark-table-data no-wrap-constant"
                          }
                        >
                          Tier {tier}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <p className="benchmark-timestamp">
              <em>
                Benchmarks updated at{" "}
                <strong className="bold-white-text">{timestampMap.cpuN}</strong>
              </em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
