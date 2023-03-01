from django.db import models

# Create your models here.

class FetchProperties(models.Model):
    product_list = models.TextField()
    fetch_type = models.CharField(max_length=10)