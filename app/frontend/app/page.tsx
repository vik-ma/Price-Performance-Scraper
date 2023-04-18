import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1 className="page-title home-title">Price/Performance Scraper</h1>
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
    </main>
  );
}
