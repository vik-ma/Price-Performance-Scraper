"use client";
import { useState } from "react";
import Plus from "../icons/Plus";
import Minus from "../icons/Minus";

export default function ManualComparison() {
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
      <h1>Manual Comparison Tool</h1>
      <form onSubmit={(event) => handleSubmit(event)}>
        <table role="grid">
          <thead>
            <tr>
              <th className="tableHead">
                <strong>Name (Optional)</strong>
              </th>
              <th className="tableHead">
                <strong>Performance Value</strong>
              </th>
              <th className="tableHead">
                <strong>Price</strong>
              </th>
              <th className="tableHead">
                <strong>Price / Performance Score</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr key={index}>
                <td>
                  <label>
                    <input
                      type="text"
                      name={`name-${index}`}
                      id={`name-${index}`}
                      placeholder="Name (Optional)"
                    />
                  </label>
                </td>
                <td>
                  <label>
                    <input
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
                      type="text"
                      name={`price-${index}`}
                      id={`price-${index}`}
                      placeholder="Price"
                      required
                    />
                  </label>
                </td>
                <td>
                  <strong>{ppsArray[index]}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="dark-button table-mod-button"
          disabled={rows.length < 2}
          onClick={() => handleRowModClick("remove")}
        >
          <Minus />
        </button>
        <button
          type="button"
          className="dark-button table-mod-button"
          disabled={rows.length > 9}
          onClick={() => handleRowModClick("add")}
        >
          <Plus />
        </button>
        <button type="submit">Calculate</button>
      </form>
    </>
  );
}
