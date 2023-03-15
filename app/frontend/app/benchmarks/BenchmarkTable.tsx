"use client";
import React from "react";
import { useState } from "react";
import { BenchmarksDataProps, GpuInfo } from "@/typings";
import { gpuInfo, cpuInfo } from "../ProductInfo";

export default function BenchmarkTable({ benchmarks }: BenchmarksDataProps) {
  const [tabIndex, setTabIndex] = useState(1);

  const toggleTab = (index: number) => {
    setTabIndex(index);

  };

  const gpuProductInfo: GpuInfo = gpuInfo;
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
                  <th><strong>Model</strong></th>
                  <th><strong>Benchmark Score</strong></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(benchmarks["GPU"]).map(([key, value]) => {
                  const gpuTier = (gpuProductInfo[key] as { tier: string })?.tier;
                  return (
                  <tr key={key}>
                    <td><strong>{key}</strong></td>
                    <td className={`text-color-tier-${gpuTier}`}><strong>{value.toString()}</strong></td>
                  </tr>);
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
                  <th>
                    <strong>Model</strong>
                  </th>
                  <th>
                    <strong>Benchmark Score</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(benchmarks["CPU-Gaming"]).map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value.toString()}</td>
                    </tr>
                  )
                )}
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
                  <th>
                    <strong>Model</strong>
                  </th>
                  <th>
                    <strong>Benchmark Score</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(benchmarks["CPU-Normal"]).map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value.toString()}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
