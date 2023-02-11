import json
from bs4 import BeautifulSoup
import requests
import re
import datetime
import time


def import_benchmark_json(benchmark_type):
    with open(f"benchmarks/latest/{benchmark_type}.json", "r") as f:
        data = json.load(f)
    return data

def fetch_html_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    soup_list = []
    soup_list.append(soup)
    # save_local_html_page(soup)

    next_page_tag = soup.find("a", {"aria-label": "Visa nästa"})
    if next_page_tag:
        num_pages_tag = soup.find("ul", {"data-test": "Pagination"})
        num_pages = int(num_pages_tag.find_all("li")[-2].text.strip())

        for i in range(1, num_pages):
            offset_num = i * 44
            next_page_link = f"{url}&offset={offset_num}"

            print("sleeping")
            time.sleep(0.5)

            response = requests.get(next_page_link)
            soup = BeautifulSoup(response.text, "html.parser")
            print(next_page_link)

            soup_list.append(soup)
            # save_local_html_page(soup)
    else:
        print("No next page tag")

    return soup_list

def test_local_html_page():
    with open("pj.html", "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

def get_current_time():
    return datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

def save_local_html_page(soup):
    current_time = get_current_time()
    with open(f"pjtest_{current_time}.html", "w", encoding="utf-8") as file:
        file.write(soup.prettify())

def create_json_list(soup_list, *, read_local_files=False):
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
        page_json = soup.find_all("script")[5].text

        start_text = r'{"__typename":"ProductsSlice"'
        end_text = r',{"__typename":"DescriptionSlice"'
        price_data = re.search(f"{start_text}.*?(?={end_text})", page_json).group(0)

        price_data = price_data.replace("\\", "")
        json_data = json.loads(price_data)

        json_list.append(json_data)
    return json_list

def write_local_json_files(json_list):
    current_time = get_current_time()

    for i, json_file in enumerate(json_list, start=1):
        with open(f"pj_json_{current_time}_{i}.json", "w") as file:
            json.dump(json_file, file, indent=4)

def get_gpu_price_list(json_list, *, read_local_json_list=False):
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
    slice_num = 4
    list_slicer = int(len(sorted_price_list) / slice_num)

    sorted_price_list = sorted_price_list[:list_slicer]
    
    return sorted_price_list

pj_pages = ["pjmultpagetest.html", "pjmultpagetest2.html", "pjmultpagetest3.html"]
pj_pages_2 = ["pjtest_2023-02-11_23-22-24.html", "pjtest_2023-02-11_23-22-25.html"]
pj_json = ["pjmultpagejson1.json", "pjmultpagejson2.json", "pjmultpagejson3.json"]

# print(get_gpu_price_list(pj_json))

# write_local_json_file(pj_pages)

# test_local_html_page()

# 1 Page (3080)
# url = "https://www.prisjakt.nu/c/grafikkort?532=36254"
# 1 Page (4090)
# url = "https://www.prisjakt.nu/c/grafikkort?532=39780"
# 17 Pages (NVIDIA GeForce Grafikkort)
# url = "https://www.prisjakt.nu/c/grafikkort?103551=36436"
# 4 Pages
# url = "https://www.prisjakt.nu/c/videoredigering"
# 2 Pages
# url = "https://www.prisjakt.nu/c/optiska-enheter-for-datorer?557=1093"

# html_soup_list = fetch_html_page(url)
# json_list = create_json_list(html_soup_list)
# print(get_gpu_price_list(json_list))

# write_local_json_files(json_list)

# json_list = create_json_list(pj_pages_2, read_local_files=True)

gpu_price_list = get_gpu_price_list(["pj_json_2023-02-12_00-30-01_1.json"], read_local_json_list=True)

# print(len(gpu_price_list))
print(gpu_price_list)

