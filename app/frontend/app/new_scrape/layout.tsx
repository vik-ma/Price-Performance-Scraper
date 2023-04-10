import { NewScrapeContextProvider } from "../context/NewScrapeContext";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start New Price Scrape',
};

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
