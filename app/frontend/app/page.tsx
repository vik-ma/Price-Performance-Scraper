import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1 className="home-title">Price/Performance Scraper</h1>
      <p className="home-text">
        <strong>Price/Performance Scraper</strong> is a tool to compare the
        price efficiency of different GPU and CPU models. You can select
        specific products and it will scrape the currently available prices for
        the products and calculate their{" "}
        <strong>Price/Performance Score</strong>. The Price/Performance Score is
        a value determined by a product's price compared to its performance
        benchmark relative to other models.
        <br />
        <br />
        Currently, <strong>only online stores in Sweden</strong> are available
        for price scraping.
        <br />
        <br />
      </p>
      <p className="home-text home-text-start-scrape">
        <strong>Click the button below to start a price scrape!</strong>
      </p>
      <div className="centered-container">
        <Link href="/start_scrape">
          <button className="start-button start-button-home">
            <strong>Start Price Scrape</strong>
          </button>
        </Link>
      </div>
      <br />
      <p className="home-text">
        You can also use the{" "}
        <Link className="internal-link-color" href="/manual_comparison">
          <strong>Manual Comparison Tool</strong>
        </Link>{" "}
        to calculate the Price/Performance Score using custom prices and/or
        performance values.
        <br />
        <br />
        View all past price scrapes in the{" "}
        <Link className="internal-link-color" href="/scrapes">
          <strong>Completed Scrapes</strong>
        </Link>{" "}
        section.
        <br />
        <br />
        Current performance benchmark values in use can be found on the{" "}
        <Link className="internal-link-color" href="/benchmarks">
          <strong>Benchmarks</strong>
        </Link>{" "}
        page.
        <br />
        <br />
        To learn more, head over to the{" "}
        <Link className="internal-link-color" href="/information">
          <strong>Information</strong>
        </Link>{" "}
        page.
      </p>
      {/* <div className="centered-container">
        <Link href="/manual_comparison">
          <button className="start-button start-button-home mct-button-home">
            <strong>Manual Comparison Tool</strong>
          </button>
        </Link>
      </div>
      <div className="centered-container">
        <Link href="/benchmarks">
          <button className="start-button start-button-home benchmarks-button-home">
            <strong>See Current Benchmarks</strong>
          </button>
        </Link>
      </div>
      <div className="centered-container">
        <Link href="/scrapes">
          <button className="start-button start-button-home scrapes-button-home">
            <strong>Browse Past Scrapes</strong>
          </button>
        </Link>
      </div>
      <div className="centered-container">
        <Link href="/information">
          <button className="start-button start-button-home info-button-home">
            <strong>Learn More</strong>
          </button>
        </Link>
      </div> */}
    </main>
  );
}
