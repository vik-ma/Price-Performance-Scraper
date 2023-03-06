import Image from "next/image";
import { Inter } from "next/font/google";
// import styles from "./page.module.css";
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });

type TestApiProps = {
  message: string;
};



async function getApiData(): Promise<TestApiProps> {
  const res = await fetch(`${process.env.DJANGO_API_URL}/test_frontend/`, {
    cache: "no-store",
  });

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
        <p>API Test: {apiData.message}</p>

        <div className="padding-top: 3em">
          <Link href="/fetches">View Completed Fetches</Link>
        </div>
      </div>
    </main>
  );
}
