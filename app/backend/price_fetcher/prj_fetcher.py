import json
from bs4 import BeautifulSoup
import re
import datetime
import time
import cloudscraper
from .models import BenchmarkData

# Product page for each GPU model to scrape prices from
gpu_pj_url_dict = {
    "GeForce RTX 4090": "https://www.prisjakt.nu/c/grafikkort?532=39780",
    "GeForce RTX 4080": "https://www.prisjakt.nu/c/grafikkort?532=39779",
    "GeForce RTX 4080 Super": "https://www.prisjakt.nu/c/grafikkort?532=41465",
    "GeForce RTX 4070 Ti Super": "https://www.prisjakt.nu/c/grafikkort?532=41464",
    "GeForce RTX 4070 Super": "https://www.prisjakt.nu/c/grafikkort?114854=41460",
    "Radeon RX 7900 XTX": "https://www.prisjakt.nu/c/grafikkort?532=39908",
    "GeForce RTX 4070 Ti": "https://www.prisjakt.nu/c/grafikkort?532=40333",
    "Radeon RX 6950 XT": "https://www.prisjakt.nu/c/grafikkort?532=39794",
    "Radeon RX 7900 XT": "https://www.prisjakt.nu/c/grafikkort?532=39907",
    "Radeon RX 7800 XT": "https://www.prisjakt.nu/c/grafikkort?532=41132",
    "Radeon RX 7700 XT": "https://www.prisjakt.nu/c/grafikkort?532=41131",
    "Radeon RX 6800 XT": "https://www.prisjakt.nu/c/grafikkort?532=36621",
    "GeForce RTX 4070": "https://www.prisjakt.nu/c/grafikkort?532=40332",
    "GeForce RTX 4060 Ti": "https://www.prisjakt.nu/c/grafikkort?532=40881",
    "Radeon RX 6750 XT": "https://www.prisjakt.nu/c/grafikkort?532=39911",
    "Radeon RX 6700 XT": "https://www.prisjakt.nu/c/grafikkort?532=36619",
    "GeForce RTX 4060": "https://www.prisjakt.nu/c/grafikkort?532=40880",
    "GeForce RTX 3060 Ti": "https://www.prisjakt.nu/c/grafikkort?532=36433",
    "Radeon RX 7600": "https://www.prisjakt.nu/c/grafikkort?532=40890",
    "Radeon RX 6650 XT": "https://www.prisjakt.nu/c/grafikkort?532=39910",
    "Radeon RX 6600 XT": "https://www.prisjakt.nu/c/grafikkort?532=37636",
    "Radeon RX 6600": "https://www.prisjakt.nu/c/grafikkort?532=37787",
    "GeForce RTX 3060": "https://www.prisjakt.nu/c/grafikkort?532=36256",
    "GeForce RTX 3050": "https://www.prisjakt.nu/c/grafikkort?532=38072",
    "GeForce GTX 1660 Super": "https://www.prisjakt.nu/c/grafikkort?532=32763",
}

