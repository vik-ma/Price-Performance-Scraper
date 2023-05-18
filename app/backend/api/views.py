from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import serializers, status
from .serializers import FetchPropertiesSerializer, CompletedFetchSerializer, ProductListingSerializer
from price_fetcher.models import BenchmarkData, CompletedFetch, ProductListing
import price_fetcher.views as pf
import datetime
import json

class ScrapeThrottle():
    """
    Class to throttle Price Scrape requests made to API.
    """
    def __init__(self):
        # Time where next Price Scrape is allowed
        self.next_scrape_time = None
    
    def allow_request(self) -> bool:
        """
        Returns True if cooldown for Price Scrape has passed, otherwise False.
        """
        # Get current time
        current_datetime = datetime.datetime.now()
        # Check if time of next allowed Price Scrape has passed
        if (self.next_scrape_time is None) or (current_datetime > self.next_scrape_time):
            return True
        return False

    def set_new_time(self):
        """
        Sets the time of next allowed Price Scrape to 3 minutes from current time.
        """
        current_datetime = datetime.datetime.now()
        self.next_scrape_time = current_datetime + datetime.timedelta(minutes=3)

    def calculate_seconds_left(self) -> int:
        """Returns the time left until next Price Scrape is allowed in seconds."""
        current_datetime = datetime.datetime.now()
        time_left = self.next_scrape_time - current_datetime
        seconds_left = int(time_left.total_seconds())
        return seconds_left

scrape_throttle = ScrapeThrottle()

# List of allowed benchmark types for Price Scrape
valid_fetch_types = frozenset(["GPU", "CPU-Gaming", "CPU-Normal"])

# List of allowed GPU models to Price Scrape
valid_gpu_set = frozenset([
    "GeForce RTX 4090",
    "GeForce RTX 4080",
    "Radeon RX 7900 XTX",
    "GeForce RTX 4070 Ti",
    "Radeon RX 6950 XT",
    "Radeon RX 7900 XT",
    "GeForce RTX 4070",
    "Radeon RX 6800 XT",
    "GeForce RTX 3070 Ti",
    "GeForce RTX 3070",
    "Radeon RX 6800",
    "Radeon RX 6750 XT",
    "GeForce RTX 3060 Ti",
    "Radeon RX 6700 XT",
    "Radeon RX 6700",
    "Radeon RX 6650 XT",
    "GeForce RTX 3060",
    "Radeon RX 6600 XT",
    "Radeon RX 6600",
    "GeForce RTX 2060",
    "GeForce GTX 1660 Super",
    "GeForce RTX 3050",
    "GeForce GTX 1660 Ti",
    "GeForce GTX 1660",
    "Radeon RX 6500 XT",
    "Radeon RX 6400",
])

# List of allowed CPU models to Price Scrape
valid_cpu_normal_list = [
    "AMD Ryzen 9 7950X3D",
    "AMD Ryzen 9 7900X3D",
    "AMD Ryzen 7 7800X3D",
    "AMD Ryzen 9 5950X",
    "AMD Ryzen 9 5900X",
    "AMD Ryzen 7 5800X",
    "AMD Ryzen 7 5800X3D",
    "AMD Ryzen 7 5700X",
    "AMD Ryzen 5 5600X",
    "AMD Ryzen 5 5600",
    "AMD Ryzen 5 5500",
    "AMD Ryzen 9 7950X",
    "AMD Ryzen 9 7900X",
    "AMD Ryzen 9 7900",
    "AMD Ryzen 7 7700X",
    "AMD Ryzen 7 7700",
    "AMD Ryzen 5 7600X",
    "AMD Ryzen 5 7600",
    "Intel Core i9-13900KS",
    "Intel Core i9-13900K",
    "Intel Core i9-13900KF",
    "Intel Core i9-13900F",
    "Intel Core i9-13900",
    "Intel Core i7-13700K",
    "Intel Core i7-13700KF",
    "Intel Core i9-12900KS",
    "Intel Core i9-12900K",
    "Intel Core i9-12900KF",
    "Intel Core i7-13700",
    "Intel Core i7-13700F",
    "Intel Core i5-13600K",
    "Intel Core i5-13600KF",
    "Intel Core i9-12900F",
    "Intel Core i9-12900",
    "Intel Core i7-12700K",
    "Intel Core i7-12700KF",
    "Intel Core i5-13500",
    "Intel Core i7-12700F",
    "Intel Core i7-12700",
    "Intel Core i5-12600K",
    "Intel Core i5-12600KF",
    "Intel Core i5-13400",
    "Intel Core i5-13400F",
    "Intel Core i5-12600",
    "Intel Core i5-12500",
    "Intel Core i5-12400F",
    "Intel Core i5-12400",
]

