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

  const pagesArray: number[] = Array.from(
    { length: maxPages },
    (_, index) => index + 1
  );

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
        {pagesArray.map((index) => {
          return (
            <button
              className={
                index === Number(page)
                  ? "pagination-button pagination-button-current"
                  : "pagination-button"
              }
              onClick={() => {
                router.push(`/scrapes/?page=${index}`);
              }}
            >
              {index}
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
