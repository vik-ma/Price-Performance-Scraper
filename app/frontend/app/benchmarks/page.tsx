import BenchmarkTable from "./BenchmarkTable";
import { BenchmarkAPIResponse, BenchmarkData } from "@/typings";

async function getBenchmarkData(): Promise<BenchmarkAPIResponse> {
  const response = await fetch(
    `${process.env.DJANGO_API_URL}/get_benchmarks/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export default async function Benchmarks() {
  const benchmarkData = await getBenchmarkData();

  const benchmarks: BenchmarkData = benchmarkData.benchmarks;
  return (
    <>
      <h1>Current Benchmarks</h1>
      {benchmarkData.success ? (
        <BenchmarkTable benchmarks={benchmarks} />
      ) : (
        <>
          <br />
          <h2 className="centered-container">Error fetching benchmarks</h2>
        </>
      )}
      <div className="benchmark-info-wrapper">
        <h2>Disclaimer</h2>
      </div>
    </>
  );
}
