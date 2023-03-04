import Image from "next/image";
import { Inter } from "next/font/google";
// import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

async function getApiData() {
  const res = await fetch("http://localhost:8000/api/test_frontend/");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {

  const apiData = await getApiData();

  return (
    <main>
      <div>
        <h1>Home</h1>
        <p>APIasdasdsa Test: {apiData.data}</p>
        <div className="padding-top: 3em">
          <Link href="/fetches">View Completed Fetches</Link>
        </div>
      </div>
    </main>
  );
}
