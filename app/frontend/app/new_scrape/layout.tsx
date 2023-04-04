import { NewScrapeContextProvider } from "../context/NewScrapeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NewScrapeContextProvider>{children}</NewScrapeContextProvider>
    </>
  );
}
