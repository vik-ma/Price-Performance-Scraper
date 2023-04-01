import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/new_scrape">New Scrape</Link>
      <Link href="/information">Information</Link>
      <Link href="/benchmarks">Current Benchmarks</Link>
      <Link href="/manual_comparison">Manual Comparison Tool</Link>
      <Link href="/scrapes">Completed Price Scrapes</Link>
    </nav>
  );
}
