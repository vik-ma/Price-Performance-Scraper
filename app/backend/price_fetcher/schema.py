import graphene
from graphene_django.types import DjangoObjectType
from .models import ProductListing, CompletedFetch


class CompletedFetchType(DjangoObjectType):
    class Meta:
        model = CompletedFetch
        fields = ("product_list", "benchmark_type", "timestamp", "timestamp_id")

class ProductListing(DjangoObjectType):
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
    all_product_listings = graphene.List(ProductListing, id = graphene.String())

    def resolve_all_completed_fetches(self, info):
        return CompletedFetch.objects.all()
    
    def resolve_all_product_listings(self, info, id):
        return ProductListing.objects.filter(timestamp_id = id)

schema = graphene.Schema(query=Query)