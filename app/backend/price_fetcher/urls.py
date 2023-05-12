from django.urls import path
from graphene_django.views import GraphQLView
from . import views
from price_fetcher.schema import schema
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    # Test buttons in test_template for debugging purposes
    path('test_button_cpu_g/', views.test_button_cpu_g, name='test_button_cpu_g'),
    path('test_button_cpu_n/', views.test_button_cpu_n, name='test_button_cpu_n'),
    path('test_button_gpu/', views.test_button_gpu, name='test_button_gpu'),
    path('test_button_benchmarks/', views.test_button_benchmarks, name='test_button_benchmarks'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=False, schema=schema))),
]