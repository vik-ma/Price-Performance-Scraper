from django.test import TestCase
from api.views import valid_cpu_set, valid_gpu_set, validate_price_fetch_request
from api.serializers import FetchPropertiesSerializer
from rest_framework import serializers

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


    def test_valid_requests(self):
        request_cpu_g = { 
            "fetch_type": self.cpu_g_fetch_type, 
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        request_cpu_n = { 
            "fetch_type": self.cpu_n_fetch_type, 
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        request_gpu = { 
            "fetch_type": self.gpu_fetch_type, 
            "product_list": "GeForce RTX 4090"
        }
        requests = [request_cpu_g, request_cpu_n, request_gpu]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            self.assertEqual(True, serializer.is_valid())

    
    def test_invalid_fetch_types(self):
        request_wrong_name = {
            "fetch_type": "", 
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        request_wrong_type = {
            "fetch_type": ["CPU-Gaming"], 
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        requests = [request_wrong_name, request_wrong_type]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            self.assertNotEqual(True, serializer.is_valid())


    def test_mismatched_products_and_fetch_type(self):
        request_gpu_fetch_cpu_product = {
            "fetch_type": self.gpu_fetch_type, 
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        request_cpu_fetch_gpu_product = {
            "fetch_type": self.cpu_n_fetch_type, 
            "product_list": "GeForce RTX 4090"
        }
        requests = [request_cpu_fetch_gpu_product, request_gpu_fetch_cpu_product]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            with self.assertRaises(serializers.ValidationError):
                if serializer.is_valid():
                    validate_price_fetch_request(serializer.data)