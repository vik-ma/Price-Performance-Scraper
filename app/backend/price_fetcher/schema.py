import graphene
from graphene_django.types import DjangoObjectType
from .models import ProductListing, CompletedFetch


class CompletedFetchType(DjangoObjectType):
    class Meta:
        model = CompletedFetch
        fields = ("product_list", "benchmark_type", "timestamp")

class Query(graphene.ObjectType):
    all_completed_fetches = graphene.List(CompletedFetchType)

    def resolve_all_completed_fetches(self, info, **kwargs):
        return CompletedFetch.objects.all()

schema = graphene.Schema(query=Query)