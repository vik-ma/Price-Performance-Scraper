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
        fields = '__all__'

class ProductListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductListing
        fields = '__all__'