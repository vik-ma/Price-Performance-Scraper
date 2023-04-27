"use client";
import { useState, useEffect } from "react";
import Plus from "../icons/Plus";
import Minus from "../icons/Minus";
import Link from "next/link";

export default function ManualComparison() {
  const [windowWidth, setWindowWidth] = useState<number>(1920);

  const [numRows, setNumRows] = useState<number>(1);

  const rows: number[] = Array.from({ length: numRows });

  const [ppsArray, setPpsArray] = useState<string[]>([]);

  const handleRowModClick = (modification: string) => {
    if (modification === "add") {
      setNumRows((prev) => prev + 1);
    } else {
      setNumRows((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 0);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPpsArray: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      const priceInput = event.currentTarget.querySelector(
        `#price-${i}`
      ) as HTMLInputElement;

      const perfInput = event.currentTarget.querySelector(
        `#perf-${i}`
      ) as HTMLInputElement;

      const price: number = parseFloat(priceInput.value);
      const perf: number = parseFloat(perfInput.value);
      const ppsValue: number = (perf / price) * 100;
      newPpsArray.push(ppsValue.toFixed(2));
    }
    setPpsArray(newPpsArray);
  };

  return (
    <>
      <h1 className="page-title">Manual Comparison Tool</h1>
      <div className="mct-wrapper">
        <button
          type="button"
          className="dark-button table-mod-button"
          disabled={rows.length < 2}
          onClick={() => handleRowModClick("remove")}
        >
          <Minus /> Delete Row
        </button>
        <button
          type="button"
          className="dark-button table-mod-button"
          disabled={rows.length > 14}
          onClick={() => handleRowModClick("add")}
        >
          <Plus /> Add Row
        </button>
        <form onSubmit={(event) => handleSubmit(event)}>
          <table role="grid" className="mct-table">
            <thead>
              <tr>
                <th className="table-head mct-table-head listing-table-head listing-table-head-first">
                  <strong>Name (Optional)</strong>
                </th>
                <th className="table-head mct-table-head listing-table-head ">
                  {windowWidth >= 650 ? (
                    <strong>Performance Value</strong>
                  ) : (
                    <strong data-tooltip="Performance Value">
                      Perf. Value
                    </strong>
                  )}
                </th>
                <th className="table-head mct-table-head listing-table-head ">
                  <strong>Price</strong>
                </th>
                <th className="table-head listing-table-head listing-table-head-last">
                  <strong
                    data-tooltip={
                      windowWidth >= 650
                        ? "Higher is better"
                        : "Price/Performance Score (Higher is better)"
                    }
                    data-placement={windowWidth >= 650 ? "" : "left"}
                  >
                    {windowWidth >= 650
                      ? "Price / Performance Score"
                      : "P. P. S."}
                  </strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((_, index) => (
                <tr key={index}>
                  <td>
                    <label>
                      <input
                        className="mct-input"
                        type="text"
                        name={`name-${index}`}
                        id={`name-${index}`}
                      />
                    </label>
                  </td>
                  <td>
                    <label>
                      <input
                        className="mct-input"
                        type="text"
                        name={`perf-${index}`}
                        id={`perf-${index}`}
                        placeholder="Performance Value"
                        required
                      />
                    </label>
                  </td>
                  <td>
                    <label>
                      <input
                        className="mct-input"
                        type="text"
                        name={`price-${index}`}
                        id={`price-${index}`}
                        placeholder="Price"
                        required
                      />
                    </label>
                  </td>
                  <td>
                    <strong className="mct-pps">{ppsArray[index]}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="dark-button calculate-button" type="submit">
            <strong>Calculate</strong>
          </button>
        </form>
        <div className="mct-text-container">
          <p className="mct-text">
            This tool can be used to manually enter custom price and performance
            values to calculate and compare the Price / Performance Score of
            different products.
          </p>
          <br />
          <p className="mct-text">
            The Price / Performance Scores from this tool will not be
            proportionate to the Price / Performance Score from the site's{" "}
            <Link
              className="internal-link-color"
              href="/scrapes"
              target="_blank"
            >
              Completed Scrapes
            </Link>{" "}
            <strong>
              unless the performance values entered here are structured in the
              same way as this site's{" "}
              <Link
                className="internal-link-color"
                href="/information#benchmarks"
                target="_blank"
              >
                Benchmark Values
              </Link>{" "}
              are constructed.
            </strong>
          </p>
        </div>
      </div>
    </>
  );
}
