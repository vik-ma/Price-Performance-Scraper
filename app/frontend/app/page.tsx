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