valid_cpu_normal_set = frozenset(valid_cpu_normal_list)

valid_cpu_gaming_list = valid_cpu_normal_list.copy()
# Remove Intel Core i9-13900 because it has no Gaming Benchmarks
valid_cpu_gaming_list.remove("Intel Core i9-13900")
valid_cpu_gaming_set = frozenset(valid_cpu_gaming_list)


def validate_fetch_request(serializer_data):
    """
    Validates data sent to start_price_fetch and raises ValidationError if data is invalid.
    
    "product_list" must be a string of listed of product models, with a comma separating them.
    All products must be in either "valid_gpu_set", "valid_cpu_normal_set" or "valid_cpu_gaming_set",
    depending on the "fetch_type".

    "fetch_type" must be an allowed benchmark type contained in "valid_fetch_types".
    """

    # Check if benchmark type is valid
    if serializer_data["fetch_type"] not in valid_fetch_types:
        raise serializers.ValidationError("Not a valid fetch_type")
    
    # Set benchmark type
    fetch_type = serializer_data["fetch_type"]

    # Check if product_list is correctly structured
    try:
        product_list = set(serializer_data["product_list"].split(","))
    except:
        raise serializers.ValidationError("Not a valid product_list string")

    # Check if there are no more than 3 products for a Price Scrape of GPUs
    if fetch_type == "GPU" and len(product_list) > 3:
        raise serializers.ValidationError("product_list too long")

    # Check if there are no more than 7 products for a Price Scrape of CPUs
    if (fetch_type == "CPU-Gaming" or fetch_type == "CPU-Normal") and len(product_list) > 7:
        raise serializers.ValidationError("product_list too long")

    # Set list of allowed products for benchmark type
    if fetch_type == "GPU":
        valid_product_set = valid_gpu_set     
    elif fetch_type == "CPU-Gaming":
        valid_product_set = valid_cpu_gaming_set
    elif fetch_type == "CPU-Normal":
        valid_product_set = valid_cpu_normal_set

    # Check if all items in product_list are allowed
    if not product_list.issubset(valid_product_set):
        raise serializers.ValidationError("Invalid items in product_list")


@api_view(['POST'])
def start_price_fetch(request) -> Response:
    """
    Starts a Price Scrape based on request data.

    Request must be a dict/JSON object of type FetchProperties in models.py.

    "product_list" must be a string with a list of all product models to be scraped,
    each separated by a comma.

    "fetch_type" must be a string of which benchmark type should be compared.

        Returns:
            If Price Scrape was successful:
                Response with dictionary keys:
                    success (bool): True
                    message (str): *Database ID of completed Price Scrape*

            If Price Scraping is on cooldown:
                Response with dictionary keys:
                    success (bool): False
                    message (str): *Message that price scraping is on cooldown*
                    seconds_left (int): *Time left in seconds until Price Scraping is off cooldown*

            If Request data was invalid:
                Serializer error with error message
    """

    allow_scrape_request = scrape_throttle.allow_request()
    # Check if Price Scraping is allowed or on cooldown
    if not allow_scrape_request:
        seconds_left = scrape_throttle.calculate_seconds_left()

        # Return a Response that says that Price Scraping is on cooldown
        return Response({
        "message": f"Scrape request on cooldown, {seconds_left} seconds left", "success": False, "seconds_left": seconds_left
        })

    serializer = FetchPropertiesSerializer(data=request.data)

    # Run Request through serializer to check if types are valid
    if serializer.is_valid():
        # Validate the contents of Request
        # If data is not valid, an error will be raised here and function returned
        validate_fetch_request(serializer.data)

        # Set cooldown until next Price Scrape can be started
        scrape_throttle.set_new_time()

        # Start Price Scrape
        price_fetch = pf.start_price_fetching(serializer.data)

        # Send back Response once Price Scraping is finished
        return Response(price_fetch)

    # Return serializer error message if Request did not pass serializer
    return Response(serializer.errors)


