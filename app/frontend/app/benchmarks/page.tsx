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
        <h2>Disclaimers</h2>
        <p>
          <em>
            <strong>CPU Gaming</strong> benchmarks are semi-theoretical and{" "}
            <strong>
              not necessarily indicative of actual gaming performance
            </strong>
            , and should be taken with a grain of salt.
          </em>
        </p>
        <br />
        <p>
          <em>
            <strong>GPUs</strong> of the same model come in different
            'sub-models' made by various third party manufacturers which may
            differ in performance from each other.{" "}
            <strong>
              No comparisons are made between individual sub-models in these
              benchmarks.
            </strong>
          </em>
        </p>
        <br />
        <p><em>
          <strong>
            Use the Manual Comparison tool to calculate Price-to-Performance
            using custom benchmark values.
          </strong></em>
        </p>
        {/* TODO: ADD LINK */}
      </div>
    </>
  );
}
