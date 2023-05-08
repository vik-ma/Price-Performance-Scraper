from django.db import models


class FetchProperties(models.Model):
    """
    Stores information about a request to start a Price Scrape.

        product_list: List of product models to be Price Scraped,
                      with each model separated by a comma.

        fetch_type: Type of benchmark to compare.
                    Must be either "GPU", "CPU-Gaming" or "CPU-Normal".
    """
    product_list = models.TextField()
    fetch_type = models.CharField(max_length=10)