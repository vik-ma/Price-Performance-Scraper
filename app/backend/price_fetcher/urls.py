from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # URLs to buttons in pps_dashboard
    # path('test_button_cpu_g/', views.test_button_cpu_g, name='test_button_cpu_g'),
    # path('test_button_cpu_n/', views.test_button_cpu_n, name='test_button_cpu_n'),
    # path('test_button_gpu/', views.test_button_gpu, name='test_button_gpu'),
    # path('test_button_benchmarks/', views.test_button_benchmarks, name='test_button_benchmarks'),
    # path('test_button_scrape/', views.test_button_scrape, name='test_button_scrape'),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
