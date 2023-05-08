from django.db import models


class ProductListing(models.Model):
    """
    Stores information about one specific Product Listing from a Price Scrape.

        product_category: Name of the product model. (Not GPU sub-models)

        store_name: Name of the store of the Product Listing.

        price: Listed price of the product. (Excluding shipping)

        product_link: URL to the listed product on the store.

        product_name: Name of the product as listed on the store.

        price_performance_ratio: Calculated Price/Performance score of the
                                 Product Listing.
        
        benchmark_value: The Benchmark Value of the product model at the
                         time of Price Scrape.
        
        timestamp_id: String ID to relate a ProductListing to a CompletedFetch
                      entry in order to fetch Product Listings from a specific
                      Price Scrape.

    """
    product_category = models.CharField(max_length=50)
    store_name = models.CharField(max_length=50)
    price = models.IntegerField()
    product_link = models.TextField()
    product_name = models.TextField()
    price_performance_ratio = models.DecimalField(max_digits=5, decimal_places=2)
    benchmark_value = models.DecimalField(max_digits=5, decimal_places=2)
    timestamp_id = models.CharField(max_length=26)

class CompletedFetch(models.Model):
    """
    Stores meta information about a completed Price Scrape.

        product_list: List of product models used in Price Scrape, separated by commas.

        benchmark_type: Type of benchmark to compare.
                        Must be either "GPU", "CPU-Gaming" or "CPU-Normal".

        timestamp: Timestamp of when Price Scrape was completed.

        timestamp_id: String ID of timestamp to relate a CompletedFetch to a 
                      ProductListing entry. Every ProductListing from a specific
                      Price Scrape will get assigned the same timestamp_id.
    """
    product_list = models.TextField()
    benchmark_type = models.CharField(max_length=10)
    timestamp = models.DateTimeField()
    timestamp_id = models.CharField(max_length=26)