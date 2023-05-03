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
    <main>
      <div className="centered-container">
        <h1>Something went wrong!</h1>
      </div>
      {/* Button to refresh page */}
      <button className="error-button" onClick={() => reset()}>
        <strong>Try again</strong>
      </button>
    </main>
  );
}
