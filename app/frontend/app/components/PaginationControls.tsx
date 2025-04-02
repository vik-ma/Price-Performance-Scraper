"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePaginationRange } from "./UsePaginationRange";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  maxPages: number;
  totalCount: number;
  pageSize: number;
}

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  maxPages,
  totalCount,
  pageSize,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") ?? "1";

  const currentPage = Number(page);
  const siblingCount: number = 1;

  // Create array for pagination range
  const paginationRange = usePaginationRange({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });

  return (
    <div className="scrape-pagination-container">
      <button
        className="pagination-button pagination-page-display-small"
        disabled={Number(page) === 1}
        onClick={() => {
          router.push(`/scrapes/?page=${1}`);
        }}
      >
        &laquo;
      </button>
      <button
        className="pagination-button"
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`/scrapes/?page=${Number(page) - 1}`);
        }}
      >
        &lt;
      </button>
      <div className="pagination-page-display">
        {paginationRange?.map((index, i) => {
          return (
            <button
              key={`pagination-range-button-${i}`}
              className={
                index === Number(page)
                  ? "pagination-button pagination-button-current"
                  : "pagination-button"
              }
              onClick={() => {
                router.push(`/scrapes/?page=${index}`);
              }}
              // Disable button if there should be dots instead
              disabled={index === 0}
            >
              {/* Replace 0 with ... */}
              {index === 0 ? "..." : `${index}`}
            </button>
          );
        })}
      </div>
      <div className="pagination-page-display-small">
        Page {page} / {maxPages}
      </div>
      <button
        className="pagination-button"
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`/scrapes/?page=${Number(page) + 1}`);
        }}
      >
        &gt;
      </button>
      <button
        className="pagination-button pagination-page-display-small"
        disabled={Number(page) === maxPages}
        onClick={() => {
          router.push(`/scrapes/?page=${maxPages}`);
        }}
      >
        &raquo;
      </button>
    </div>
  );
}
