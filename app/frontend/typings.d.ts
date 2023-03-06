export type CompletedFetchProps = {
    productList: string;
    benchmarkType: string;
    timestamp: string;
    timestampId: string;
  };

export type ProductListings = {
    productCategory: string;
    storeName: string;
    price: number;
    productLink: string;
    productName: string;
    pricePerformanceRatio: number;
    benchmarkValue: number;
    timestampId: string;
  };