# Product page for each CPU model to scrape prices from
cpu_pj_url_dict = {
    "AMD Ryzen 7 9800X3D": "https://www.prisjakt.nu/produkt.php?p=13951156",
    "AMD Ryzen 9 9950X": "https://www.prisjakt.nu/produkt.php?p=13619009",
    "AMD Ryzen 9 9900X": "https://www.prisjakt.nu/produkt.php?p=13619028",
    "AMD Ryzen 7 9700X": "https://www.prisjakt.nu/produkt.php?p=13619029",
    "AMD Ryzen 5 9600X": "https://www.prisjakt.nu/produkt.php?p=13619010",
    "AMD Ryzen 9 5950X": "https://www.prisjakt.nu/produkt.php?p=5588372",
    "AMD Ryzen 9 5900X": "https://www.prisjakt.nu/produkt.php?p=5588367",
    "AMD Ryzen 7 5800X": "https://www.prisjakt.nu/produkt.php?p=5588364",
    "AMD Ryzen 7 5800X3D": "https://www.prisjakt.nu/produkt.php?p=6040557",
    "AMD Ryzen 7 5700X": "https://www.prisjakt.nu/produkt.php?p=6040676",
    "AMD Ryzen 7 5700X3D": "https://www.prisjakt.nu/produkt.php?p=12941877",
    "AMD Ryzen 7 5700": "https://www.prisjakt.nu/produkt.php?p=13324327",
    "AMD Ryzen 5 5600X": "https://www.prisjakt.nu/produkt.php?p=5588360",
    "AMD Ryzen 5 5600": "https://www.prisjakt.nu/produkt.php?p=6090826",
    "AMD Ryzen 5 5500": "https://www.prisjakt.nu/produkt.php?p=6090824",
    "AMD Ryzen 9 7950X3D": "https://www.prisjakt.nu/produkt.php?p=8053683",
    "AMD Ryzen 9 7950X": "https://www.prisjakt.nu/produkt.php?p=6999752",
    "AMD Ryzen 9 7900X3D": "https://www.prisjakt.nu/produkt.php?p=8053693",
    "AMD Ryzen 9 7900X": "https://www.prisjakt.nu/produkt.php?p=6999757",
    "AMD Ryzen 9 7900": "https://www.prisjakt.nu/produkt.php?p=7328156",
    "AMD Ryzen 7 7800X3D": "https://www.prisjakt.nu/produkt.php?p=8053700",
    "AMD Ryzen 7 7700X": "https://www.prisjakt.nu/produkt.php?p=6999756",
    "AMD Ryzen 7 7700": "https://www.prisjakt.nu/produkt.php?p=7327472",
    "AMD Ryzen 5 7600X": "https://www.prisjakt.nu/produkt.php?p=6999754",
    "AMD Ryzen 5 7600": "https://www.prisjakt.nu/produkt.php?p=7327471",
    "Intel Core Ultra 9 285K": "https://www.prisjakt.nu/produkt.php?p=13931062",
    "Intel Core Ultra 7 265KF": "https://www.prisjakt.nu/produkt.php?p=13931043",
    "Intel Core Ultra 7 265K": "https://www.prisjakt.nu/produkt.php?p=13931072",
    "Intel Core Ultra 5 245KF": "https://www.prisjakt.nu/produkt.php?p=13931061",
    "Intel Core Ultra 5 245K": "https://www.prisjakt.nu/produkt.php?p=13931044",
    "Intel Core i9-14900KS": "https://www.prisjakt.nu/produkt.php?p=13308143",
    "Intel Core i9-14900K": "https://www.prisjakt.nu/produkt.php?p=12475625",
    "Intel Core i9-14900KF": "https://www.prisjakt.nu/produkt.php?p=12477198",
    "Intel Core i9-14900F": "https://www.prisjakt.nu/produkt.php?p=13357957",
    "Intel Core i9-14900": "https://www.prisjakt.nu/produkt.php?p=13226696",
    "Intel Core i7-14700K": "https://www.prisjakt.nu/produkt.php?p=12475616",
    "Intel Core i7-14700KF": "https://www.prisjakt.nu/produkt.php?p=12477199",
    "Intel Core i7-14700F": "https://www.prisjakt.nu/produkt.php?p=13097092",
    "Intel Core i7-14700": "https://www.prisjakt.nu/produkt.php?p=13097086",
    "Intel Core i5-14600K": "https://www.prisjakt.nu/produkt.php?p=12475615",
    "Intel Core i5-14600KF": "https://www.prisjakt.nu/produkt.php?p=12477200",
    "Intel Core i5-14600": "https://www.prisjakt.nu/produkt.php?p=13239274",
    "Intel Core i5-14500": "https://www.prisjakt.nu/produkt.php?p=13219783",
    "Intel Core i5-14400F": "https://www.prisjakt.nu/produkt.php?p=13219693",
    "Intel Core i5-14400": "https://www.prisjakt.nu/produkt.php?p=13236199",
    "Intel Core i9-13900KS": "https://www.prisjakt.nu/produkt.php?p=7334329",
    "Intel Core i9-13900K": "https://www.prisjakt.nu/produkt.php?p=7014938",
    "Intel Core i9-13900KF": "https://www.prisjakt.nu/produkt.php?p=7132476",
    "Intel Core i9-13900F": "https://www.prisjakt.nu/produkt.php?p=7335288",
    "Intel Core i9-13900": "https://www.prisjakt.nu/produkt.php?p=7335286",
    "Intel Core i7-13700K": "https://www.prisjakt.nu/produkt.php?p=7014937",
    "Intel Core i7-13700KF": "https://www.prisjakt.nu/produkt.php?p=7132477",
    "Intel Core i9-12900KS": "https://www.prisjakt.nu/produkt.php?p=6031273",
    "Intel Core i9-12900K": "https://www.prisjakt.nu/produkt.php?p=5879155",
    "Intel Core i9-12900KF": "https://www.prisjakt.nu/produkt.php?p=5879153",
    "Intel Core i7-13700": "https://www.prisjakt.nu/produkt.php?p=7335263",
    "Intel Core i7-13700F": "https://www.prisjakt.nu/produkt.php?p=7335267",
    "Intel Core i5-13600K": "https://www.prisjakt.nu/produkt.php?p=7014939",
    "Intel Core i5-13600KF": "https://www.prisjakt.nu/produkt.php?p=7132478",
    "Intel Core i9-12900F": "https://www.prisjakt.nu/produkt.php?p=5948039",
    "Intel Core i9-12900": "https://www.prisjakt.nu/produkt.php?p=5948038",
    "Intel Core i7-12700K": "https://www.prisjakt.nu/produkt.php?p=5879157",
    "Intel Core i7-12700KF": "https://www.prisjakt.nu/produkt.php?p=5879156",
    "Intel Core i5-13500": "https://www.prisjakt.nu/produkt.php?p=7335292",
    "Intel Core i7-12700F": "https://www.prisjakt.nu/produkt.php?p=5948036",
    "Intel Core i7-12700": "https://www.prisjakt.nu/produkt.php?p=5948024",
    "Intel Core i5-12600K": "https://www.prisjakt.nu/produkt.php?p=5879154",
    "Intel Core i5-12600KF": "https://www.prisjakt.nu/produkt.php?p=5879152",
    "Intel Core i5-13400": "https://www.prisjakt.nu/produkt.php?p=7335275",
    "Intel Core i5-13400F": "https://www.prisjakt.nu/produkt.php?p=7335279",
    "Intel Core i5-12600": "https://www.prisjakt.nu/produkt.php?p=5948015",
    "Intel Core i5-12500": "https://www.prisjakt.nu/produkt.php?p=5948021",
    "Intel Core i5-12400F": "https://www.prisjakt.nu/produkt.php?p=5948013",
    "Intel Core i5-12400": "https://www.prisjakt.nu/produkt.php?p=5948016",
}


