from django.urls import path
from graphene_django.views import GraphQLView
from . import views
from price_fetcher.schema import schema
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('test_list/', views.list_test_items),
    path('insert_test/', views.insert_test_item, name='insert_test_item'),
    path('delete_test/<int:test_id>/', views.delete_test_item, name='delete_test_item'),
    path('test_button/', views.test_button, name='test_button'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
]