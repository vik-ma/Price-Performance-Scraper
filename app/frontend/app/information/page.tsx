import Link from "next/link";

export default function Information() {
  return (
    <>
      <h1 className="page-title">Information</h1>
      <p></p>
      <h2 className="information-intro">How It Works</h2>
      <p></p>
      <h2 className="information-scrapes">Scraped Prices</h2>
      <p></p>
      <h3 className="information-scrapes">Price / Performance Score</h3>
      <p>
        This is the formula used for calculating the Price / Performance Score:
      </p>
      <div className="centered-container">
        <div className="formula-container">( Benchmark Value &divide; Price ) &times; 100</div>
      </div>
      <h2 className="information-benchmarks" id="benchmarks">
        Benchmarks
      </h2>
      <p></p>
      <h3 className="information-benchmarks">Benchmark Disclaimer</h3>
      <p></p>
      <h2 className="information-mct">Manual Comparison Tool</h2>
      <p>
        The{" "}
        <Link
          className="internal-link-color"
          href="/manual_comparison"
          target="_blank"
        >
          <strong>Manual Comparison Tool</strong>
        </Link>{" "}
        can be used to calculate the Price / Performance Score of custom price
        and/or benchmark value inputs instead of just scraped values. Keep in
        mind that{" "}
        <strong>
          these scores will not match the Price / Performance Scores generated
          by scrapes unless the benchmark values are constructed using the same
          formula shown in the 'Benchmarks' section of this page.
        </strong>
      </p>
    </>
  );
}
