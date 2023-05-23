"use client";
import MenuIcon from "./icons/MenuIcon";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NavMenu() {
  // Boolean useState to show list of items in hamburger menu if true
  const [showFullMenu, setShowFullMenu] = useState<boolean>(false);

  // useRef for hamburger menu button
  const menuIconRef = useRef<HTMLButtonElement>(null!);
  // useRef for list of items in hamburger menu
  const fullMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide hamburger menu items if mouse is clicked anywhere on the screen,
    // except for on the menu icon or on an item in the hamburger menu
    function handleClickOutside(event: MouseEvent): void {
      if (
        fullMenuRef.current &&
        !fullMenuRef.current.contains(event.target as Node) &&
        !menuIconRef.current.contains(event.target as Node)
      ) {
        setShowFullMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    // nav-small-wrapper and entire NavMenu component will only be shown on screens below 1200px width
    <div className="nav-small-wrapper">
      <Link
        className="nav-item nav-item-start nav-item-start-small"
        href="/start-scrape"
      >
        Start Price Scrape
      </Link>
      <div className="nav-item">
        <button
          ref={menuIconRef}
          className="nav-item-menu"
          onClick={() => setShowFullMenu(!showFullMenu)}
        >
          <MenuIcon />
        </button>
        {showFullMenu && (
          <div ref={fullMenuRef} className="nav-full-menu-wrapper">
            <ul className="nav-full-menu">
              <Link
                className="nav-full-menu-item"
                href="/information"
                // Hide menu if an item is clicked on
                onClick={() => setShowFullMenu(false)}
              >
                <li className="nav-full-menu-list-item">Information</li>
              </Link>
              <Link
                className="nav-full-menu-item"
                href="/benchmarks"
                onClick={() => setShowFullMenu(false)}
              >
                <li className="nav-full-menu-list-item">Current Benchmarks</li>
              </Link>
              <Link
                className="nav-full-menu-item"
                href="/manual-comparison"
                onClick={() => setShowFullMenu(false)}
              >
                <li className="nav-full-menu-list-item">
                  Manual Comparison Tool
                </li>
              </Link>
              <Link
                className="nav-full-menu-item"
                href="/scrapes"
                onClick={() => setShowFullMenu(false)}
              >
                <li className="nav-full-menu-list-item">
                  Completed Price Scrapes
                </li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
