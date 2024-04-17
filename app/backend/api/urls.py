from django.urls import path
from . import views
# from .schema import schema                            # For GraphQL
# from graphene_django.views import GraphQLView         # For GraphQL
# from django.views.decorators.csrf import csrf_exempt  # For GraphQL

urlpatterns = [
    # path('test_get/', views.test_frontend),   # Test GET request for debugging purposes
    # path('test_post/', views.test_post),      # Test POST request for debugging purposes
    # path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=False, schema=schema))), # GraphQL is not currently used
    # path('start_price_fetch/', views.start_price_fetch),
    # path('get_benchmarks/', views.get_benchmarks),
    # path('get_scrape_allowed/', views.get_scrape_allowed),
    # path('get_all_completed_fetches/', views.get_all_completed_fetches),
    # path('get_completed_fetch_by_timestamp_id/<timestamp_id>/', views.get_completed_fetch_by_timestamp_id),
    # path('get_product_listings_from_timestamp_id/<timestamp_id>/', views.get_product_listings_from_timestamp_id),
]