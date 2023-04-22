import ScrapesList from "./ScrapesList";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Past Price Scrapes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="page-title completed-scrapes-title">Completed Scrapes</h1>
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
      <div className="fetch-content-wrapper">{children}</div>
    </>
  );
}
