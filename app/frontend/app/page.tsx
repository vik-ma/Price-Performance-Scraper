import Link from "next/link";
import Image from "next/image";
import GitHubLogo from "/public/GitHub_Logo_White.png";
import GitHubMark from "/public/github-mark-white.png";

// async function wakeApi() {
//   // Function to call a simple GET request to backend in order to wake up sleeping web service
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/wake_api/`,
//       {
//         // Cache response and revalidate on new request, at most once per 15 minutes
//         next: {
//           revalidate: 900,
//         },
//       }
//     );
//   } catch {}
// }

export default async function Home() {
  // Call GET request to wake backend serverless web service
  // await wakeApi();

  return (
    <>
      <h1>
        <span className="title-gradient">Price/Performance Scraper</span>
      </h1>
      <div id="demo-deployment" className="demo-deployment-container">
        <h2 className="demo-deployment-heading">Important Message</h2>
        <h3 className="demo-deployment-heading">This Is A Demo Deployment</h3>
        <p className="demo-deployment-text">
          Since the project started, it has generally become impossible to
          perform price scraping if the back-end is hosted at a data center.
          Without either self-hosting the back-end from a residential
          IP-address, or using a residential proxy service,{" "}
          <strong className="bold-white-text">
            it is (most of the time) no longer possible to perform real-time
            price scrapes using this website.
          </strong>{" "}
          Everything else on both the front-end and back-end still works.
          <br />
          <br />{" "}
          <strong className="bold-white-text">
            In this demo deployment, Price Scraping gets simulated if the
            real-time Price Scrape fails.
          </strong>{" "}
          When a Price Scrape is started, on rare occasions, it will perform a
          Price Scrape as per usual. If it fails, the back-end will instead
          simulate a Price Scrape by waiting for a few seconds and then return a
          random completed Price Scrape of the same Benchmark Type from the
          database.
          <br />
          <br />
          The simulated Price Scrape process is pretty much identical to how a
          real Price Scrape is performed.{" "}
          <a
            href="https://github.com/vik-ma/Price-Performance-Scraper/blob/master/pps-preview.gif"
            target="_blank"
            className="internal-link-color"
          >
            <strong>This GIF</strong>
          </a>{" "}
          shows how the website would work under normal circumstances.
          <br />
          <br />
          The back-end still works as normal when its run locally. If you want
          to set up this application on your localhost, follow{" "}
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
