from django.urls import path
from graphene_django.views import GraphQLView
from . import views
from .schema import schema
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    # path('test_get/', views.test_frontend),   # Test GET request for debugging purposes
    # path('test_post/', views.test_post),      # Test POST request for debugging purposes
    path('start_price_fetch/', views.start_price_fetch),
    path('get_benchmarks/', views.get_benchmarks),
    path('get_scrape_allowed/', views.get_scrape_allowed),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=False, schema=schema))),
]