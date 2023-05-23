import Link from "next/link";
import Image from "next/image";
import GitHubLogo from "/public/GitHub_Logo_White.png";
import GitHubMark from "/public/github-mark-white.png";

async function wakeApi() {
  // Function to call a simple GET request to backend in order to wake up sleeping web service
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/wake_api/`,
      {
        // Cache response and revalidate on new request, at most once per 15 minutes
        next: {
          revalidate: 900,
        },
      }
    );
  } catch {}
}

export default async function Home() {
  // Call GET request to wake backend web service
  await wakeApi();

  return (
    <>
      <h1 className="home-title">
        <span className="page-title">Price/Performance Scraper</span>
      </h1>
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
      <div className="centered-container">
        <a
          className="gh-logo-link"
          href="https://github.com/vik-ma/Price-Performance-Scraper"
          target="_blank"
        >
          <Image src={GitHubMark} alt="GitHub Mark" width={30} />
          <Image src={GitHubLogo} alt="GitHub Logo" width={100} />
        </a>
      </div>
      <div className="centered-container">
        <p className="github-text">
          <strong>Visit the project's GitHub repo</strong>
        </p>
      </div>
    </>
  );
}
