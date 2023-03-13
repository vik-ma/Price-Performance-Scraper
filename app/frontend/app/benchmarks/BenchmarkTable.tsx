"use client";
import React from "react";
import { useState } from "react";

export default function BenchmarkTable() {
  const [tabIndex, setTabIndex] = useState(1);

  const toggleTab = (index: number) => {
    setTabIndex(index);
  };
  return (
    <>
      <div className="benchmarkTableContainer">
        <div className="benchmarkTableTabsContainer">
          <div
            className={
              tabIndex === 1
                ? "benchmarkTableTabs benchmarkTableActiveTabs"
                : "benchmarkTableTabs"
            }
            onClick={() => toggleTab(1)}
          >
            Tab 1
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmarkTableTabs benchmarkTableActiveTabs"
                : "benchmarkTableTabs"
            }
            onClick={() => toggleTab(2)}
          >
            Tab 2
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmarkTableTabs benchmarkTableActiveTabs"
                : "benchmarkTableTabs"
            }
            onClick={() => toggleTab(3)}
          >
            Tab 3
          </div>
        </div>

        <div className="benchmarkTableContentTabs">
          <div
            className={
              tabIndex === 1
                ? "benchmarkTableContent benchmarkTableActiveContent"
                : "benchmarkTableContent"
            }
          >
            <h2>TEST 1</h2>
            <p>
              TEST 1 TEST 1 TEST 1 TEST 1 TEST 1 TEST 1 TEST 1TEST 1TEST 1TEST
              1TEST 1TEST 1
            </p>
          </div>
          <div
            className={
              tabIndex === 2
                 ? "benchmarkTableContent benchmarkTableActiveContent"
                : "benchmarkTableContent"
            }
          >
            <h2>TEST 2</h2>
            <p>
              adsdsjdsadsa dadsjdsaodsaoidsa a idsa idsidsidsoisaudo iasdsds
              adsaadsadsdasasd
            </p>
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmarkTableContent benchmarkTableActiveContent"
                : "benchmarkTableContent"
            }
          >
            <h2>TEST 3</h2>
            <p>
              33333 3333333 333333333333333 3333333 33333333 33333333333333333
              3333333333 3333333 3333333333 3333333 333333333
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
