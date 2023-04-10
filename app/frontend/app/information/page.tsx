import Link from "next/link";

export default function Information() {
  return (
    <>
      <h1 className="page-title information-header">Information</h1>
      <p className="information-text information-top-text">
        <strong>
          This website is designed to help you find the most value-for-money
          CPUs or GPUs on the market!
        </strong>
      </p>
      <h2 className="information-header information-intro">How It Works</h2>
      <p className="information-text">
        Over at{" "}
        <Link
          className="internal-link-color"
          href="/start_scrape"
          target="_blank"
        >
          <strong>Start Price Scrape</strong>
        </Link>{" "}
        you can select products that you are interested in comparing and start a
        real-time price scrape, which will calculate the most price efficient
        listing currently on the market!
        <br />
        <br />
        <em>
          As of right now, <strong>only online stores in Sweden</strong> are
          able to be scraped. However, you can still manually enter prices and
          compare different products' price efficiency by using the{" "}
          <Link
            className="internal-link-color"
            href="/manual_comparison"
            target="_blank"
          >
            <strong>Manual Comparison Tool</strong>
          </Link>
          .
        </em>
        <br />
        <br />
        Once the scrape has been completed, every price listing found will be
        ranked by its <strong>Price/Performance Score</strong>.
        <br />
        <br />
        <em>
          When scraping GPU prices, only the cheapest 25% of sub-models for
          every GPU model will get scraped. Use the{" "}
          <Link
            className="internal-link-color"
            href="/manual_comparison"
            target="_blank"
          >
            <strong>Manual Comparison Tool</strong>
          </Link>{" "}
          to manually compare listings that may have been missed by the scraper.
        </em>
      </p>
      <h2 className="information-header information-scrapes">
        Price/Performance Score
      </h2>
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
        <strong>0.01</strong>, where the highest performing model in the list
        will always have a Benchmark Value of <strong>100.00</strong>. The
        values are linear, which means that a product with a Benchmark Value of{" "}
        <strong>50.00</strong> has half the performance of the best product in
        the list.
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
        Benchmark Disclaimers
      </h3>
      <p className="information-text">
        Benchmark Values are not always accurate and in no way definite. The CPU
        benchmarks are sourced from <strong>PassMark</strong>, while GPU
        benchmarks are an aggregate of data from <strong>PassMark</strong> and{" "}
        <strong>Tom's Hardware</strong>. Benchmarks are
        <strong> automatically updated once every day</strong>.
        <br />
        <br />
        <strong>CPU Gaming</strong> benchmarks are semi-theoretical and{" "}
        <strong>not necessarily indicative of actual gaming performance</strong>
        , and should be taken with a grain of salt.
        <br />
        <br />
        <strong>GPUs</strong> of the same model come in different 'sub-models'
        made by various third party manufacturers which may differ in
        performance from each other.{" "}
        <strong>
          No comparisons are made between individual sub-models in these
          benchmarks.
        </strong>
        <br />
        <br />
        Use the{" "}
        <Link
          className="internal-link-color"
          href="/manual_comparison"
          target="_blank"
        >
          <strong>Manual Comparison Tool</strong>
        </Link>{" "}
        to calculate Price/Performance Score using custom benchmark values.
      </p>
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
        can be used to calculate the Price/Performance Score of custom price
        and/or benchmark value inputs instead of just scraped values. Keep in
        mind that{" "}
        <strong>
          these scores will not match the Price/Performance Scores generated by
          scrapes unless the benchmark values are constructed using the same
          formula shown in the 'Benchmarks' section on this page.
        </strong>
      </p>
    </>
  );
}
