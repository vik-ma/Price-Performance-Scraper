import BenchmarkTable from "./BenchmarkTable";
import { BenchmarkAPIResponse, BenchmarkData } from "@/typings";
import Link from "next/link";

// Function to fetch Benchmarks from Django API
async function getBenchmarkData(): Promise<BenchmarkAPIResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/get_benchmarks/`,
      {
        // Cache response and revalidate on new request, at most once per 60 seconds
        next: {
          revalidate: 60,
        },
        // Force no caching (For debugging)
        // cache: "no-store",
      }
    );

    return response.json();
  } catch {
    return { success: false };
  }
}

// Function to validate if the fetched Benchmark Data is valid
function isBenchmarkDataValid(data: any) {
  // Benchmark Data has to be a JavaScript Object
  if (typeof data !== "object") {
    return false;
  }

  // Allowed keys in data
  const validKeys: string[] = ["GPU", "CPU-Gaming", "CPU-Normal"];

  // Current keys in data
  const dataKeys: string[] = Object.keys(data);

  // All keys has to match validKeys
  if (
    dataKeys.length !== validKeys.length &&
    dataKeys.every((key) => validKeys.includes(key))
  ) {
    return false;
  }

  for (const dataValue of Object.values(data)) {
    // Loop through all Benchmark Types
    for (const [key, value] of Object.entries(dataValue as string[])) {
      // Loop through every key in Benchmark Type

      // Ignore timestamp key at bottom of Benchmark Type
      if (key === "timestamp") continue;

      // All keys have to be strings and their values a number
      if (typeof key !== "string" || typeof value !== "number") {
        return false;
      }
    }
  }

  // Return true if everything passed
  return true;
}

export default async function Benchmarks() {
  const benchmarkData = await getBenchmarkData();

  const benchmarks: BenchmarkData = benchmarkData.benchmarks!;

  // Check if benchmarkData is valid
  if (!isBenchmarkDataValid(benchmarks)) {
    benchmarkData.success = false;
  }

  return (
    <>
      <h1>
        <span className="page-title">Current Benchmarks</span>
      </h1>
      {benchmarkData.success ? (
        <BenchmarkTable benchmarks={benchmarks} />
      ) : (
        // Show error message if API call failed or benchmarkData is invalid
        <>
          <div className="centered-container">
            <div className="error-msg-container">Error fetching benchmarks</div>
          </div>
          <br />
        </>
      )}
      <div className="benchmark-info-wrapper">
        <p className="benchmark-source-text">
          <em>
            <strong className="bold-white-text">CPU</strong> benchmarks are
            sourced from <strong className="bold-white-text">PassMark</strong>{" "}
            and <strong className="bold-white-text">GPU</strong> benchmarks are
            an aggregate of data from{" "}
            <strong className="bold-white-text">PassMark</strong> and{" "}
            <strong className="bold-white-text">Tom's Hardware</strong>.
          </em>
        </p>
        <h2 className="benchmark-disclaimer-heading">Disclaimers</h2>
        <p className="benchmark-disclaimer-text">
          <em>
            <strong className="bold-white-text">CPU Gaming</strong> benchmarks
            are semi-theoretical and{" "}
            <strong className="bold-white-text">
              not necessarily indicative of actual gaming performance
            </strong>
            , and should be taken with a grain of salt.
          </em>
        </p>
        <br />
        <p className="benchmark-disclaimer-text">
          <em>
            <strong className="bold-white-text">GPUs</strong> of the same model
            come in different 'sub-models' made by various third party
            manufacturers which may differ in performance from each other.{" "}
            <strong className="bold-white-text">
              No comparisons are made between individual sub-models in these
              benchmarks.
            </strong>
          </em>
        </p>
        <br />
        <p className="benchmark-disclaimer-text">
          <em>
            <strong className="bold-white-text">
              Use the{" "}
              <Link
                href="/manual-comparison"
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