def import_benchmark_json(benchmark_type, run_locally=False) -> dict:
    """
    Import and return benchmark data from .json file.

        Parameters:
            benchmark_type (str): Type of benchmark to import
                                  (Must be either "GPU", "CPU-Gaming" or "CPU-Normal")

            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            data (dict): Dictionary of benchmark data where every key is a product model
                         and their value is the model's corresponding benchmark score
    """
    if run_locally:
        file_path = f"app/backend/price_fetcher/benchmarks/latest_benchmarks/{benchmark_type}.json"
    else:
        file_path = f"price_fetcher/benchmarks/latest_benchmarks/{benchmark_type}.json"

    with open(file_path, "r") as file:
        data = json.load(file)

    return data


def import_benchmark_from_db(benchmark_type) -> dict:
    """
    Import and return benchmark data from database.

        Parameters:
            benchmark_type (str): Type of benchmark to import
                                  (Must be either "GPU", "CPU-Gaming" or "CPU-Normal")

        Returns:
            data (dict): Dictionary of benchmark data where every key is a product model
                         and their value is the model's corresponding benchmark score
    """
    benchmarks_data = BenchmarkData.objects.latest('id')

    if benchmark_type == "GPU":
        return json.loads(benchmarks_data.gpu_benchmarks)
    if benchmark_type == "CPU-Gaming":
        return json.loads(benchmarks_data.cpu_g_benchmarks)
    if benchmark_type == "CPU-Normal":
        return json.loads(benchmarks_data.cpu_n_benchmarks)


