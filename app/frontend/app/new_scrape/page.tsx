"use client";
import React from "react";
import { useState, useContext, createContext } from "react";
import ScrapeCreator from "./ScrapeCreator";

interface CreateScrapeContextType {
  loadingScrape: boolean;
  setLoadingScrape: React.Dispatch<React.SetStateAction<boolean>>;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  showErrorMsg: boolean;
  setShowErrorMsg: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateScrapeContext = createContext<CreateScrapeContextType>({
  loadingScrape: false,
  setLoadingScrape: () => {},
  errorMsg: "",
  setErrorMsg: () => {},
  showErrorMsg: false,
  setShowErrorMsg: () => {},
});

export default function NewScrape() {

  const [loadingScrape, setLoadingScrape] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);

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
      <CreateScrapeContext.Provider
        value={{
          loadingScrape,
          setLoadingScrape,
          errorMsg,
          setErrorMsg,
          showErrorMsg,
          setShowErrorMsg,
        }}
      >
        <h1>NEW</h1>
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
      </CreateScrapeContext.Provider>
    </>
  );
}
