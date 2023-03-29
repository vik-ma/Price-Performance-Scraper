"use client";
import { useState } from "react";

export default function ManualComparison() {
  const [numRows, setNumRows] = useState<number>(1);

  const rows = Array.from({ length: numRows });

  const [ppsArray, setPpsArray] = useState<number[]>([]);

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
        <button type="submit">Calculate</button>
      </form>
    </>
  );
}
