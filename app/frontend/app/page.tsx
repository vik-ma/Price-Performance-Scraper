import Link from "next/link";
import Image from "next/image";
import GitHubLogo from "/public/GitHub_Logo_White.png";
import GitHubMark from "/public/github-mark-white.png";

export default async function Home() {
  return (
    <>
      <h1>
        <span className="title-gradient">Price/Performance Scraper</span>
      </h1>
      <div id="demo-deployment" className="demo-deployment-container">
        <h2 className="demo-deployment-heading">Important Message</h2>
        <h3 className="demo-deployment-heading">This Is A Demo Deployment</h3>
        <p className="demo-deployment-text">
          Since the back-end server is hosted at a data center,{" "}
          <strong className="bold-white-text">
            real-time price scraping may fail due to the server's IP-address being
            blocked
          </strong>
          .
          <br />
          <br />
          In this demo deployment,{" "}
          <strong className="bold-white-text">
            if price scraping fails, the back-end will instead simulate a Price
            Scrape
          </strong>{" "}
          by waiting for a few seconds and then fetch a random completed Price
          Scrape of the same Benchmark Type from the database.
          <br />
          <br />
          Price Scraping still works as normal when the project is run locally.
          If you want to set up this application on your localhost, follow{" "}
          <a
            href="https://github.com/vik-ma/Price-Performance-Scraper#set-up-application-on-localhost"
            target="_blank"
            className="internal-link-color"
          >
            <strong>this guide in the GitHub README</strong>
          </a>
          .
        </p>
      </div>
      <p className="home-text">
        <strong className="bold-white-text">Price/Performance Scraper</strong>{" "}
        is a tool to compare the price efficiency of different GPU and CPU
        models. You can select specific products and it will scrape the
        currently available prices for the products and calculate their{" "}
        <strong className="bold-white-text">Price/Performance Score</strong>.
        The Price/Performance Score is a value determined by a product's price
        compared to its performance benchmark relative to other models.
        <br />
        <br />
        Currently,{" "}
        <strong className="bold-white-text">
          only online stores in Sweden
        </strong>{" "}
        are available for price scraping.
        <br />
      </p>
      <p className="home-text home-text-start-scrape">
        <strong>Click the button below to start a price scrape!</strong>
      </p>
      <div className="centered-container">
        <Link href="/start-scrape">
          <button className="start-button start-button-home">
            <strong>Start Price Scrape</strong>
          </button>
        </Link>
      </div>
      <br />
      <p className="home-text">
        You can also use the{" "}
        <Link className="internal-link-color" href="/manual-comparison">
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
