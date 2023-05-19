from rest_framework import serializers
from .models import FetchProperties
from price_fetcher.models import CompletedFetch, ProductListing

class FetchPropertiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FetchProperties
        fields = '__all__'

class CompletedFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedFetch
        fields = ("product_list", "benchmark_type", "timestamp", "timestamp_id")

class ProductListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductListing
        fields = ("product_category", 
                  "store_name", 
                  "price", 
                  "product_link", 
                  "product_name", 
                  "price_performance_ratio", 
                  "benchmark_value")