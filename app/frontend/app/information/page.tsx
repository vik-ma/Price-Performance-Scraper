import Link from "next/link";
import Image from "next/image";
import GitHubLogo from "/public/GitHub_Logo_White.png";
import GitHubMark from "/public/github-mark-white.png";

export default async function Information() {
  return (
    <>
      <h1>
        <span className="title-gradient">Information</span>
      </h1>
      <div id="demo-deployment" className="demo-deployment-container">
        <p className="demo-deployment-text text-centered">
          Some of the information on this page may not be accurate for this demo
          deployment.
          <br />
          <strong className="bold-white-text">
            Read the Important Message on the{" "}
            <Link href={"/"} className="internal-link-color">
              Home Page
            </Link>{" "}
            to learn more.
          </strong>
        </p>
      </div>
      <p className="information-text information-top-text">
        <strong className="bold-white-text">
          This website is designed to help you find the most value-for-money
          CPUs or GPUs on the market!
        </strong>
      </p>
      <h2 className="information-sub-header title-gradient">How It Works</h2>
      <p className="information-text">
        Over at{" "}
        <Link
          className="internal-link-color"
          href="/start-scrape"
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
          As of right now,{" "}
          <strong className="bold-white-text">
            only online stores in Sweden
          </strong>{" "}
          are able to be scraped. However, you can still manually enter prices
          and compare different products' price efficiency by using the{" "}
          <Link
            className="internal-link-color"
            href="/manual-comparison"
            target="_blank"
          >
            <strong>Manual Comparison Tool</strong>
          </Link>
          .
        </em>
        <br />
        <br />
        Once the scrape has been completed, every price listing found will be
        ranked by its{" "}
        <strong className="bold-white-text">Price/Performance Score</strong>.
        <br />
        <br />
        <em>
          <strong className="bold-white-text">
            To prevent abuse, a 3 minute global cooldown is placed on Price
            Scraping.
          </strong>{" "}
          This means that you or anyone else using this website can only start
          one Price Scrape every three minutes.
        </em>
        <br />
        <br />
        <em>
          When scraping GPU prices, only the cheapest sub-models for every GPU
          model will get scraped. Use the{" "}
          <Link
            className="internal-link-color"
            href="/manual-comparison"
            target="_blank"
          >
            <strong>Manual Comparison Tool</strong>
          </Link>{" "}
          to manually compare listings that may have been missed by the scraper.
        </em>
      </p>
      <h2 className="information-sub-header title-gradient">
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
        product performs better{" "}
        <strong className="bold-white-text">in relation to its price</strong>{" "}
        compared to products with a lower Price/Performance Score.
        <br />
        <br />
        It does not necessarily mean that a product is better than another
        product. The Benchmark Value determines that, and products with lower
        Benchmark Values will often have much higher Price/Performance Scores
        compared to the flagship models.
      </p>
      <h2 className="information-sub-header title-gradient" id="benchmarks">
        Benchmarks
      </h2>
      <p className="information-text">
        The Benchmark Value is the performance rating of a specific model, and a
        full list of all products available for Price Scraping with their
        respective Benchmark Values can be found on the{" "}
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
        <strong className="bold-white-text">GPU Performance</strong>,{" "}
        <strong className="bold-white-text">CPU (Gaming Performance)</strong>{" "}
        and{" "}
        <strong className="bold-white-text">
          CPU (Multi-threaded Performance)
        </strong>
        .
        <br />
        <br />
        Benchmark Values range from{" "}
        <strong className="bold-white-text">100.00</strong> to{" "}
        <strong className="bold-white-text">0.01</strong>, where the highest
        performing model in the list will always have a Benchmark Value of{" "}
        <strong className="bold-white-text">100.00</strong>. The values are
        linear, which means that a product with a Benchmark Value of{" "}
        <strong className="bold-white-text">50.00</strong> has half the
        performance of the best product in the same category.
      </p>
      <h3 className="information-sub-header title-gradient">Benchmark Tiers</h3>
      <p className="information-text">
        Products are sorted into different{" "}
        <strong className="bold-white-text">Tiers</strong> with other products
        of similar Benchmark Values, in order to make it easier to find
        comparable product models.
        <br />
        <br />
        These Tiers are also seen when selecting products to scrape.
      </p>
      <h3 className="information-sub-header title-gradient">
        Benchmark Disclaimers
      </h3>
      <p className="information-text">
        Benchmark Values are not always accurate and in no way definite. The CPU
        benchmarks are sourced from{" "}
        <strong className="bold-white-text">PassMark</strong>, while GPU
        benchmarks are an aggregate of data from{" "}
        <strong className="bold-white-text">PassMark</strong> and{" "}
        <strong className="bold-white-text">Tom's Hardware</strong>. Benchmarks
        are
        <strong className="bold-white-text">
          {" "}
          automatically updated once every day
        </strong>
        .
        <br />
        <br />
        <strong className="bold-white-text">CPU Gaming</strong> benchmarks are
        semi-theoretical and{" "}
        <strong className="bold-white-text">
          not based on performance benchmarks from actual games
        </strong>
        . They are not necessarily indicative of actual gaming performance and
        should be taken with a grain of salt.
        <br />
        <br />
        <strong className="bold-white-text">GPUs</strong> of the same model come
        in different 'sub-models' made by various third party manufacturers
        which may differ in performance from each other.{" "}
        <strong className="bold-white-text">
          No comparisons are made between individual sub-models in these
          benchmarks.
        </strong>
        <br />
        <br />
        Use the{" "}
        <Link
          className="internal-link-color"
          href="/manual-comparison"
          target="_blank"
        >
          <strong>Manual Comparison Tool</strong>
        </Link>{" "}
        to calculate Price/Performance Score using custom benchmark values.
      </p>
      <h2 className="information-sub-header title-gradient">
        Manual Comparison Tool
      </h2>
      <p className="information-text">
        The{" "}
        <Link
          className="internal-link-color"
          href="/manual-comparison"
          target="_blank"
        >
          <strong>Manual Comparison Tool</strong>
        </Link>{" "}
        can be used to calculate the Price/Performance Score of custom price
        and/or benchmark value inputs instead of just scraped values. Keep in
        mind that{" "}
        <strong className="bold-white-text">
          these scores will not match the Price/Performance Scores generated by
          scrapes unless the benchmark values are constructed using the same
          formula shown in the 'Benchmarks' section on this page.
        </strong>
      </p>
      <br />
      <div className="centered-container github-container">
        <a
          className="github-logo-link"
          href="https://github.com/vik-ma/Price-Performance-Scraper"
          target="_blank"
        >
          <Image
            src={GitHubMark}
            alt="GitHub Mark"
            width={24}
            id="gh-img-mark"
          />
          <Image
            src={GitHubLogo}
            alt="GitHub Logo"
            width={80}
            id="gh-img-text"
          />
        </a>
        <p className="github-text">Visit the project's GitHub repo</p>
      </div>
    </>
  );
}
