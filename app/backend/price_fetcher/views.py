from django.shortcuts import redirect, render
from django.http import HttpRequest, JsonResponse
from .models import ProductListing, CompletedFetch, BenchmarkData
from . import prj_fetcher as pf
from . import benchmark_scraper as bm
import datetime
import json

def pps_dashboard(request:HttpRequest):
    """Test html template for debugging purposes."""

    benchmark_data_list = BenchmarkData.objects.all()
    completed_fetch_list = CompletedFetch.objects.all()
    current_datetime = get_current_timestamp()
    context = {
        'benchmark_data_list' : benchmark_data_list, 
        'completed_fetch_list' : completed_fetch_list,
        'current_datetime' : current_datetime,
        }
    
    return render(request, 'price_fetcher/pps_dashboard.html', context)

def test_button_cpu_g(request:HttpRequest):
    """Button to test CPU-Gaming Price Scrape in pps_dashboard for debugging purposes."""
    data = {
        "product_list": 
        "AMD Ryzen 9 7950X3D,AMD Ryzen 9 7900X3D,AMD Ryzen 7 7800X3D",
        "fetch_type": "CPU-Gaming" 
        }
    pf_return = start_price_fetching(data)
    print(pf_return)

    return redirect('/')


def test_button_cpu_n(request:HttpRequest):
    """Button to test CPU-Normal Price Scrape in pps_dashboard for debugging purposes."""
    data = {
        "product_list": 
        "AMD Ryzen 9 7950X,Intel Core i9-13900KS,Intel Core i9-13900K", 
        "fetch_type": "CPU-Normal" 
        }
    pf_return = start_price_fetching(data)
    print(pf_return)

    return redirect('/')


def test_button_gpu(request:HttpRequest):
    """Button to test GPU Price Scrape in pps_dashboard for debugging purposes."""
    data = {
        "product_list": 
        "GeForce RTX 4090,GeForce RTX 4080,Radeon RX 7900 XTX", 
        "fetch_type": "GPU" 
        }
    pf_return = start_price_fetching(data)
    print(pf_return)

    return redirect('/')


def test_button_benchmarks(request:HttpRequest):
    """Button to test Benchmark Updater in pps_dashboard for debugging purposes."""
    update_benchmarks()

    return redirect('/')


def get_current_timestamp() -> datetime:
    """Return the current date and time as a datetime object."""
    return datetime.datetime.now()


def test_button_fetch(request:HttpRequest):
    """Button to test if if product pages are fetchable, for debugging purposes."""
    product_name = "AMD Ryzen 9 7900X3D"
    product_category = "CPU-Gaming"

    content = pf.test_fetch_product_page(product_name, product_category)

    return JsonResponse({"content": content})


def test_button_fetch_number_4(request:HttpRequest):
    content = test_fetch_number(4)

    return JsonResponse({"content": content})

def test_button_fetch_number_7(request:HttpRequest):
    content = test_fetch_number(7)
    
    return JsonResponse({"content": content})

def test_button_fetch_number_10(request:HttpRequest):
    content = test_fetch_number(10)
    
    return JsonResponse({"content": content})

def test_fetch_number(number):
    product_list = [
        "Intel Core i9-13900KS",
        "Intel Core i9-13900K",
        "Intel Core i9-13900KF",
        "Intel Core i9-13900F",
        "AMD Ryzen 9 7950X3D",
        "AMD Ryzen 9 7950X",
        "AMD Ryzen 9 7900X3D",
        "AMD Ryzen 9 7900X",
        "AMD Ryzen 9 7900",
        "AMD Ryzen 7 7800X3D"
    ]
    product_category = "CPU-Gaming"

    sliced_product_list = product_list[:number]

    content = pf.test_number_of_fetches_possible(sliced_product_list, product_category)

    return content


def create_completed_fetch(product_list, benchmark_type, timestamp, timestamp_id):
    """
    Save a CompletedFetch entry to PostgreSQL database.

        Parameters:
            product_list (str): List of product models used in Price Scrape
                                (Models are separated by commas)
            
            benchmark_type (str): Type of benchmark data to be compared
                                  (Must be either "CPU-Gaming" or "CPU-Normal")
                    
            timestamp (datetime): Datetime object of the date + time of when
                                  Price Scrape was completed
            
            timestamp_id (str): String of timestamp object to relate a CompletedFetch
                                entry to ProductListing entries
    """
    completed_fetch = CompletedFetch()
    completed_fetch.product_list = product_list
    completed_fetch.benchmark_type = benchmark_type
    completed_fetch.timestamp = timestamp
    completed_fetch.timestamp_id = timestamp_id
    completed_fetch.save()

