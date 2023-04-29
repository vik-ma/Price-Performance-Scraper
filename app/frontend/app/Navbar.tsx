import React from "react";
import Link from "next/link";
import HomeIcon from "./icons/HomeIcon";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="nav-items-wrapper container">
        <Link className="nav-item" id="home-icon" href="/">
          <HomeIcon /> 
        </Link>
        {/* nav-item-extended elements are only shown on screens wider than 1200px*/}
        <Link
          className="nav-item nav-item-extended nav-item-start"
          href="/start_scrape"
        >
          Start Price Scrape
        </Link>
        <Link className="nav-item nav-item-extended" href="/information">
          Information
        </Link>
        <Link className="nav-item nav-item-extended" href="/benchmarks">
          Current Benchmarks
        </Link>
        <Link className="nav-item nav-item-extended" href="/manual_comparison">
          Manual Comparison Tool
        </Link>
        <Link className="nav-item nav-item-extended" href="/scrapes">
          Completed Price Scrapes
        </Link>
        <NavMenu />
      </div>
    </nav>
  );
}
