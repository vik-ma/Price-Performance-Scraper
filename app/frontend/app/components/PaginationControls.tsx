"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  maxPages: number;
}

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  maxPages,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") ?? "1";

  return (
    <div className="scrape-pagination-container">
      <button
        className="pagination-button"
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`/scrapes/?page=${Number(page) - 1}`);
        }}
      >
        Prev
      </button>
      <div className="pagination-page-display">
        {page} / {maxPages}
      </div>
      <button
        className="pagination-button"
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`/scrapes/?page=${Number(page) + 1}`);
        }}
      >
        Next
      </button>
    </div>
  );
}
