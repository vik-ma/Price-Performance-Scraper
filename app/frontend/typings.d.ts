export type CompletedFetchProps = {
    productList: string;
    benchmarkType: string;
    timestamp: string;
    timestampId: string;
  };

export type ProductListingsProps = {
    productCategory: string;
    storeName: string;
    price: number;
    productLink: string;
    productName: string;
    pricePerformanceRatio: number;
    benchmarkValue: number;
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
  Tooltip: string;
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
    cssName: string;
  };
};

export type CpuInfoProps = {
  [key: string]: {
    gamingTier: string;
    normalTier: string;
    generation: string;
    manufacturer: string;
    socket: string;
    cssName: string;
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