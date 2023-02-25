from django.urls import path
from . import views

urlpatterns = [
    path('test_list/', views.list_test_items),
    path('insert_test/', views.insert_test_item, name='insert_test_item'),
    path('delete_test/<int:test_id>/', views.delete_test_item, name='delete_test_item'),
]