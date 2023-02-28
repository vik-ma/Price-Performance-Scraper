from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from .models import Test, ProductListing, CompletedFetch
from . import prj_fetcher as pf
import datetime

# Create your views here.

def list_test_items(request):
    context = {'test_list' : Test.objects.all()}
    return render(request, 'price_fetcher/test_list.html', context)


def insert_test_item(request:HttpRequest):
    current_datetime = datetime.datetime.now()  

    test = Test()
    test.test_name = request.POST['test_name']
    test.test_num = int(request.POST['test_num'])
    test.test_date = current_datetime
    test.save()

    return redirect('/price_fetcher/test_list')


def delete_test_item(request, test_id):
    test_to_delete = Test.objects.get(id=test_id)
    test_to_delete.delete()

    return redirect('/price_fetcher/test_list')

def test_button(request:HttpRequest):
    # module_test = pf.test_django()
    # response = f"<h1>{' '.join(map(str, module_test))}</h1>"

    # create_completed_fetch()
    start_price_fetching()

    return redirect('/price_fetcher/test_list')

def get_current_timestamp():
    return datetime.datetime.now()

def create_completed_fetch(product_list, benchmark_type, timestamp, timestamp_id):
    completed_fetch = CompletedFetch()
    completed_fetch.product_list = product_list
    completed_fetch.benchmark_type = benchmark_type
    completed_fetch.timestamp = timestamp
    completed_fetch.timestamp_id = timestamp_id
    completed_fetch.save()

def start_price_fetching():
    # module_test = pf.start_price_fetching_cpu("CPU-Gaming", pf.cpu_pj_url_dict, ["AMD Ryzen 9 7950X"])
    fetch_category = pf.cpu_gaming_tier_dict["TIER 5"]
    benchmark_type = "CPU-Gaming"

    module_test = pf.start_price_fetching_cpu(benchmark_type, pf.cpu_pj_url_dict, fetch_category)

    current_timestamp = get_current_timestamp()
    timestamp_id = (''.join(i for i in str(current_timestamp) if i.isdigit()))
    product_list = ", ".join(fetch_category)

    for listing in module_test:
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

    create_completed_fetch(product_list, benchmark_type, current_timestamp, timestamp_id)