"use client";
import React from "react";
import { useState, useEffect } from "react";
import ScrapeCreator from "./ScrapeCreator";
import { useNewScrapeContext } from "../context/NewScrapeContext";
import { ScrapeAllowedAPIResponse } from "@/typings";
import GPUIcon from "../icons/GPUIcon";
import CPUGIcon from "../icons/CPUGIcon";
import CPUNIcon from "../icons/CPUNIcon";

async function getScrapeAllowed(): Promise<ScrapeAllowedAPIResponse> {
  try {
    const response = await fetch(
      `http://localhost:8000/api/get_scrape_allowed/`,
      {
        cache: "no-store",
      }
    );

    return response.json();
  } catch {
    return { success: false };
  }
}

export default function NewScrape() {
  const {
    loadingScrape,
    setErrorMsg,
    setShowErrorMsg,
    setScrapeAllowedMsg,
    setIsScrapeAllowed,
    scrapeAllowedTimer,
    setScrapeAllowedTimer,
  } = useNewScrapeContext();

  const [tabIndex, setTabIndex] = useState(1);

  const toggleTab = (index: number) => {
    if (!loadingScrape) {
      setTabIndex(index);
      setErrorMsg("");
      setShowErrorMsg(false);
    }
  };

  const handleGetScrapeAllowed = async () => {
    const response = await getScrapeAllowed();

    if (response.success) {
      if (response.allow) {
        setIsScrapeAllowed(true);
        setScrapeAllowedMsg("Allowed");
      } else {
        const secondsLeft: number =
          response.seconds_left === undefined ? 0 : response.seconds_left;
        setIsScrapeAllowed(false);
        setScrapeAllowedTimer(secondsLeft);
        setScrapeAllowedMsg(
          `${JSON.stringify(response.seconds_left)} seconds left`
        );
      }
    } else {
      setScrapeAllowedMsg(`Failed to communicate with server`);
    }
  };

  useEffect(() => {
    handleGetScrapeAllowed();
  }, []);

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
      <h1 className="page-title">Start New Price Scrape</h1>
      <details>
        <summary className="filter-button scrape-tutorial-button" role="button">
          <strong>Show Tutorial</strong>
        </summary>
        <div className="scrape-tutorial-text">
          <ol className="tutorial-list no-dot-list">
            <li className="no-dot-list-item">
              <strong>1.</strong> Choose the type of performance benchmark you
              want to compare.
            </li>
            <li className="no-dot-list-item">
              <strong>2.</strong> Add the products you wish to compare by
              clicking on them in the tiered list below.
              <br />
              <div className="tutorial-tab">
                <em>
                  You can only compare 5 GPUs or 10 CPUs at a time, but{" "}
                  <strong>
                    you do not need to fill the maximum amount of products.
                  </strong>
                </em>
              </div>
            </li>
            <li className="no-dot-list-item">
              <strong>3.</strong> Click on <strong>'Start Price Scrape'</strong>{" "}
              and wait for the price scraper to finish. Once finished, you will
              be redirected to the results.
              <br />
              <div className="tutorial-tab">
                <strong className="red-text">
                  <em>
                    Price Scraping have a global cooldown of 3 minutes, which
                    means that you or anyone else can only do one Price Scrape
                    every three minutes.
                  </em>
                </strong>
                <br />
                <em>
                  <strong>GPU Scrapes</strong> usually take longer to finish
                  than <strong>CPU Scrapes</strong>.
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
