import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/new">New</Link>
      <Link href="/benchmarks">Current Benchmarks</Link>
      <Link href="/fetches">Completed Price Fetches</Link>
    </nav>
  );
}
