from django.urls import path
from . import views

urlpatterns = [
    # path('test_get/', views.test_frontend),
    # path('test_post/', views.test_post),
    path('start_price_fetch/', views.start_price_fetch),
    path('get_benchmarks/', views.get_benchmarks),
    path('get_scrape_allowed/', views.get_scrape_allowed),
]