@api_view(['GET'])
def get_all_completed_fetches(request):
    """Return list of meta info for all Completed Price Scrapes."""
    completed_fetches = CompletedFetch.objects.all()
    serializer = CompletedFetchSerializer(completed_fetches, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_completed_fetch_by_timestamp_id(request, timestamp_id):
    """Return meta info for Completed Price Scrape with specific timestamp_id."""
    try:
        completed_fetch = CompletedFetch.objects.get(timestamp_id = timestamp_id)
    except CompletedFetch.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CompletedFetchSerializer(completed_fetch)
    return Response(serializer.data)

@api_view(['GET'])
def get_product_listings_from_timestamp_id(request, timestamp_id):
    """
    Return list of all Product Listings with specific timestamp_id 
    ordered by their Price/Performance Score.
    """
    try:
        # Order by id, which is the order that ProductListings was entered into database.
        # The list of ProductListings for a specific timestamp_id is always pre-sorted by their PPS
        product_listings = ProductListing.objects.filter(timestamp_id = timestamp_id).order_by('id')
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    if len(product_listings) == 0:
        # If no product_listings has timestamp_id
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ProductListingSerializer(product_listings, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def test_get(request):
    """Test GET request for debugging purposes."""
    pass


@api_view(['POST'])
def test_post(request):
    """Test POST request for debugging purposes."""
    pass


@api_view(['GET'])
def wake_api(request) -> Response:
    """GET request to wake sleeping web service."""
    return Response({"message": "awake"})


@api_view(['GET'])
def get_benchmarks(request) -> Response:
    """
    Load and return stored Benchmark Data saved as a JSON string from database.

        Returns:
            Dictionary containing a "success" key and a "benchmarks" key.
                "success" will be True if import worked, otherwise False.
                "benchmarks" will be a dictionary of three dictionaries if
                import worked, otherwise an empty dictionary.
    """
    response = {}
    benchmarks = {}

    try:
        benchmarks_data = BenchmarkData.objects.latest('id')
        benchmarks["GPU"] = json.loads(benchmarks_data.gpu_benchmarks)
        benchmarks["CPU-Gaming"] = json.loads(benchmarks_data.cpu_g_benchmarks)
        benchmarks["CPU-Normal"] = json.loads(benchmarks_data.cpu_n_benchmarks)
        success = True
    except:
        success = False

    response["success"] = success
    response["benchmarks"] = benchmarks

    return Response(response)


@api_view(['GET'])
def get_scrape_allowed(request) -> Response:
    """
    Returns wether Price Scraping is allowed or on cooldown.
    
        Returns:
            If Price Scrape is allowed:
                Response with dictionary keys:
                    success (bool): True
                    allow (bool): True
            If Price Scrape is not allowed:
                Response with dictionary keys:
                    success (bool): True
                    allow (bool): False
                    seconds_left (int): *Time left in seconds until Price Scraping is off cooldown*

    """
    # Check if Price Scraping is allowed
    allow_scrape_request = scrape_throttle.allow_request()

    if not allow_scrape_request:
        seconds_left = scrape_throttle.calculate_seconds_left()

        # Return time left until Price Scraping is allowed again
        return Response({
        "success": True, "allow": allow_scrape_request, "seconds_left": seconds_left
    })

    return Response({
        "success": True, "allow": allow_scrape_request
    })

