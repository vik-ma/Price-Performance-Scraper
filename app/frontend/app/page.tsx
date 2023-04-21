import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1 className="home-title">Price/Performance Scraper</h1>
      <p className="home-text">
        <strong></strong>
      </p>
      <div className="centered-container">
        <Link href="/start_scrape">
          <button className="start-button start-button-home">
            <strong>Click Here To Start A Price Scrape</strong>
          </button>
        </Link>
      </div>
      <div className="centered-container">
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
      </div>
    </main>
  );
}
