from django.shortcuts import redirect
from django.http import HttpRequest
from .models import ProductListing, CompletedFetch
from . import prj_fetcher as pf
from . import benchmark_scraper as bm
from django.utils import timezone

# Create your views here.
def test_button(request:HttpRequest):
    pass

    return redirect('/price_fetcher/test_list')

def get_current_timestamp():
    return timezone.now()

def create_completed_fetch(product_list, benchmark_type, timestamp, timestamp_id):
    completed_fetch = CompletedFetch()
    completed_fetch.product_list = product_list
    completed_fetch.benchmark_type = benchmark_type
    completed_fetch.timestamp = timestamp
    completed_fetch.timestamp_id = timestamp_id
    completed_fetch.save()

def start_price_fetching(data):
    fetch_type = data["fetch_type"]
    products_to_fetch = data["product_list"].split(",")

    if fetch_type == "GPU":
        fetched_prices = pf.start_price_fetching_gpu(products_to_fetch)
    elif fetch_type == "CPU-Gaming" or fetch_type == "CPU-Normal":
        fetched_prices = pf.start_price_fetching_cpu(fetch_type, products_to_fetch)

    if type(fetched_prices) == Exception:
        return {"success": False, "message": str(fetched_prices)}

    current_timestamp = get_current_timestamp()
    print(current_timestamp)
    timestamp_id = (''.join(i for i in str(current_timestamp) if i.isdigit()))
    product_list = data["product_list"].replace(",", ", ")

    try:
        for listing in fetched_prices:
            product_listing = ProductListing()
            product_listing.product_category = listing[0]
            product_listing.store_name = listing[1]
            product_listing.price = listing[2]
            product_listing.product_link = listing[3]
            product_listing.product_name = listing[4]
            product_listing.benchmark_value = listing[5]
            product_listing.price_performance_ratio = listing[6]
            product_listing.timestamp_id = timestamp_id
            product_listing.save()

        create_completed_fetch(product_list, fetch_type, current_timestamp, timestamp_id)
    except:
        return Exception("Error adding price fetch to database")
    
    return {"success": True, "message": str(timestamp_id)}

def get_benchmarks():
    benchmarks = {}
    try:
        benchmarks["GPU"] = pf.import_benchmark_json("GPU")
        benchmarks["CPU-Gaming"] = pf.import_benchmark_json("CPU-Gaming")
        benchmarks["CPU-Normal"] = pf.import_benchmark_json("CPU-Normal")
        success = True
    except:
        success = False
    return {"success": success, "benchmarks": benchmarks}

def update_benchmarks():
    print("Benchmark Updater Starting")
    bm.update_all_benchmarks()
    print("Benchmark Updater Finished")