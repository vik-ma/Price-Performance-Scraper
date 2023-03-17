"use client";
import React from "react";
import { useState } from "react";
import { BenchmarksDataProps, GpuInfoProps, CpuInfoProps } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";

export default function BenchmarkTable({ benchmarks }: BenchmarksDataProps) {
  const [tabIndex, setTabIndex] = useState(1);

  const toggleTab = (index: number) => {
    setTabIndex(index);
  };

  const gpuProductInfo: GpuInfoProps = gpuInfo;
  const cpuProductInfo: CpuInfoProps = cpuInfo;
  return (
    <>
      <div className="benchmark-table-container">
        <div className="benchmark-table-tabs-container">
          <div
            className={
              tabIndex === 1
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(1)}
          >
            <strong>GPU</strong>
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(2)}
          >
            <strong>CPU (Gaming)</strong>
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(3)}
          >
            <strong>CPU (Multi-threading)</strong>
          </div>
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
            <table role="grid">
              <thead>
                <tr>
                  <th className="tableHead">
                    <strong>Model</strong>
                  </th>
                  <th className="tableHead">
                    <strong>Benchmark Score</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(benchmarks["GPU"]).map(([key, value]) => {
                  const gpuTier = (gpuProductInfo[key] as { tier: string })
                    ?.tier;
                  const cssName: string = (
                      gpuProductInfo[key] as { cssName: string }
                    )?.cssName;
                  return (
                    <tr key={key}>
                      <td>
                        <strong><div className={`model-background ${cssName}`}>{key}</div></strong>
                      </td>
                      <td className={`text-color-tier-${gpuTier}`}>
                        <strong>{value.toString()}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>CPU Benchmarks (Gaming Performance)</h2>
            <table role="grid">
              <thead>
                <tr>
                  <th className="tableHead">
                    <strong>Model</strong>
                  </th>
                  <th className="tableHead">
                    <strong>Benchmark Score</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
              {Object.entries(benchmarks["CPU-Gaming"]).map(([key, value]) => {
                  const cpuGamingTier = (cpuProductInfo[key] as { gamingTier: string })
                    ?.gamingTier;
                  return (
                    <tr key={key}>
                      <td>
                        <strong>{key}</strong>
                      </td>
                      <td className={`text-color-tier-${cpuGamingTier}`}>
                        <strong>{value.toString()}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>CPU Benchmarks (Multi-threaded Performance)</h2>
            <table role="grid">
              <thead>
                <tr>
                  <th className="tableHead">
                    <strong>Model</strong>
                  </th>
                  <th className="tableHead">
                    <strong>Benchmark Score</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
              {Object.entries(benchmarks["CPU-Normal"]).map(([key, value]) => {
                  const cpuNormalTier = (cpuProductInfo[key] as { normalTier: string })
                    ?.normalTier;
                  return (
                    <tr key={key}>
                      <td>
                        <strong>{key}</strong>
                      </td>
                      <td className={`text-color-tier-${cpuNormalTier}`}>
                        <strong>{value.toString()}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
