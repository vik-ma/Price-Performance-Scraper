"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // Don't console log error in prod
  // useEffect(() => {
  //   console.error(error);
  // }, [error]);

  return (
    <div className="scrape-content centered-container">
      <div className="">
        <h1>Something went wrong!</h1>
        {/* Button to refresh page */}
        <button className="error-button" onClick={() => reset()}>
          <strong>Try again</strong>
        </button>
      </div>
    </div>
  );
}
