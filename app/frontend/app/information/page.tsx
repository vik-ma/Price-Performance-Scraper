import Link from "next/link";

export default function Information() {
  return (
    <>
      <h1 className="page-title information-header">Information</h1>
      <p className="information-text"></p>
      <h2 className="information-header information-intro">How It Works</h2>
      <p className="information-text"></p>
      <h2 className="information-header information-scrapes">Scraped Prices</h2>
      <p className="information-text"></p>
      <h3 className="information-header information-scrapes">
        Price/Performance Score
      </h3>
      <p className="information-text">
        This is the formula that is used to calculate the Price/Performance
        Score of a product:
      </p>
      <div className="centered-container">
        <div className="formula-container">
          ( Benchmark Value &divide; Price ) &times; 100
        </div>
      </div>
      <br />
      <p className="information-text">
        A higher Price/Performance Score indicates that the product is more
        cost-effective in terms of its performance score, meaning that the
        product performs better <strong>in relation to its price</strong>{" "}
        compared to products with a lower Price/Performance Score.
        <br />
        <br />
        It does not necessarily mean that a product is better than another
        product. The Benchmark Value determines that, and products with lower
        Benchmark Values will often have much higher Price/Performance Scores
        compared to the flagship models.
      </p>
      <h2 className="information-header information-benchmarks" id="benchmarks">
        Benchmarks
      </h2>
      <p className="information-text">
        The Benchmark Value is the performance rating of a specific model, and a
        full list of all current Benchmark Values in use can be found on the{" "}
        <Link
          className="internal-link-color"
          href="/benchmarks"
          target="_blank"
        >
          <strong>Current Benchmarks</strong>
        </Link>{" "}
        page.
        <br />
        <br />
        There are three different types of Benchmark Values;{" "}
        <strong>GPU Performance</strong>,{" "}
        <strong>CPU (Gaming Performance)</strong> and{" "}
        <strong>CPU (Multi-threaded Performance)</strong>.
        <br />
        <br />
        Benchmark Values range from <strong>100.00</strong> to{" "}
        <strong>0.01</strong>, where the highest performing product on the
        market will always have the Benchmark Value of <strong>100.00</strong>.
        The values are linear, which means that a product with a Benchmark Value
        of <strong>50.00</strong> has half the performance of the best product
        in the list.
      </p>
      <h3 className="information-header information-benchmarks">
        Benchmark Tiers
      </h3>
      <p className="information-text">
        Products are sorted into different <strong>Tiers</strong> with other
        products of similar Benchmark Values, in order to make it easier to find
        comparable product models.
        <br />
        <br />
        These Tiers are also seen when selecting products to scrape.
      </p>
      <h3 className="information-header information-benchmarks">
        Benchmark Disclaimer
      </h3>
      <p className="information-text"></p>
      <h2 className="information-header information-mct">
        Manual Comparison Tool
      </h2>
      <p className="information-text">
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
          formula shown in the 'Benchmarks' section on this page.
        </strong>
      </p>
    </>
  );
}
