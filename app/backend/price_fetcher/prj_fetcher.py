import json
from bs4 import BeautifulSoup
import requests
import re
import datetime
import time
from decimal import Decimal, ROUND_HALF_UP

gpu_pj_url_dict = {
    "GeForce RTX 4090": "https://www.prisjakt.nu/c/grafikkort?532=39780",
    "GeForce RTX 4080": "https://www.prisjakt.nu/c/grafikkort?532=39779",
    "Radeon RX 7900 XTX": "https://www.prisjakt.nu/c/grafikkort?532=39908",
    "GeForce RTX 4070 Ti": "https://www.prisjakt.nu/c/grafikkort?532=40333",
    "Radeon RX 6950 XT": "https://www.prisjakt.nu/c/grafikkort?532=39794",
    "Radeon RX 7900 XT": "https://www.prisjakt.nu/c/grafikkort?532=39907",
    "Radeon RX 6800 XT": "https://www.prisjakt.nu/c/grafikkort?532=36621",
    "GeForce RTX 4070": "https://www.prisjakt.nu/c/grafikkort?532=40332",
    "Radeon RX 6800": "https://www.prisjakt.nu/c/grafikkort?532=36622",
    "GeForce RTX 3070 Ti": "https://www.prisjakt.nu/c/grafikkort?532=36434",
    "GeForce RTX 3070": "https://www.prisjakt.nu/c/grafikkort?532=36253",
    "Radeon RX 6750 XT": "https://www.prisjakt.nu/c/grafikkort?532=39911",
    "Radeon RX 6700 XT": "https://www.prisjakt.nu/c/grafikkort?532=36619",
    "GeForce RTX 3060 Ti": "https://www.prisjakt.nu/c/grafikkort?532=36433",
    "Radeon RX 6700": "https://www.prisjakt.nu/c/grafikkort?532=36620",
    "Radeon RX 6650 XT": "https://www.prisjakt.nu/c/grafikkort?532=39910",
    "Radeon RX 6600 XT": "https://www.prisjakt.nu/c/grafikkort?532=37636",
    "Radeon RX 6600": "https://www.prisjakt.nu/c/grafikkort?532=37787",
    "GeForce RTX 3060": "https://www.prisjakt.nu/c/grafikkort?532=36256",
    "GeForce RTX 2060": "https://www.prisjakt.nu/c/grafikkort?532=32050",
    "GeForce RTX 3050": "https://www.prisjakt.nu/c/grafikkort?532=38072",
    "GeForce GTX 1660 Ti": "https://www.prisjakt.nu/c/grafikkort?532=32120",
    "GeForce GTX 1660 SUPER": "https://www.prisjakt.nu/c/grafikkort?532=32763",
    "GeForce GTX 1660": "https://www.prisjakt.nu/c/grafikkort?532=32119",
    "Radeon RX 6500 XT": "https://www.prisjakt.nu/c/grafikkort?532=38073",
    "Radeon RX 6400": "https://www.prisjakt.nu/c/grafikkort?532=39913",  
}

