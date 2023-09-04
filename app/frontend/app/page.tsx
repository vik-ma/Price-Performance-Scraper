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
      <div className="demo-deployment-message">
        <h2 className="demo-deployment-heading">Important Message</h2>
        <h3 className="demo-deployment-heading">This Is A Demo Deployment</h3>
        <p className="demo-deployment-text">
          Since the project started, it has become impossible to perform price
          scraping if the back-end is hosted at a data center. Without either
          self-hosting the back-end from a residential IP-address, or using a
          residential proxy service, it is no longer possible to perform
          real-time price scrapes using this website.
          <br />
          <br />
          Everything else on both the front-end and back-end still works. In
          this demo-deployment, real-time Price Scraping is mocked. When a Price
          Scrape is started, instead of performing a Price Scrape, the back-end
          will just wait for a few seconds, and then return a random completed
          Price Scrape of the same Benchmark Type from the database.
          <br />
          <br />
          The mocked Price Scrape process is pretty much identical to how a real
          Price Scrape is performed. This GIF shows how the website would work
          under normal circumstances.
          <br />
          <br />
          The back-end still works like it should when you run it on localhost.
          If you want to set up the application on your localhost, follow this
          guide in the GitHub README.
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
