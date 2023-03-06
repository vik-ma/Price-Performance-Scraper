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