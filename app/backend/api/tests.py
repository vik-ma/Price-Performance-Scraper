from django.test import TestCase
from api.views import valid_cpu_set, valid_gpu_set, validate_price_fetch_request
from api.serializers import FetchPropertiesSerializer


# Create your tests here.
class TestValidPriceFetchRequest(TestCase):
    """ Test cases for validating start_price_fetch POST request body """
    def setUp(self):
        self.cpu_product_list = valid_cpu_set
        self.gpu_product_list = valid_gpu_set
        self.cpu_g_fetch_type = "CPU-Gaming"
        self.cpu_n_fetch_type = "CPU-Normal"
        self.gpu_fetch_type = "GPU"


    def test_valid_products_cpu_g(self):
        for cpu in self.cpu_product_list:
            request = { 
                "fetch_type": self.cpu_g_fetch_type, 
                "product_list": cpu
            }
            serializer = FetchPropertiesSerializer(data=request)
            
            self.assertEqual(True, serializer.is_valid())
    

    def test_valid_products_cpu_n(self):
        for cpu in self.cpu_product_list:
            request = { 
                "fetch_type": self.cpu_n_fetch_type, 
                "product_list": cpu
            }
            serializer = FetchPropertiesSerializer(data=request)
            
            self.assertEqual(True, serializer.is_valid())


    def test_valid_products_gpu(self):
        for gpu in self.gpu_product_list:
            request = { 
                "fetch_type": self.gpu_fetch_type, 
                "product_list": gpu
            }
            serializer = FetchPropertiesSerializer(data=request)
            
            self.assertEqual(True, serializer.is_valid())