def fetch_gpu_category_page(url) -> list:
    """
    Scrape all pages for GPU category of provided url.

        Parameters:
            url (str): Link to the website to be scraped
        Returns:
            soup_list (list): List of BeautifulSoup objects containing scraped webpages

    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)

    soup = BeautifulSoup(response.text, "html.parser")

    # Create list of pages
    soup_list = []

    # Append first page
    soup_list.append(soup)

    # Check if there is a "Next Page"
    next_page_tag = soup.find("a", {"aria-label": "Visa nästa"})
    if next_page_tag:
        num_pages_tag = soup.find("ul", {"data-test": "Pagination"})
        num_pages = int(num_pages_tag.find_all("li")[-2].text.strip())

        for i in range(1, num_pages):
            # Get the url for next page
            # Default offset is 44 per page
            offset_num = i * 44
            next_page_link = f"{url}&offset={offset_num}"

            # Wait half a second before scraping next page
            print("Sleeping until next page")
            time.sleep(0.5)

            # Scrape next page
            response = scraper.get(url)

            soup = BeautifulSoup(response.text, "html.parser")
            print(next_page_link)

            # Append next page
            soup_list.append(soup)
    else:
        print("Only one page in category")

    return soup_list


def fetch_product_page(url) -> BeautifulSoup:
    """
    Scrape product page of provided url.

        Parameters:
            url (str): Link to the website to be scraped
        Returns:
            soup_list (list): BeautifulSoup object containing scraped webpage
    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)

    soup = BeautifulSoup(response.text, "html.parser")

    return soup


