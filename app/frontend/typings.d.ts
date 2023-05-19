export type CompletedFetchProps = {
    product_list: string;
    benchmark_type: string;
    timestamp: string;
    timestamp_id: string;
  };

export type ProductListingsProps = {
    product_category: string;
    store_name: string;
    price: number;
    product_link: string;
    product_name: string;
    price_performance_ratio: number;
    benchmark_value: number;
  };

export type FetchPageProps = {
  params: {
  fetchInfo: CompletedFetchProps;
  productListings: ProductListingsProps[];
  }
};

export type ProductTableSortProps = {
  SortKey: keyof ProductListingsProps;
  SortDirection: "asc" | "desc";
};

export type TableHeadingProps = {
  Label: string;
  Key: keyof ProductListingsProps;
  TooltipText: string;
  TooltipPlacement: string;
};

export interface BenchmarkProps {
  [key: string]: { [key: string]: number | string };
}

export interface BenchmarkData {
  "GPU": BenchmarkProps;
  "CPU-Gaming": BenchmarkProps;
  "CPU-Normal": BenchmarkProps;
}

export interface BenchmarkAPIResponse {
  success: boolean;
  benchmarks?: Benchmarks;
}

export interface BenchmarksDataProps {
  benchmarks: BenchmarkData;
}

export type GpuInfoProps = {
  [key: string]: {
    tier: string;
    manufacturer: string;
  };
};

export type CpuInfoProps = {
  [key: string]: {
    gamingTier: string;
    normalTier: string;
    generation: string;
    manufacturer: string;
    socket: string;
  };
};

export interface NumberMap {
  [key: string]: number;
}

export type ScrapeType = {
  name: "GPU" | "CPU-Gaming" | "CPU-Normal";
}

export interface FetchTypeProps {
  [key: string]: {
    title: string;
    cssNameText: string;
    cssNameBorder?: string;
  };
}

export interface ScrapeAllowedAPIResponse {
  success: boolean;
  allow?: boolean;
  seconds_left?: number;
}