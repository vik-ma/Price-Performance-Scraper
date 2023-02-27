from django.db import models

# Create your models here.
class Test(models.Model):
    test_name = models.CharField(max_length=30)
    test_num = models.IntegerField()
    test_date = models.DateField()

class ProductListing(models.Model):
    product_category = models.CharField(max_length=50)
    store_name = models.CharField(max_length=50)
    price = models.IntegerField()
    product_link = models.TextField()
    product_name = models.TextField()
    price_performance_ratio = models.DecimalField(max_digits=5, decimal_places=2)
    benchmark_value = models.DecimalField(max_digits=5, decimal_places=2)
    timestamp_id = models.DateTimeField()

class CompletedFetch(models.Model):
    product_list = models.TextField()
    benchmark_type = models.CharField(max_length=10)
    timestamp = models.DateTimeField()