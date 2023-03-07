from django.urls import path
from . import views

urlpatterns = [
    path('', views.start_price_fetch),
    path('test_frontend/', views.test_frontend),
]