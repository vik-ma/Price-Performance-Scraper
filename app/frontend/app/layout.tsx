import Navbar from "./Navbar";
import "@picocss/pico/css/pico.min.css";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Price/Performance Scraper",
  description: "Compare the Price/Performance Score of different GPUs and CPUs presently on the market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Navbar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