cpu_pj_url_dict = {
    "AMD Ryzen 9 5950X": "https://www.prisjakt.nu/produkt.php?p=5588372",
    "AMD Ryzen 9 5900X": "https://www.prisjakt.nu/produkt.php?p=5588367",
    "AMD Ryzen 7 5800X": "https://www.prisjakt.nu/produkt.php?p=5588364",
    "AMD Ryzen 7 5800X3D": "https://www.prisjakt.nu/produkt.php?p=6040557",
    "AMD Ryzen 7 5700X": "https://www.prisjakt.nu/produkt.php?p=6040676",
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

def import_benchmark_json(benchmark_type, run_locally = False):
    if run_locally:
        file_path = f"app/backend/price_fetcher/benchmarks/latest_benchmarks/{benchmark_type}.json"
    else:
        file_path = f"price_fetcher/benchmarks/latest_benchmarks/{benchmark_type}.json"
    with open(file_path, "r") as file:
        data = json.load(file)
    return data


def fetch_gpu_category_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    soup_list = []
    soup_list.append(soup)

    next_page_tag = soup.find("a", {"aria-label": "Visa nästa"})
    if next_page_tag:
        num_pages_tag = soup.find("ul", {"data-test": "Pagination"})
        num_pages = int(num_pages_tag.find_all("li")[-2].text.strip())

        for i in range(1, num_pages):
            offset_num = i * 44
            next_page_link = f"{url}&offset={offset_num}"

            print("Sleeping until next page")
            time.sleep(0.5)

            response = requests.get(next_page_link)
            soup = BeautifulSoup(response.text, "html.parser")
            print(next_page_link)

            soup_list.append(soup)
    else:
        print("Only one page in category")

    return soup_list


def fetch_product_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    return soup


def test_local_html_page(filename):
    with open(filename, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")
    
    json_list = create_json_list_from_gpu_category([soup])

    low = get_lowest_prices_in_gpu_category(json_list)




def test_local_json_file():
    with open("pj_json_2023-02-15_08-38-43_1.json", "r") as file:
        json_data = json.load(file)
    
    product_price_list = get_product_price_list(json_data, "ASD")

    for product in product_price_list:
        print(product)


def get_product_json(soup):
    page_json = soup.find_all("script")[6].text

    start_text = r'"prices":'
    end_text = r',"popularProducts"'
    price_data = re.search(f"{start_text}.*?(?={end_text})", page_json).group(0)

    price_data = f"{{{price_data}}}"

    reencoded_price_data = price_data.encode('utf-8').decode('unicode_escape')

    json_data = json.loads(reencoded_price_data)

    return json_data


def get_product_price_list(json_data, product_category):
    product_list = []
    for product in json_data["prices"]["nodes"]:
        if product["stock"]["status"] == "in_stock" and product["store"]["currency"] == "SEK":
            store_name = product["store"]["name"]
            store_price = int(product["price"]["exclShipping"])
            product_name = product["name"]
            product_link = product["externalUri"]
            product_list.append((product_category, store_name, store_price, product_link, product_name))
    return product_list


def get_current_time():
    return datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")


def save_local_html_page(soup, filename=None):
    if filename:
        target_filename = filename
    else:
        current_time = get_current_time()
        target_filename = f"pjtest_{current_time}.html"

    with open(target_filename, "w", encoding="utf-8") as file:
        file.write(soup.prettify())


def create_json_list_from_gpu_category(soup_list, *, read_local_files=False):
    # FROM LOCAL HTML FILES 
    # soup_list is list of strings of file paths
    if read_local_files:
        local_html_list = soup_list
        soup_list = []
        for html_file in local_html_list:
            with open(html_file, "r", encoding="utf-8") as file:
                soup = BeautifulSoup(file, "html.parser")
                soup_list.append(soup)

    json_list = []
    for soup in soup_list:
        page_json = soup.find_all("script")[4].text

        start_text = r'{"__typename":"ProductsSlice"'
        end_text = r',{"__typename":"DescriptionSlice"'
        price_data = re.search(f"{start_text}.*?(?={end_text})", page_json).group(0)

        reencoded_price_data = price_data.encode('utf-8').decode('unicode_escape')

        json_data = json.loads(reencoded_price_data)

        json_list.append(json_data)

    return json_list


def write_local_json_files(json_list):
    current_time = get_current_time()

    for i, json_file in enumerate(json_list, start=1):
        with open(f"pj_json_{current_time}_{i}.json", "w") as file:
            json.dump(json_file, file, indent=4)


def get_lowest_prices_in_gpu_category(json_list, *, read_local_json_list=False):
    # FROM LOCAL JSON FILES 
    # json_list is list of strings of file paths
    if read_local_json_list:
        local_json_list = json_list
        json_list = []
        for json_file in local_json_list:
            with open(json_file) as file:
                products_json = json.load(file)
                json_list.append(products_json)

    price_list = []

    for products_json in json_list:
        for product in products_json["products"]:
            if product["priceSummary"]["regular"] != None and product["stockStatus"] == "in_stock":
                product_id = product["id"]
                product_link = f"https://www.prisjakt.nu/produkt.php?p={product_id}"
                product_price = int(product["priceSummary"]["regular"])
                price_list.append((product_link, product_price))

    sorted_price_list = sorted(price_list, key = lambda x: x[1])

    if len(sorted_price_list) <= 16:
        lowest_price_list = sorted_price_list[:4]
    elif len(sorted_price_list) > 40:
        lowest_price_list = sorted_price_list[:10]
    else:
        slice_num = 4
        list_slicer = len(sorted_price_list) / slice_num
        rounded_list_slicer = int(Decimal(list_slicer).quantize(0, ROUND_HALF_UP))

        lowest_price_list = sorted_price_list[:rounded_list_slicer]
        
    return lowest_price_list


def get_store_price_for_products_from_category(product_link_list, product_category):
    store_price_list = []

    for product in product_link_list:
        product_link = product[0]

        soup = fetch_product_page(product_link)
        print(f"Fetched {product_link}")

        json_data = get_product_json(soup)

        product_price_list = get_product_price_list(json_data, product_category)
        store_price_list.extend(product_price_list)
        if product != product_link_list[-1]:
            time.sleep(0.5)

    return store_price_list


def get_price_benchmark_score(product_price_list, benchmark_json):
    benchmark_category = product_price_list[0][0]
    benchmark_value = benchmark_json[benchmark_category]

    price_score_list = []
    for product in product_price_list:
        price_score = round(benchmark_value / product[2] * 100, 2)
        new_product_info = product + (benchmark_value, price_score)
        price_score_list.append(new_product_info)
    
    return price_score_list


def start_price_fetching_gpu(product_choice_list, *, run_locally = False):
    try:
        try:
            benchmark_json = import_benchmark_json("GPU", run_locally)
        except:
            return Exception("Error importing benchmarks")

        benchmark_price_list = []
        for product_category in product_choice_list:
            product_category_url = gpu_pj_url_dict[product_category]

            try:
                soup_list = fetch_gpu_category_page(product_category_url)
            except:
                return Exception(f"Error fetching GPU category page: {product_category_url}")

            try:
                json_list = create_json_list_from_gpu_category(soup_list)
            except:
                return Exception(f"Error creating json for GPU category page: {product_category_url}")

            try:
                lowest_category_prices = get_lowest_prices_in_gpu_category(json_list)
            except:
                return Exception(f"Error parsing json for GPU category page: {product_category_url}")

            try:
                product_price_list = get_store_price_for_products_from_category(lowest_category_prices, str(product_category))
            except:
                return Exception(f"Error getting store price for product for GPU category page: {product_category_url}")
            
            if len(product_price_list) < 1:
                continue

            benchmark_score_list = get_price_benchmark_score(product_price_list, benchmark_json)
            benchmark_price_list.extend(benchmark_score_list)
        
        if len(benchmark_price_list) < 1:
            return Exception("No products in store for any products in list")
            
        sorted_benchmark_price_list = sorted(benchmark_price_list, key = lambda x: x[6], reverse=True)

        return sorted_benchmark_price_list
    except:
        return Exception("Unexpected Error")


def start_price_fetching_cpu(benchmark_type, product_choice_list, *, run_locally = False):
    try:
        try:
            benchmark_json = import_benchmark_json(benchmark_type, run_locally)
        except:
            return Exception("Error importing benchmarks")

        cpu_url_dict = cpu_pj_url_dict

        benchmark_price_list = []

        for product in product_choice_list:
            product_link = cpu_url_dict[product]

            print(f"Trying to fetch {product}")
            try:
                soup = fetch_product_page(product_link)
                print(f"Fetched {product_link}")
            except:
                return Exception(f"Error fetching URL: {product_link}")

            try:
                json_data = get_product_json(soup)
            except:
                return Exception(f"Error creating json for {product_link}")

            try:
                product_price_list = get_product_price_list(json_data, product)
            except:
                return Exception(f"Error parsing json for {product_link}")

            if len(product_price_list) < 1:
                continue

            product_benchmark_price_list = get_price_benchmark_score(product_price_list, benchmark_json)

            benchmark_price_list.extend(product_benchmark_price_list)

            if product != product_choice_list[-1]:
                time.sleep(0.5)

        if len(benchmark_price_list) < 1:
            return Exception("No products in store for any products in list")

        sorted_benchmark_price_list = sorted(benchmark_price_list, key = lambda x: x[6], reverse=True)

        return sorted_benchmark_price_list
    except:
        return Exception("Unexpected Error")


if __name__ == "__main__":
    pass
