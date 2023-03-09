import FetchesList from "./FetchesList";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container">
      <div className="sidebar">
      <Link href="/fetches"><h4>View Full List</h4></Link>
        {/* @ts-ignore */}
        <FetchesList />
      </div>
      <div>{children}</div>
    </main>
  );
}
