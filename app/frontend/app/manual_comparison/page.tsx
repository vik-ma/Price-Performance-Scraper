"use client";

export default function ManualComparison() {
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
          </thead>{" "}
          <tbody>
            <tr>
              <td>
                <label>
                  <input type="text" placeholder="Name (Optional)" />
                </label>
              </td>
              <td>
                <label>
                  <input type="text" placeholder="Performance Value" required />
                </label>
              </td>
              <td>
                <label>
                  <input type="text" placeholder="Price" required />
                </label>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Calculate</button>
      </form>
    </>
  );
}
