import ScrapesList from "./ScrapesList";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container">
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
      <div>{children}</div>
    </main>
  );
}