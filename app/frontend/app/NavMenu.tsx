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
            <li className="nav-full-menu-item">
              <Link href="/information">Information</Link>
            </li>
            <li className="nav-full-menu-item">
              <Link href="/benchmarks">Current Benchmarks</Link>
            </li>
            <li className="nav-full-menu-item">
              <Link href="/manual_comparison">Manual Comparison Tool</Link>
            </li>
            <li className="nav-full-menu-item">
              <Link href="/scrapes">Completed Price Scrapes</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
