"use client";
import MenuIcon from "./icons/MenuIcon";
import { useState } from "react";
import Link from "next/link";

export default function NavMenu() {
  const [showFullMenu, setShowFullMenu] = useState<boolean>(false);

  return (
    <>
      <button
        className="nav-item-menu"
        onClick={() => setShowFullMenu(!showFullMenu)}
      >
        <MenuIcon />
      </button>
      {showFullMenu && (
        <div className="nav-full-menu-wrapper">
          <ul className="nav-full-menu">
            <Link className="nav-full-menu-item" href="/information">
              <li className="nav-full-menu-list-item">Information</li>
            </Link>
            <Link className="nav-full-menu-item" href="/benchmarks">
              <li className="nav-full-menu-list-item">Current Benchmarks</li>
            </Link>
            <Link className="nav-full-menu-item" href="/manual_comparison">
              <li className="nav-full-menu-list-item">
                Manual Comparison Tool
              </li>
            </Link>
            <Link className="nav-full-menu-item" href="/scrapes">
              <li className="nav-full-menu-list-item">
                Completed Price Scrapes
              </li>
            </Link>
          </ul>
        </div>
      )}
    </>
  );
}
