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