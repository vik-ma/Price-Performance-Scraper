from django.urls import path
from graphene_django.views import GraphQLView
from . import views
from price_fetcher.schema import schema
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    # path('test_button/', views.test_button, name='test_button'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=False, schema=schema))),
]