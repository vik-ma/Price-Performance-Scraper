from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.start_price_fetch),
    path('test_frontend/', views.test_frontend),
    path('test_post/', views.test_post),
]