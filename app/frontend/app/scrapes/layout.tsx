import ScrapesList from "./ScrapesList";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Past Price Scrapes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="scrapes-header-wrapper">
        <h1 className="completed-scrapes-title">
          <span className="page-title">Completed Scrapes</span>
        </h1>
        <Link href="/scrapes">
          <button className="dark-button view-all-scrapes-button">
            <strong>View All Scrapes</strong>
          </button>
        </Link>
      </div>
      <div className="sidebar">
        <div className="sidebar-title-container">
          <h4 className="sidebar-title">Past Scrapes</h4>
          <Link className="sidebar-link" href="/scrapes">
            <button className="sidebar-full-list-button">
              <strong>View Full List</strong>
            </button>
          </Link>
        </div>
        {/* @ts-ignore */}
        <ScrapesList />
      </div>
      <div className="scrape-content-wrapper">{children}</div>
    </>
  );
}
