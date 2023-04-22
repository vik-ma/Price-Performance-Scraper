"use client";
import MenuIcon from "./icons/MenuIcon";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NavMenu() {
  const [showFullMenu, setShowFullMenu] = useState<boolean>(false);
  const menuIconRef = useRef<HTMLButtonElement>(null!);
  const fullMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <div className="nav-small-wrapper">
      <Link
        className="nav-item nav-item-start nav-item-start-small"
        href="/start_scrape"
        // onClick={() => setShowFullMenu(false)}
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
                href="/manual_comparison"
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