def test_local_html_page(filename):
    """
    Parse a local .html file with BeautifulSoup.
    (For debugging purposes)

        Parameters:
            filename (str): Full filepath to the .html file
    """
    with open(filename, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")


def test_local_json_file(filename):
    """
    Import a local .json file.
    (For debugging purposes)

        Parameters:
            filename (str): Full filepath to the .json file
    """
    with open(filename, "r") as file:
        json_data = json.load(file)


def get_product_json(soup) -> dict:
    """
    Extract JSON data regarding listed prices of a product from scraped webpage.

        Parameters:
            soup (BeautifulSoup object): Website content scraped with BeautifulSoup

        Returns:
            json_data (dict): Dictionary containing everything inside the key "prices"
                              from scraped webpage
    """
    # Script tag which contains JSON data (formatted as plain text)
    page_json = soup.find_all("script")[8].text

    # Parse JSON using regex

    # Key to extract data from
    start_text = r'"prices":'
    # Continue until this key
    end_text = r',"popularProducts"'
    # Extract all text from start_text to end_text, including start_text but excluding end_text
    price_data = re.search(
        f"{start_text}.*?(?={end_text})", page_json).group(0)

    # Wrap string in dictionary brackets to convert to dictionary via json module
    price_data = f"{{{price_data}}}"

    # Remove escape characters and ensure unicode characters stays
    reencoded_price_data = price_data.encode('utf-8').decode('unicode_escape')

    # Load string as a dictionary
    json_data = json.loads(reencoded_price_data)

    # Return extracted data as dictionary
    return json_data


def get_product_price_list(json_data, product_category) -> list:
    """
    Extract specific information from products listed in a product page via provided JSON data.

        Parameters:
            json_data (dict): Dictionary containing information about listed prices for product

            product_category (str): Name of product model

        Returns:
            product_list (list): List of tuples containing various information about
                                 listed prices for a product
    """
    product_list = []

    for product in json_data["prices"]["nodes"]:
        # Store information about every product listing which is in stock and sold by Swedish stores
        if product["stock"]["status"] == "in_stock" and product["store"]["currency"] == "SEK":
            # Name of store for product listing
            store_name = product["store"]["name"]
            # Price (excluding shipping) of the product listing
            store_price = int(product["price"]["exclShipping"])
            # Name of product
            product_name = product["name"]
            # Link to product listing on store
            product_link = product["externalUri"]
            # Append tuple containing information of product listing to list
            product_list.append(
                (product_category, store_name, store_price, product_link, product_name))

    return product_list


def get_current_time() -> str:
    """
    Return the current date and time in the format "YYYY-MM-DD_HH-MM-SS".

        Returns:
            A string representing the current date and time in the format "YYYY-MM-DD_HH-MM-SS".
    """
    return datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")


def save_local_html_page(soup, filename=None):
    """
    Save provided BeautifulSoup object as local .html file.
    (For debugging purposes)

        Parameters:
            soup (BeautifulSoup object): Website content scraped with BeautifulSoup

            filename (str): Optional name of .html file
    """
    if filename:
        # Save file as filename if filename has been provided
        target_filename = filename
    else:
        # Create generic filename using current datetime if no filename has been provided
        current_time = get_current_time()
        target_filename = f"scrape_{current_time}.html"

    with open(target_filename, "w", encoding="utf-8") as file:
        file.write(soup.prettify())


def create_soup_of_local_html_files(file_list):
    """
    Create list of BeautifulSoup objects from provided local .html files.
    (For debugging purposes)

        Parameters:
            file_list (list): List of strings containing the filepath of local .html files

        Returns:
            soup_list (list): List of local .html files parsed as BeautifulSoup objects
    """
    soup_list = []

    for html_file in file_list:
        with open(html_file, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file, "html.parser")
            soup_list.append(soup)

    return soup_list


def create_json_list_of_local_json_files(file_list):
    """
    Create list of dictionaries from provided local .json files.
    (For debugging purposes)

        Parameters:
            file_list (list): List of strings containing the filepath of local .json files

        Returns:
            json_list (list): List of local .json files parsed as dictionaries
    """
    json_list = []

    for json_file in file_list:
        with open(json_file) as file:
            products_json = json.load(file)
            json_list.append(products_json)

    return json_list


def create_json_list_from_gpu_category(soup_list) -> dict:
    """
    Extract JSON data regarding listed sub-models of a GPU model from a list of scraped webpages

        Parameters:
            soup_list (list): List of BeautifulSoup objects

        Returns:
            json_list (list): List of dictionaries containing everything inside the key
                              "ProductsSlice" from scraped webpages
    """

    # JSON data for all pages in category
    json_list = []

    # Loop through all pages
    for soup in soup_list:
        # Script tag which contains JSON data (formatted as plain text)
        page_json = soup.find_all("script")[7].text

        # Parse JSON using regex

        # Key to extract data from
        start_text = r'{"__typename":"ProductsSlice"'
        # Continue until this key
        end_text = r',{"__typename":"DescriptionSlice"'
        # Extract all text from start_text to end_text, including start_text but excluding end_text
        price_data = re.search(
            f"{start_text}.*?(?={end_text})", page_json).group(0)

        # Remove escape characters and ensure unicode characters stays
        reencoded_price_data = price_data.encode(
            'utf-8').decode('unicode_escape')

        # Load string as a dictionary
        json_data = json.loads(reencoded_price_data)

        # Add page to list of extracted JSON data
        json_list.append(json_data)

    # Return extracted data as list of dictionaries
    return json_list


def write_local_json_files(json_list):
    """
    Save a list of dictionaries as .json files.
    (For debugging purposes)

        Parameters:
            json_list (list): List of dictionaries to be saved as .json files
    """

    current_time = get_current_time()

    for i, json_file in enumerate(json_list, start=1):
        # Create generic filename using current datetime and list index
        with open(f"pj_json_{current_time}_{i}.json", "w") as file:
            json.dump(json_file, file, indent=4)


def get_lowest_prices_in_gpu_category(json_list, num_gpu_categories) -> list:
    """
    Return the cheapest product listings for GPU category.

        Parameters:
            json_list (list): List of dictionaries containing everything inside the key
                              "ProductsSlice" from scraped webpages

            num_gpu_categories (int): The number of GPU models selected in Price Scrape

        Returns:
            lowest_price_list (list): List of tuples containing a link to the product page
                                      of the specific model and its lowest price
    """
    price_list = []

    for products_json in json_list:
        for product in products_json["products"]:
            # Store information about every product listing which is in stock
            if product["priceSummary"]["regular"] != None and product["stockStatus"] == "in_stock":
                product_id = product["id"]
                # Link to the product page
                product_link = f"https://www.prisjakt.nu/produkt.php?p={product_id}"
                # Price of the product
                product_price = int(product["priceSummary"]["regular"])
                # Append product to list of prices
                price_list.append((product_link, product_price))

    # Sort list of prices by lowest price
    sorted_price_list = sorted(price_list, key=lambda x: x[1])

    # if num_gpu_categories < 2:
    #     # Return only the 8 cheapest products if there is only 1 total GPU Model in Price Scrape
    #     lowest_price_list = sorted_price_list[:8]
    # elif num_gpu_categories == 2:
    #     # Return only the 6 cheapest products if there is 2 total GPU Models in Price Scrape
    #     lowest_price_list = sorted_price_list[:6]
    # elif num_gpu_categories > 2:
    #     # Return only the 5 cheapest products if there are more than 2 total GPU Models in Price Scrape
    #     lowest_price_list = sorted_price_list[:5]

    # Return only the 5 cheapest products
    lowest_price_list = sorted_price_list[:5]

    return lowest_price_list


def get_store_price_for_products_from_category(product_link_list, product_category) -> list:
    """
    Scrape page of cheapest products from category page and return specific information 
    about listed products.

        Parameters:
            product_link_list (link): List of tuples containing strings of url:s of products
                                      to be scraped and lowest listed price of said product

            product_category (str): Name of product model

        Returns:
            store_price_list (list): List of tuples containing various information about
                                     listed prices for all products in product_link_list
    """
    store_price_list = []

    # Scrape all products in provided list
    for product in product_link_list:
        # Get url of product page
        product_link = product[0]

        # Scrape product page
        soup = fetch_product_page(product_link)
        print(f"Fetched {product_link}")

        # Extract price JSON data
        json_data = get_product_json(soup)

        # Extract list of tuples containing information of product listing
        product_price_list = get_product_price_list(
            json_data, product_category)

        # Append list of tuples containing information of product listing to main list
        store_price_list.extend(product_price_list)

        # Wait half a second before scraping next page in list (except for last item in list)
        if product != product_link_list[-1]:
            time.sleep(0.5)

    return store_price_list


def get_price_benchmark_score(product_price_list, benchmark_json) -> list:
    """
    Calculate Price/Performance Score of every product listing in provided list and
    return new list with appended Price/Performance Score to product listing.

        Parameters:
            product_price_list (list): List of tuples containing various information about
                                       listed prices for a product

            benchmark_json (dict): Dictionary where every key is a product and
                                   their value is their benchmark score
        Returns:
            price_score_list (list): List of tuples containing appended information about
                                     the benchmark value and Price/Performance Score of
                                     a product listing
    """

    # Get product name
    benchmark_category = product_price_list[0][0]
    # Get benchmark value of product from product name key
    benchmark_value = benchmark_json[benchmark_category]

    price_score_list = []

    for product in product_price_list:
        # Calculate Price/Performance Score of product listing
        price_score = round(benchmark_value / product[2] * 100, 2)
        # Append benchmark value of product and Price/Performance Score
        # of product listing to tuple containing information about product listing
        new_product_info = product + (benchmark_value, price_score)
        # Append new tuple to new list
        price_score_list.append(new_product_info)

    return price_score_list


def start_price_fetching_gpu(product_choice_list, *, run_locally=False) -> list:
    """
    Scrape prices and calculate Price/Performance Score of product listings for all
    GPU models in provided list.

        Parameters:
            product_choice_list (list): List containing strings of the names of 
                                        GPU models to be scraped

            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            sorted_benchmark_price_list (list): List of tuples containing various
                                                information about every product listing
                                                scraped, including the Price/Performance
                                                Score of every product listing
            Exception if an error occurred during price scraping 
    """
    try:
        try:
            # Load benchmark data for GPUs
            benchmark_json = import_benchmark_from_db("GPU")
            # benchmark_json = import_benchmark_json("GPU", run_locally)
        except:
            return Exception("Error importing benchmarks")

        # List of product listing information for all GPU models in provided list
        benchmark_price_list = []

        # Scrape every model of GPU in provided list of GPUs
        for product_category in product_choice_list:
            # Get the link to GPU model category page
            product_category_url = gpu_pj_url_dict[product_category]

            try:
                # Scrape GPU model category page
                soup_list = fetch_gpu_category_page(product_category_url)
            except:
                return Exception(f"Error fetching GPU category page: {product_category_url}")

            try:
                # Extract JSON data from GPU model category page
                json_list = create_json_list_from_gpu_category(soup_list)
            except:
                return Exception(f"Error creating json for GPU category page: {product_category_url}")

            try:
                # Get the cheapest product listing for GPU model category
                lowest_category_prices = get_lowest_prices_in_gpu_category(
                    json_list, len(product_choice_list))
            except:
                return Exception(f"Error parsing json for GPU category page: {product_category_url}")

            # Wait half a second before scraping product pages
            time.sleep(0.5)

            try:
                # Scrape product pages of cheapest product listings for GPU model
                product_price_list = get_store_price_for_products_from_category(
                    lowest_category_prices, str(product_category))
            except:
                return Exception(f"Error getting store price for product for GPU category page: {product_category_url}")

            # Wait half a second before scraping next GPU category in list (except for last item in list)
            if product_category != product_choice_list[-1]:
                time.sleep(0.5)

            # Go to the next GPU model in list if no products in stock were found for this GPU model
            if len(product_price_list) < 1:
                continue

            # Calculate Price/Performance Score for all product listings for GPU model
            benchmark_score_list = get_price_benchmark_score(
                product_price_list, benchmark_json)

            # Append product listings for GPU model to main list
            benchmark_price_list.extend(benchmark_score_list)

        # If no GPU models in list had any products in store
        if len(benchmark_price_list) < 1:
            return Exception("No products in store for any products in list")

        # Sort list of product listings for all GPU models by the highest Price/Performance Score
        sorted_benchmark_price_list = sorted(
            benchmark_price_list, key=lambda x: x[6], reverse=True)

        return sorted_benchmark_price_list
    except:
        # Catch-all Exception so API doesn't break
        return Exception("Unexpected Error")


def start_price_fetching_cpu(benchmark_type, product_choice_list, *, run_locally=False) -> list:
    """
    Scrape prices and calculate Price/Performance Score of products listings for all
    CPU models in provided list.

        Parameters:
            benchmark_type (str): Type of benchmark data to be compared.
                                  (Must be either "CPU-Gaming" or "CPU-Normal")

            product_choice_list (list): List containing strings of the names of
                                        CPU models to be scraped

            run_locally (bool): Must be True if module is ran outside of Django  

        Returns:
            sorted_benchmark_price_list (list): List of tuples containing various
                                                information about every product listing
                                                scraped, including the Price/Performance
                                                Score of every product listing
            Exception if an error occurred during price scraping
    """
    try:
        try:
            # Load benchmark data for either CPU-Gaming or CPU-Normal
            benchmark_json = import_benchmark_from_db(benchmark_type)
            # benchmark_json = import_benchmark_json(benchmark_type, run_locally)
        except:
            return Exception("Error importing benchmarks")

        cpu_url_dict = cpu_pj_url_dict

        # List of product listing information for all CPU models in provided list
        benchmark_price_list = []

        # Scrape every model of CPU in provided list of CPUs
        for product in product_choice_list:
            # Get the link to CPU model product page
            product_link = cpu_url_dict[product]

            print(f"Trying to fetch {product}")
            try:
                # Scrape CPU model product page
                soup = fetch_product_page(product_link)
                print(f"Fetched {product_link}")
            except:
                return Exception(f"Error fetching URL: {product_link}")

            try:
                # Extract JSON data from CPU model product page
                json_data = get_product_json(soup)
            except:
                return Exception(f"Error creating json for {product_link}")

            try:
                # Calculate Price/Performance Score for all product listings for CPU model
                product_price_list = get_product_price_list(json_data, product)
            except:
                return Exception(f"Error parsing json for {product_link}")

            # Go to the next CPU model in list of no products in stock were found for this CPU model
            if len(product_price_list) < 1:
                continue

            # Calculate Price/Performance Score for all product listings for CPU model
            product_benchmark_price_list = get_price_benchmark_score(
                product_price_list, benchmark_json)

            # Append product listings for CPU model to main list
            benchmark_price_list.extend(product_benchmark_price_list)

            # Wait half a second before scraping next CPU model in list (except for last item in list)
            if product != product_choice_list[-1]:
                time.sleep(0.5)

        # If no CPU models in list had any products in store
        if len(benchmark_price_list) < 1:
            return Exception("No products in store for any products in list")

        # Sort list of product listings for all CPU models by the highest Price/Performance Score
        sorted_benchmark_price_list = sorted(
            benchmark_price_list, key=lambda x: x[6], reverse=True)

        return sorted_benchmark_price_list
    except:
        # Catch-all Exception so API doesn't break
        return Exception("Unexpected Error")


def test_fetch_product_page(product_name, product_category) -> str:
    """
    Test if the contents of a product page is fetchable.

        Parameters:
            product_name (str): Name of the product whose page will be fetched
                                (Product must be a key in cpu_pj_url_dict)
            product_category (str): Category for the product
                                    (Must be either "CPU-Gaming" or "CPU-Normal")

        Returns:
            status_code_and_content_str (str): Returns the status code of the request
                                               and either the product price list of 
                                               the page if content was fetchable, 
                                               or the text of everything inside the body tag
                                               of the page if page was not fetchable.
    """
    product_url = ""
    status_code = ""

    if product_category != "CPU-Gaming" and product_category != "CPU-Normal":
        return "Invalid category"

    try:
        product_url = cpu_pj_url_dict[product_name]
    except:
        return "Invalid product"

    scraper = cloudscraper.create_scraper()
    response = scraper.get(product_url)

    status_code = str(response.status_code)
    soup = BeautifulSoup(response.text, "html.parser")

    content = ""
    try:
        json_data = get_product_json(soup)
    except:
        content = soup.body.text
    else:
        product_price_list = get_product_price_list(
            json_data, product_category)
        content = " ".join(map(str, product_price_list))

    status_code_and_content_str = f"{status_code} - {content}"

    return status_code_and_content_str


def test_number_of_fetches_possible(product_list, product_category):
    if product_category != "CPU-Gaming" and product_category != "CPU-Normal":
        return "Invalid category"

    if not isinstance(product_list, list):
        return "Invalid product list"

    product_url_list = []
    for product in product_list:
        try:
            product_url = cpu_pj_url_dict[product]
            product_url_list.append(product_url)
        except:
            return f"{product}: Invalid product"

    scraper = cloudscraper.create_scraper()

    status_code_str = ""
    for i, product_url in enumerate(product_url_list, 1):
        response = scraper.get(product_url)

        status_code = str(response.status_code)

        status_code_str = f"{status_code_str} {i}: {status_code}"

        if product != product_url_list[-1]:
            time.sleep(0.5)

    return status_code_str


if __name__ == "__main__":
    pass
