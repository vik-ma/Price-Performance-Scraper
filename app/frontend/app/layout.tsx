import Navbar from "./components/Navbar";
import "@picocss/pico/css/pico.min.css";
import "./globals.css";
import { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Price/Performance Scraper",
  description:
    "Compare the Price/Performance Score of different GPUs and CPUs presently on the market",
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
        <main className="container">
          <noscript>
            <div className="centered-container noscript-container">
              <div className="error-msg-container">
                Enable JavaScript to unlock full functionality of the site
              </div>
            </div>
          </noscript>
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  );
}
