from django.shortcuts import redirect, render
from django.http import HttpRequest
from .models import ProductListing, CompletedFetch, BenchmarkData
from . import prj_fetcher as pf
from . import benchmark_scraper as bm
import datetime
import json

def test_template(request:HttpRequest):
    """Test html template for debugging purposes."""

    # List of all objects in Benchmark Data
    benchmark_data_list = BenchmarkData.objects.all()
    context = {'benchmark_data_list' : benchmark_data_list}
    
    return render(request, 'price_fetcher/test_template.html', context)

def test_button(request:HttpRequest):
    """Test button in test_template for debugging purposes."""
    data = {
        "product_list": 
        "AMD Ryzen 9 7950X3D,AMD Ryzen 9 7900X3D,AMD Ryzen 7 7800X3D", 
        "fetch_type": "CPU-Gaming" 
        }

    pf_return = start_price_fetching(data)

    print(pf_return)

    return redirect('/')

def get_current_timestamp() -> datetime:
    """Return the current date and time as a datetime object."""
    return datetime.datetime.now()

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
    products_to_fetch = data["product_list"].split(",")

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

def get_benchmarks() -> dict:
    """
    Load and return stored Benchmark Data from .json files.

        Returns:
            Dictionary containing a "success" key and a "benchmarks" key.
                "success" will be True if import worked, otherwise False.
                "benchmarks" will be a dictionary of three dictionaries if
                import worked, otherwise an empty dictionary.
    """
    benchmarks = {}
    try:
        benchmarks_data = BenchmarkData.objects.latest('id')
        benchmarks["GPU"] = json.loads(benchmarks_data.gpu_benchmarks)
        benchmarks["CPU-Gaming"] = json.loads(benchmarks_data.cpu_g_benchmarks)
        benchmarks["CPU-Normal"] = json.loads(benchmarks_data.cpu_n_benchmarks)
        success = True
    except:
        success = False
    return {"success": success, "benchmarks": benchmarks}

def update_benchmarks():
    """
    Scrapes new Benchmark Data and updates locally stored Benchmark .json files.
    """
    print("Benchmark Updater Starting")
    bm.update_all_benchmarks()
    print("Benchmark Updater Finished")

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
