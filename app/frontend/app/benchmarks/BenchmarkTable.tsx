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
            <h2>TEST 1</h2>
            <p>
              TEST 1 TEST 1 TEST 1 TEST 1 TEST 1 TEST 1 TEST 1TEST 1TEST 1TEST
              1TEST 1TEST 1
            </p>
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
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
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
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
