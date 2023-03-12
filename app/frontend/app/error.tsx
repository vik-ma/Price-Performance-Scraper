"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <div className="centered-container">
        <h1>Something went wrong!</h1>
      </div>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
