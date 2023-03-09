import FetchesList from "./FetchesList";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container">
      <div className="sidebar">
        <h4>Last fetches</h4>
        {/* @ts-ignore */}
        <FetchesList />
      </div>
      <div>{children}</div>
    </main>
  );
}
