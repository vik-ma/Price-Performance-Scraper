import React from "react";
import Link from "next/link";
import HomeIcon from "./icons/HomeIcon";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="nav-items-wrapper container">
        <Link className="nav-item" id="home-icon" href="/"><HomeIcon /></Link>
        <Link className="nav-item" href="/start_scrape">Start Price Scrape</Link>
        <Link className="nav-item" href="/information">Information</Link>
        <Link className="nav-item" href="/benchmarks">Current Benchmarks</Link>
        <Link className="nav-item" href="/manual_comparison">Manual Comparison Tool</Link>
        <Link className="nav-item" href="/scrapes">Completed Price Scrapes</Link>
      </div>
    </nav>
  );
}
