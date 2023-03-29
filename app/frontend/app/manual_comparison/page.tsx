"use client";
import { useState } from "react";
import Plus from "../icons/Plus";
import Minus from "../icons/Minus";

export default function ManualComparison() {
  const [numRows, setNumRows] = useState<number>(1);

  const rows: number[] = Array.from({ length: numRows });

  const [ppsArray, setPpsArray] = useState<number[]>([]);

  const handleRowModClick = (modification: string) => {
    if (modification === "add") {
      setNumRows((prev) => prev + 1);
    } else {
      setNumRows((prev) => prev - 1);
    }
  };

  return (
    <>
      <h1>Manual Comparison Tool</h1>
      <form>
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
                    <input type="text" placeholder="Name (Optional)" />
                  </label>
                </td>
                <td>
                  <label>
                    <input
                      type="text"
                      placeholder="Performance Value"
                      required
                    />
                  </label>
                </td>
                <td>
                  <label>
                    <input type="text" placeholder="Price" required />
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
