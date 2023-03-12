from django.urls import path
from . import views

urlpatterns = [
    path('test_frontend/', views.test_frontend),
    path('test_post/', views.test_post),
    path('start_price_fetch/', views.start_price_fetch),
    path('get_benchmarks/', views.get_benchmarks)
]