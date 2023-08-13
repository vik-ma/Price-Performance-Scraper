"use client";
import React from "react";
import { useState, useEffect } from "react";
import ScrapeCreator from "./ScrapeCreator";
import { useNewScrapeContext } from "../context/NewScrapeContext";
import { ScrapeAllowedAPIResponse } from "@/typings";
import GPUIcon from "../icons/GPUIcon";
import CPUGIcon from "../icons/CPUGIcon";
import CPUNIcon from "../icons/CPUNIcon";

// Function to call Django API and see if Price Scrape is on cooldown
async function getScrapeAllowed(): Promise<ScrapeAllowedAPIResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_scrape_allowed/`,
      {
        // Don't cache response
        cache: "no-store",
      }
    );

    return response.json();
  } catch {
    return { success: false };
  }
}

export default function NewScrape() {
  // useContext for variables shared between this component and ScrapeCreator.tsx
  const {
    loadingScrape,
    setErrorMsg,
    setShowErrorMsg,
    setScrapeAllowedMsg,
    setIsScrapeAllowed,
    scrapeAllowedTimer,
    setScrapeAllowedTimer,
  } = useNewScrapeContext();

  // Tabs for different Benchmark Types (1 = GPU, 2 = CPU-Gaming, 3 = CPU-Normal/Multithread)
  const [tabIndex, setTabIndex] = useState(1);

  // Arrow function to change Benchmark Type tab and clear any existing error message
  const toggleTab = (index: number) => {
    if (!loadingScrape) {
      setTabIndex(index);
      setErrorMsg("");
      setShowErrorMsg(false);
    }
  };

  // Arrow function to handle the response of getScrapeAllowed API call
  const handleGetScrapeAllowed = async () => {
    const response = await getScrapeAllowed();

    if (response.success) {
      // If API call was successful
      if (response.allow) {
        // If scrape is allowed
        setIsScrapeAllowed(true);
        setScrapeAllowedMsg("Allowed");
      } else {
        // If scrape is on cooldown, display the number of seconds until it's not
        const secondsLeft: number =
          response.seconds_left === undefined ? 0 : response.seconds_left;
        setIsScrapeAllowed(false);
        setScrapeAllowedTimer(secondsLeft);
        setScrapeAllowedMsg(
          `${JSON.stringify(response.seconds_left)} seconds left`
        );
      }
    } else {
      // If API call was not successful
      setScrapeAllowedMsg(`Failed to communicate with server`);
    }
  };

  // Get the response of getScrapeAllowed on page load
  useEffect(() => {
    handleGetScrapeAllowed();
  }, []);

  // Decrement the timer of scrapeAllowedTimer by one second every second
  useEffect(() => {
    if (scrapeAllowedTimer > 0) {
      setTimeout(() => setScrapeAllowedTimer((time) => time - 1), 1000);
    } else {
      setScrapeAllowedMsg("Allowed");
      setIsScrapeAllowed(true);
    }
  }, [scrapeAllowedTimer]);

  return (
    <>
      <h1>
        <span className="page-title">Start New Price Scrape</span>
      </h1>
      <details>
        <summary className="filter-button scrape-tutorial-button" role="button">
          <strong>Show Tutorial</strong>
        </summary>
        <div className="scrape-tutorial-text">
          <ol className="tutorial-list no-dot-list">
            <li className="no-dot-list-item">
              <strong className="bold-white-text">1.</strong> Choose the type of
              performance benchmark you want to compare.
            </li>
            <li className="no-dot-list-item">
              <strong className="bold-white-text">2.</strong> Add the products
              you wish to compare by clicking on them in the tiered list below.
              <br />
              <div className="tutorial-tab">
                <em>
                  You can only compare 3 GPUs or 7 CPUs at a time, but{" "}
                  <strong className="bold-white-text">
                    you do not need to fill the maximum amount of products.
                  </strong>
                </em>
              </div>
            </li>
            <li className="no-dot-list-item">
              <strong className="bold-white-text">3.</strong> Click on{" "}
              <strong className="bold-white-text">'Start Price Scrape'</strong>{" "}
              and wait for the price scraper to finish. Once finished, you will
              be redirected to the results.
              <br />
              <div className="tutorial-tab">
                <strong className="red-text">
                  <em>
                    Price Scraping has a global cooldown of 3 minutes, which
                    means that you or anyone else can only do one Price Scrape
                    every three minutes.
                  </em>
                </strong>
                <br />
                <em>
                  <strong className="bold-white-text">GPU Scrapes</strong>{" "}
                  usually take longer to finish than{" "}
                  <strong className="bold-white-text">CPU Scrapes</strong>.
                </em>
                <br />
                <em>
                  If Price Scraping fails, try again in a moment. Scraping may
                  also fail if no selected products are in stock anywhere.
                </em>
              </div>
            </li>
          </ol>
        </div>
      </details>
      <h2 className="new-scrape-benchmark-header">Choose Benchmark Type</h2>
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
            <span className="benchmark-header-icon">
              <CPUGIcon />
            </span>
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
            <span className="benchmark-header-icon">
              <CPUNIcon />
            </span>
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
