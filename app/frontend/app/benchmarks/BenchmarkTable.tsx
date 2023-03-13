"use client";
import React from "react";
import { useState } from "react";

export default function BenchmarkTable() {
  return (
    <>
      <div className="benchmarkTableContainer">
        <div className="benchmarkTableTabsContainer">
          <div className="benchmarkTableTabs benchmarkTableActiveTabs">Tab 1</div>
          <div className="benchmarkTableTabs">Tab 1</div>
          <div className="benchmarkTableTabs">Tab 1</div>
        </div>

        <div className="benchmarkTableContentTabs">
          <div className="benchmarkTableContent benchmarkTableActiveContent">
            <h2>TEST 1</h2>
            <p>
              TEST 1 TEST 1 TEST 1 TEST 1 TEST 1 TEST 1 TEST 1TEST 1TEST 1TEST
              1TEST 1TEST 1
            </p>
          </div>
          <div className="benchmarkTableContent">
            <h2>TEST 2</h2>
            <p>
              adsdsjdsadsa dadsjdsaodsaoidsa a idsa idsidsidsoisaudo iasdsds
              adsaadsadsdasasd
            </p>
          </div>
          <div className="benchmarkTableContent">
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
