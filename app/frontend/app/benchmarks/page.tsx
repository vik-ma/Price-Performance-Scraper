import BenchmarkTable from "./BenchmarkTable";
import { BenchmarkAPIResponse, BenchmarkData } from "@/typings";
import Link from "next/link";

async function getBenchmarkData(): Promise<BenchmarkAPIResponse> {
  try {
    const response = await fetch(
      `${process.env.DJANGO_API_URL}/get_benchmarks/`,
      {
        cache: "no-store",
      }
    );

    return response.json();
  } catch {
    return { success: false };
  }
}

export default async function Benchmarks() {
  const benchmarkData = await getBenchmarkData();

  const benchmarks: BenchmarkData = benchmarkData.benchmarks;
  return (
    <>
      <h1 className="page-title">Current Benchmarks</h1>
      {benchmarkData.success ? (
        <BenchmarkTable benchmarks={benchmarks} />
      ) : (
        <div className="centered-container">
          <div className="error-msg-container">
            <h3 className="error-msg-heading">Error fetching benchmarks</h3>
          </div>
        </div>
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
        <p>
          <em>
            <strong>
              Use the{" "}
              <Link
                href="/manual_comparison"
                className="internal-link-color"
                target="_blank"
              >
                Manual Comparison Tool
              </Link>{" "}
              to calculate Price-to-Performance using custom benchmark values.
            </strong>
          </em>
        </p>
      </div>
    </>
  );
}
