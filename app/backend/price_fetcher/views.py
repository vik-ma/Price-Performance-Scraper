from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from .models import Test, Product_Listing
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

def test_module_return(request:HttpRequest):
    # module_test = pf.test_django()
    # module_test = pf.start_price_fetching_cpu("CPU-Gaming", pf.cpu_pj_url_dict, ["AMD Ryzen 9 7950X"])
    module_test = pf.start_price_fetching_gpu(pf.gpu_pj_url_dict["TIER 1"])
    # response = f"<h1>{' '.join(map(str, module_test))}</h1>"
    # return HttpResponse(response)
    # response = ""
    for listing in module_test:
        # response += f"<h3>{listing}</h3>"
        product_listing = Product_Listing()
        product_listing.product_category = listing[0]
        product_listing.store_name = listing[1]
        product_listing.price = listing[2]
        product_listing.product_link = listing[3]
        product_listing.product_name = listing[4]
        product_listing.benchmark_value = listing[5]
        product_listing.price_performance_ratio = listing[6]
        product_listing.save()
    # return HttpResponse(response)
    return redirect('/price_fetcher/test_list')