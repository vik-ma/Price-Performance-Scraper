"use client";
import React from "react";
import { useState } from "react";
import ScrapeCreator from "./ScrapeCreator";
import { useNewScrapeContext } from "../context/NewScrapeContext";

async function getScrapeAllowed() {
  const response = await fetch(
    `http://localhost:8000/api/get_scrape_allowed/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

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

  const [postReturn, setPostReturn] = useState<string>("");

  const handlePostClick = async () => {
    try {
      const response = await getScrapeAllowed();

      // if (response.hasOwnProperty("success")) {
      //   setPostReturn(`${JSON.stringify(response)}`);
      // } else {
      //   setPostReturn(`No 'success' exists ${JSON.stringify(response)}`);
      // }
      if (response.allow) {
        setPostReturn("True")
      } else {
        setPostReturn(`False, ${JSON.stringify(response.seconds_left)} seconds left`)
      }
    } catch {
      setPostReturn(`Failed to communicate with server`);
    }
  };

  return (
    <>
      <h1 className="page-title">Start New Price Scrape</h1>
      <h2>{postReturn}</h2>
      <button onClick={handlePostClick}>TEST POST</button>
      <details>
        <summary className="filter-button scrape-tutorial-button" role="button">
          <strong>Show Tutorial</strong>
        </summary>
        <div className="scrape-tutorial-text">
          <ol className="tutorial-list">
            <li>
              <strong>1.</strong> Choose the type of performance benchmark you
              want to compare.
            </li>
            <li>
              <strong>2.</strong> Add the products you wish to compare by
              clicking on them in the tiered list below.
              <br />
              <em>
                &emsp;You can only compare 5 GPUs or 10 CPUs at a time, but{" "}
                <strong>
                  you do not need to fill the maximum amount of products.
                </strong>
              </em>
            </li>
            <li>
              <strong>3.</strong> Click on <strong>'Start Price Scrape'</strong>{" "}
              and wait for the price scraper to finish. Once finished, you will
              be redirected to the results.
              <br />
              <em>
                &emsp;GPU scrapes usually take longer to finish than CPU
                scrapes.
              </em>
              <br />
              <em>&emsp;If price scraping fails, try again in a moment.</em>
            </li>
          </ol>
        </div>
      </details>
      <h2 className="new-scrape-benchmark-header">Choose Benchmark Type</h2>
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
