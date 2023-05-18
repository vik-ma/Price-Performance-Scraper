import graphene
from graphene_django.types import DjangoObjectType
from price_fetcher.models import ProductListing, CompletedFetch


class CompletedFetchType(DjangoObjectType):
    class Meta:
        model = CompletedFetch
        fields = ("product_list", "benchmark_type", "timestamp", "timestamp_id")

class ProductListingType(DjangoObjectType):
    class Meta:
        model = ProductListing
        fields = (
            "product_category", 
            "store_name", 
            "price", 
            "product_link", 
            "product_name", 
            "price_performance_ratio", 
            "benchmark_value", 
            "timestamp_id"
            )

class Query(graphene.ObjectType):
    all_completed_fetches = graphene.List(CompletedFetchType)
    product_listings = graphene.List(ProductListingType, timestamp_id = graphene.String(required=True))
    completed_fetch_by_id = graphene.List(CompletedFetchType, timestamp_id = graphene.String(required=True))

    def resolve_all_completed_fetches(self, info):
        """Return list of meta info for all Completed Price Scrapes."""
        return CompletedFetch.objects.all()

    def resolve_completed_fetch_by_id(self, info, timestamp_id):
        """Return meta info for Completed Price Scrape with specific timestamp_id."""
        return CompletedFetch.objects.filter(timestamp_id = timestamp_id)
    
    def resolve_product_listings(self, info, timestamp_id):
        """Return list of all Product Listings with specific timestamp_id."""
        return ProductListing.objects.filter(timestamp_id = timestamp_id).order_by('id')

schema = graphene.Schema(query=Query)