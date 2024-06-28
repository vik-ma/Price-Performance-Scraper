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
          <span className="title-gradient">Completed Scrapes</span>
        </h1>
        <Link
          className="dark-button view-all-scrapes-button no-underscore"
          href="/scrapes"
        >
          <strong>View All Scrapes</strong>
        </Link>
      </div>
      <div className="sidebar">
        <div className="sidebar-title-container">
          <h4 className="sidebar-title">Last 20 Scrapes</h4>
          <Link
            className="sidebar-full-list-button no-underscore"
            href="/scrapes"
          >
            View Full List
          </Link>
        </div>
        {/* @ts-ignore */}
        <ScrapesList />
      </div>
      <div className="scrape-content-wrapper">{children}</div>
    </>
  );
}
