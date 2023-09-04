from django.test import TestCase, Client
from api.views import VALID_CPU_SET, VALID_GPU_SET, validate_price_fetch_request, start_price_fetch, ScrapeThrottle
from api.serializers import FetchPropertiesSerializer
from rest_framework import serializers, status
from django.http import HttpRequest
import json

# Create your tests here.
class TestValidPriceFetchRequest(TestCase):
    """ Test cases for validating start_price_fetch POST request body """
    def setUp(self):
        self.cpu_product_list = VALID_CPU_SET
        self.gpu_product_list = VALID_GPU_SET
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


    def test_invalid_product_list_items(self):
        request_one_wrong_cpu = {
            "fetch_type": self.cpu_g_fetch_type,
            "product_list": "AMD Ryzen 9 7950X3D,GeForce RTX 4090"
        }
        request_one_wrong_gpu = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": "AMD Ryzen 9 7950X3D,GeForce RTX 4090"
        }
        request_space_in_product_list = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": "GeForce RTX 4090, GeForce RTX 4080"
        }
        requests = [request_one_wrong_cpu, request_one_wrong_gpu, request_space_in_product_list]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            with self.assertRaises(serializers.ValidationError):
                if serializer.is_valid():
                    validate_price_fetch_request(serializer.data)


    def test_empty_product_list(self):
        request_empty_gpus = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": ""
        }
        request_empty_cpus = {
            "fetch_type": self.cpu_g_fetch_type,
            "product_list": ""
        }
        requests = [request_empty_gpus, request_empty_cpus]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            self.assertNotEqual(True, serializer.is_valid())


    def test_invalid_product_list_type(self):
        request_wrong_type = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": ["GeForce RTX 4090", "GeForce RTX 4080"]
        }
        serializer = FetchPropertiesSerializer(data=request_wrong_type)
        self.assertNotEqual(True, serializer.is_valid())


    def test_invalid_product_list_string(self):
        request_too_many_commas = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": "GeForce RTX 4090,GeForce RTX 4080,"
        }
        request_no_commas = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": "GeForce RTX 4090GeForce RTX 4080"
        }
        requests = [request_too_many_commas, request_no_commas]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            with self.assertRaises(serializers.ValidationError):
                if serializer.is_valid():
                    validate_price_fetch_request(serializer.data)


    def test_too_many_product_list_num_items(self):
        # Current limit is 3 GPUs per scrape, change this if limit changes
        request_4_gpus = {
            "fetch_type": self.gpu_fetch_type,
            "product_list": "GeForce RTX 4090,GeForce RTX 4080,Radeon RX 7900 XTX,GeForce RTX 4070 Ti"
        }
        # Current limit is 7 CPUs per scrape, change this if limit changes
        request_8_cpus = {
            "fetch_type": self.cpu_g_fetch_type,
            "product_list":"AMD Ryzen 9 7950X3D,AMD Ryzen 9 7900X3D,AMD Ryzen 7 7800X3D,AMD Ryzen 9 5950X,AMD Ryzen 9 5900X,AMD Ryzen 7 5800X,AMD Ryzen 7 5800X3D,AMD Ryzen 7 5700X"
        }
        requests = [request_4_gpus, request_8_cpus]
        for request in requests:
            serializer = FetchPropertiesSerializer(data=request)
            with self.assertRaises(serializers.ValidationError):
                if serializer.is_valid():
                    validate_price_fetch_request(serializer.data)


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


class TestStartPriceFetchStatusCodes(TestCase):
    def setUp(self):
        self.cpu_g_fetch_type = "CPU-Gaming"
        self.cpu_n_fetch_type = "CPU-Normal"
        self.gpu_fetch_type = "GPU"
        self.client = Client()


    def test_invalid_start_price_fetch_request_status_code(self):
        invalid_cpu_request = {
            "fetch_type": self.cpu_g_fetch_type,
            "product_list": "GeForce RTX 4090"
        }
        url = '/api/start_price_fetch/'
        response = self.client.post(url, data=invalid_cpu_request)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)


    def test_valid_start_price_fetch_request_status_code(self):
        valid_cpu_request = {
            "fetch_type": "CPU-Gaming",
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        url = '/api/start_price_fetch/'
        response = self.client.post(url, data=valid_cpu_request)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)


    def test_valid_start_price_fetch_request_status_code_cooldown(self):
        valid_cpu_request = {
            "fetch_type": "CPU-Gaming",
            "product_list": "AMD Ryzen 9 7950X3D"
        }
        url = '/api/start_price_fetch/'
        response = self.client.post(url, data=valid_cpu_request)
        response_2 = self.client.post(url, data=valid_cpu_request)
        self.assertEqual(status.HTTP_503_SERVICE_UNAVAILABLE, response_2.status_code)
    

class TestScrapeThrottle(TestCase):
    def setUp(self):
        self.cpu_g_fetch_type = "CPU-Gaming"
        self.cpu_n_fetch_type = "CPU-Normal"
        self.gpu_fetch_type = "GPU"


    def test_valid_allow_request(self):
        scrape_throttle = ScrapeThrottle()
        allowed = scrape_throttle.allow_request()
        self.assertEqual(True, allowed)
    

    def test_invalid_allow_request(self):
        scrape_throttle = ScrapeThrottle()
        scrape_throttle.set_new_time()
        allowed = scrape_throttle.allow_request()
        self.assertNotEqual(True, allowed)