import BenchmarkTable from "./BenchmarkTable";
import { BenchmarkProps, BenchmarkAPIResponse, BenchmarkData } from "@/typings";

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

  const benchmarks : BenchmarkData = benchmarkData.benchmarks;
  return (
    <>
      <h1>Completed Fetches</h1>
      {benchmarkData.success ? (
        // <ul>
        //   {Object.entries(benchmarkData.benchmarks.GPU).map(([key, value], i) => (
        //     <li key={i}>{key} {value}</li>
        //   ))}
        // </ul>
        <BenchmarkTable benchmarks = {benchmarks} />
      ) : (
        <p>Error fetching benchmarks</p>
      )}
    </>
  );
}