def start_price_fetching(data) -> dict:
    """
    Start a Price Scrap based on input data and save information gathered from
    Price Scrape to PostgreSQL database.

        Parameters:
            data (dict): Dictionary containing JSON data from API call.
                         Contains data of the FetchProperties type in api/models.
        
        Returns:
            dict{"success": True, "message": str}: If Price Scrape was successful,
                                                   returns the timestamp_id of the
                                                   Price Scrape as message.

            dict{"success": False, "message": str}: If Price Scrape ran into an error,
                                                    returns the error as message.

            Exception: If data gathered from Price Scrape can't be saved to database.            
    """
    # Benchmark type to be compared
    fetch_type = data["fetch_type"]
    # Create list of products models to be Price Scraped
    # Every model is separated by a comma
    products_to_fetch = list(set(data["product_list"].split(",")))

    # Start Price Scrape
    if fetch_type == "GPU":
        fetched_prices = pf.start_price_fetching_gpu(products_to_fetch)
    elif fetch_type == "CPU-Gaming" or fetch_type == "CPU-Normal":
        fetched_prices = pf.start_price_fetching_cpu(fetch_type, products_to_fetch)

    # If Price Scrape has returned an Exception
    if type(fetched_prices) == Exception:
        # Return dict/JSON with message of Exception
        return {"success": False, "message": str(fetched_prices)}

    # Create timestamp of when Price Scrape was completed
    current_timestamp = get_current_timestamp()

    # Convert datetime object timestamp to a string ID to relate a 
    # completed Price Scrape and Product Listings from Price Scrape to each other
    timestamp_id = (''.join(i for i in str(current_timestamp) if i.isdigit()))

    # Make the string from the list of product models in Price Scrape more readable
    product_list = data["product_list"].replace(",", ", ")

    try:
        # Save all Product Listings from Price Scrape to PostgreSQL database
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

        # Save metadata about Price Scrape to PostgreSQL database
        create_completed_fetch(product_list, fetch_type, current_timestamp, timestamp_id)
    except:
        # If saving failed because faulty data was found
        return Exception("Error adding Price Scrape to database")
    
    # Return the database id of completed Price Scrape
    return {"success": True, "message": str(timestamp_id)}

def update_benchmarks():
    """
    Scrapes new Benchmark Data and stores new Benchmark Data to PostgreSQL database.
    """
    print("Benchmark Updater Starting")
    new_benchmarks = bm.update_all_benchmarks()
    print("Benchmark Updater Finished")

    # If Benchmark scraping was successful
    if type(new_benchmarks) is dict:
        try:
            save_benchmark_data(new_benchmarks)
            print("Benchmarks Saved")
        except:
            print("Error saving benchmarks")
    
    # If Benchmark scraping failed
    if type(new_benchmarks) is Exception:
        print(str(new_benchmarks))

def save_benchmark_data(benchmark_data):
    """
    Save a BenchmarkData entry to PostgreSQL database.

        Parameters:
            benchmark_data (dict): Dictionary consisting of three keys:
                                   "GPU", "CPU-Gaming" and "CPU-Normal".

                                   Each key contains Benchmark Data about
                                   every available Product Model, represented
                                   as a string key, with its Benchmark Value
                                   stored in its value, as a float.
    """
    gpu_benchmarks_dict = benchmark_data["GPU"]
    cpu_g_benchmarks_dict = benchmark_data["CPU-Gaming"]
    cpu_n_benchmarks_dict = benchmark_data["CPU-Normal"]

    # Convert dictionaries to strings
    gpu_benchmarks_str = json.dumps(gpu_benchmarks_dict)
    cpu_g_benchmarks_str = json.dumps(cpu_g_benchmarks_dict)
    cpu_n_benchmarks_str = json.dumps(cpu_n_benchmarks_dict)

    # Save JSON data as strings
    benchmark_data = BenchmarkData()
    benchmark_data.gpu_benchmarks = gpu_benchmarks_str
    benchmark_data.cpu_g_benchmarks = cpu_g_benchmarks_str
    benchmark_data.cpu_n_benchmarks = cpu_n_benchmarks_str
    benchmark_data.save()
