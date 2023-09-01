"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  numScrapes: number;
}

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  numScrapes,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const scrapes_per_page: number = 18;

  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`/scrapes/?page=${Number(page) - 1}`);
        }}
      >
        prev page
      </button>

      <div>
        {page} / {Math.ceil(numScrapes / scrapes_per_page)}
      </div>

      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`/scrapes/?page=${Number(page) + 1}`);
        }}
      >
        next page
      </button>
    </div>
  );
}
