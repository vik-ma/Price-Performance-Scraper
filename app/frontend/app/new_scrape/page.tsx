"use client";
import React from "react";
import { useState } from "react";
import ScrapeCreator from "./ScrapeCreator";
import { useNewScrapeContext } from "../context/NewScrapeContext";

export default function NewScrape() {
  const { loadingScrape, setErrorMsg, setShowErrorMsg } = useNewScrapeContext();

  const [tabIndex, setTabIndex] = useState(1);

  const toggleTab = (index: number) => {
    if (!loadingScrape) {
      setTabIndex(index);
      setErrorMsg("");
      setShowErrorMsg(false);
    }
  };

  return (
    <>
      <h1 className="page-title">NEW</h1>
      <details>
        <summary className="scrape-tutorial-button" role="button">
          <strong>Show Tutorial</strong>
        </summary>
        <p>ASDASDASDSADDSA</p>
      </details>
      <h2>Choose Benchmark Type</h2>
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
            <ScrapeCreator name={"GPU"} />
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <ScrapeCreator name={"CPU-Gaming"} />
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <ScrapeCreator name={"CPU-Normal"} />
          </div>
        </div>
      </div>
    </>
  );
}
