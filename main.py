import json
from bs4 import BeautifulSoup
import requests
import re
import datetime
import time

gpu_pj_url_dict = {
    "TOP TIER": {
        "GeForce RTX 4090": "https://www.prisjakt.nu/c/grafikkort?532=39780",
        "GeForce RTX 4080": "https://www.prisjakt.nu/c/grafikkort?532=39779",
        },
    "HIGH TIER": {
        "Radeon RX 7900 XTX": "https://www.prisjakt.nu/c/grafikkort?532=39908",
        "GeForce RTX 4070 Ti": "https://www.prisjakt.nu/c/grafikkort?532=40333",
        "Radeon RX 6950 XT": "https://www.prisjakt.nu/c/grafikkort?532=39794",
        "Radeon RX 7900 XT": "https://www.prisjakt.nu/c/grafikkort?532=39907",
        },
    "UPPER MID TIER": {
        "Radeon RX 6800 XT": "https://www.prisjakt.nu/c/grafikkort?532=36621",
        "GeForce RTX 3070 Ti": "https://www.prisjakt.nu/c/grafikkort?532=36434",
        "GeForce RTX 3070": "https://www.prisjakt.nu/c/grafikkort?532=36253",
        "Radeon RX 6800": "https://www.prisjakt.nu/c/grafikkort?532=36622",
        "Radeon RX 6750 XT": "https://www.prisjakt.nu/c/grafikkort?532=39911",
        },
    "LOWER MID TIER": {
        "GeForce RTX 3060 Ti": "https://www.prisjakt.nu/c/grafikkort?532=36433",
        "Radeon RX 6700 XT": "https://www.prisjakt.nu/c/grafikkort?532=36619",
        "Radeon RX 6700": "https://www.prisjakt.nu/c/grafikkort?532=36620",
        },
    "LOW TIER": {
        "Radeon RX 6650 XT": "https://www.prisjakt.nu/c/grafikkort?532=39910",
        "GeForce RTX 3060": "https://www.prisjakt.nu/c/grafikkort?532=36256",
        "Radeon RX 6600 XT": "https://www.prisjakt.nu/c/grafikkort?532=37636",
        "Radeon RX 6600": "https://www.prisjakt.nu/c/grafikkort?532=37787",
        "GeForce RTX 2060": "https://www.prisjakt.nu/c/grafikkort?532=32050",
        },
    "BOTTOM TIER": {
        "GeForce GTX 1660 Ti": "https://www.prisjakt.nu/c/grafikkort?532=32120",
        "GeForce GTX 1660 SUPER": "https://www.prisjakt.nu/c/grafikkort?532=32763",
        "GeForce RTX 3050": "https://www.prisjakt.nu/c/grafikkort?532=38072",
        "GeForce GTX 1660": "https://www.prisjakt.nu/c/grafikkort?532=32119",
        "Radeon RX 6500 XT": "https://www.prisjakt.nu/c/grafikkort?532=38073",
        "Radeon RX 6400": "https://www.prisjakt.nu/c/grafikkort?532=39913",
        },
    }

cpu_pj_url_dict = {
    "AMD Ryzen 9 5950X": "https://www.prisjakt.nu/produkt.php?p=5588372",
    "AMD Ryzen 9 5900X": "https://www.prisjakt.nu/produkt.php?p=5588367",
    "AMD Ryzen 7 5800X": "https://www.prisjakt.nu/produkt.php?p=5588364",
    "AMD Ryzen 7 5800X3D": "https://www.prisjakt.nu/produkt.php?p=6040557",
    "AMD Ryzen 7 5700X": "https://www.prisjakt.nu/produkt.php?p=6040676",
    "AMD Ryzen 5 5600X": "https://www.prisjakt.nu/produkt.php?p=5588360",
    "AMD Ryzen 5 5600": "https://www.prisjakt.nu/produkt.php?p=6090826",
    "AMD Ryzen 5 5500": "https://www.prisjakt.nu/produkt.php?p=6090894",
    "AMD Ryzen 9 7950X": "https://www.prisjakt.nu/produkt.php?p=6999752",
    "AMD Ryzen 9 7900X": "https://www.prisjakt.nu/produkt.php?p=6999757",
    "AMD Ryzen 9 7900": "https://www.prisjakt.nu/produkt.php?p=7328156",
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

cpu_socket_dict = {
    "Socket AM4": {
        "AMD Ryzen 9 5950X",
        "AMD Ryzen 9 5900X",
        "AMD Ryzen 7 5800X",
        "AMD Ryzen 7 5800X3D",
        "AMD Ryzen 7 5700X",
        "AMD Ryzen 5 5600X",
        "AMD Ryzen 5 5600",
        "AMD Ryzen 5 5500",
    },
    "Socket AM5": {
        "AMD Ryzen 9 7950X",
        "AMD Ryzen 9 7900X",
        "AMD Ryzen 9 7900",
        "AMD Ryzen 7 7700X",
        "AMD Ryzen 7 7700",
        "AMD Ryzen 5 7600X",
        "AMD Ryzen 5 7600",
    },
    "Socket LGA 1700": {
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
    }
}

cpu_normal_tier_dict = {
    "TOP TIER":{
        "AMD Ryzen 9 5950X",
        "AMD Ryzen 9 7950X",
        "AMD Ryzen 9 7900X",
        "AMD Ryzen 9 7900",
        "Intel Core i9-13900KS",
        "Intel Core i9-13900K",
        "Intel Core i9-13900KF",
        "Intel Core i9-13900F",
        "Intel Core i9-13900",
        "Intel Core i7-13700K",
        "Intel Core i7-13700KF",
    },
    "HIGH TIER": {
        "AMD Ryzen 9 5900X",
        "AMD Ryzen 7 7700X",
        "AMD Ryzen 7 7700",
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
    },
    "MID TIER": {
        "AMD Ryzen 7 5800X",
        "AMD Ryzen 7 5800X3D",
        "AMD Ryzen 7 5700X",
        "AMD Ryzen 5 7600X",
        "AMD Ryzen 5 7600",
        "Intel Core i5-13500",
        "Intel Core i7-12700F",
        "Intel Core i7-12700",
        "Intel Core i5-12600K",
        "Intel Core i5-12600KF",
        "Intel Core i5-13400",
        "Intel Core i5-13400F",
    },
    "LOW TIER": {
        "AMD Ryzen 5 5600X",
        "AMD Ryzen 5 5600",
        "Intel Core i5-12600",
        "Intel Core i5-12500",
        "Intel Core i5-12400F",
        "Intel Core i5-12400",
        "AMD Ryzen 5 5500",   
    },
}

cpu_gaming_tier_dict = {
    "TOP TIER":{
        "Intel Core i9-13900KS",
        "Intel Core i9-13900K",
        "Intel Core i9-13900KF",
    },
    "HIGH TIER": {
        "AMD Ryzen 7 5800X3D",
        "AMD Ryzen 9 7900X",
        "AMD Ryzen 5 7600X",
        "AMD Ryzen 5 7600",
        "AMD Ryzen 9 7950X",
        "AMD Ryzen 7 7700X",
        "Intel Core i7-13700K",
        "Intel Core i7-13700KF",
        "Intel Core i7-13700",
        "Intel Core i7-13700F",
        "Intel Core i5-13600K",
        "Intel Core i5-13600KF",
        "Intel Core i9-12900KS",
        "Intel Core i9-12900K",
        "Intel Core i9-12900KF",
    },
    "MID TIER": {
        "AMD Ryzen 9 5900X",
        "AMD Ryzen 5 5600X",
        "Intel Core i9-12900F",
        "Intel Core i9-12900",
        "Intel Core i5-12600K",
        "Intel Core i7-12700K",
        "Intel Core i5-13500",
        "Intel Core i5-12600KF",
        "Intel Core i7-12700KF",
        "Intel Core i5-13400",
    },
    "LOW TIER": {
        "AMD Ryzen 5 5600",
        "AMD Ryzen 7 5800X",
        "AMD Ryzen 9 5950X",
        "AMD Ryzen 7 5700X",
        "Intel Core i5-12600",
        "Intel Core i7-12700",
        "Intel Core i5-13400F",
        "Intel Core i7-12700F",
        "Intel Core i5-12500",
        "Intel Core i5-12400F",
        "Intel Core i5-12400",
    },
    "BOTTOM TIER": {
        "AMD Ryzen 5 5500",
        "AMD Ryzen 9 7900",
        "AMD Ryzen 7 7700"
    }
}


def import_benchmark_json(benchmark_type):
    with open(f"benchmarks/latest/{benchmark_type}.json", "r") as file:
        data = json.load(file)
    return data


def fetch_gpu_category_page(url):
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

            print("Sleeping until next page")
            time.sleep(0.5)

            response = requests.get(next_page_link)
            soup = BeautifulSoup(response.text, "html.parser")
            print(next_page_link)

            soup_list.append(soup)
            # save_local_html_page(soup)
    else:
        print("Only one page in category")

    return soup_list


def fetch_product_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    return soup
    # save_local_html_page(soup, "pjproductpagecpu.html")


def test_local_html_page():
    with open("pjproductpagecpu.html", "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    json_data = get_product_json(soup)

    write_local_json_files([json_data])


def test_local_json_file():
    with open("pj_json_2023-02-15_08-38-43_1.json", "r") as file:
        json_data = json.load(file)
    
    product_price_list = get_product_price_list(json_data, "ASD")

    for product in product_price_list:
        print(product)



def get_product_json(soup):
    page_json = soup.find_all("script")[7].text

    start_text = r'"prices":'
    end_text = r',"popularProducts"'
    price_data = re.search(f"{start_text}.*?(?={end_text})", page_json).group(0)

    price_data = f"{{{price_data}}}"
    price_data = price_data.replace("\\", "")

    json_data = json.loads(price_data)

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
    slice_num = 4
    list_slicer = int(len(sorted_price_list) / slice_num)

    lowest_price_list = sorted_price_list[:list_slicer]
    
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
    benchmark_value = int(benchmark_json[benchmark_category].replace(",", ""))

    price_score_list = []
    for product in product_price_list:
        price_score = round(benchmark_value / product[2], 3)
        new_product_info = product + (price_score,)
        price_score_list.append(new_product_info)
    
    return price_score_list

def start_price_fetching_gpu(tier_choice):
    benchmark_json = import_benchmark_json("GPU")

    benchmark_price_list = []
    for product_category, product_category_url in tier_choice.items():
        soup_list = fetch_gpu_category_page(product_category_url)
        json_list = create_json_list_from_gpu_category(soup_list)
        lowest_category_prices = get_lowest_prices_in_gpu_category(json_list)
        product_price_list = get_store_price_for_products_from_category(lowest_category_prices, str(product_category))
        benchmark_score_list = get_price_benchmark_score(product_price_list, benchmark_json)
        benchmark_price_list.extend(benchmark_score_list)
    
    sorted_benchmark_price_list = sorted(benchmark_price_list, key = lambda x: x[5], reverse=True)

    for entry in sorted_benchmark_price_list:
        print(entry)

def start_price_fetching_cpu(benchmark_type, cpu_url_dict, product_choice_dict):
    benchmark_json = import_benchmark_json(benchmark_type)

    store_price_list = []

    for product in product_choice_dict:
        product_link = cpu_url_dict[product]

        soup = fetch_product_page(product_link)
        print(f"Fetched {product_link}")

        json_data = get_product_json(soup)

        product_price_list = get_product_price_list(json_data, product)
        store_price_list.extend(product_price_list)

        time.sleep(0.5)

    benchmark_price_list = get_price_benchmark_score(store_price_list, benchmark_json)

    sorted_benchmark_price_list = sorted(benchmark_price_list, key = lambda x: x[5], reverse=True)

    for entry in sorted_benchmark_price_list:
        print(entry)



start_price_fetching_cpu("CPU-Gaming", cpu_pj_url_dict, cpu_gaming_tier_dict["TOP TIER"])


# fetch_product_page(cpu_pj_url_dict["Intel Core i9-13900KS"])
# test_local_json_file()

# start_price_fetching_gpu(gpu_pj_url_dict["UPPER MID TIER"])

# get_price_benchmark_score(product_price_list, gpu_benchmarks)

# pj_pages = ["pjmultpagetest.html", "pjmultpagetest2.html", "pjmultpagetest3.html"]
# pj_pages_2 = ["pjtest_2023-02-11_23-22-24.html", "pjtest_2023-02-11_23-22-25.html"]
# pj_json = ["pjmultpagejson1.json", "pjmultpagejson2.json", "pjmultpagejson3.json"]

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
# Product Page (Gigabyte GeForce RTX 4090 Gaming OC HDMI 3x DP 24GB)
# url = "https://www.prisjakt.nu/produkt.php?p=7124177"

# gpu_price_list = get_gpu_category_price_list(["pj_json_2023-02-12_00-30-01_1.json"], read_local_json_list=True)[:3]
# products_in_stock_list = get_store_price_for_product(gpu_price_list, "GeForce RTX 4090")
# for product in products_in_stock_list:
#     print(product)

# product_list = ["https://www.prisjakt.nu/produkt.php?p=7124177", "https://www.prisjakt.nu/produkt.php?p=7123378", "https://www.prisjakt.nu/produkt.php?p=7123212"]

# fetch_product_page(url)

# html_soup_list = fetch_html_page(url)
# json_list = create_json_list(html_soup_list)
# print(get_gpu_price_list(json_list))

# write_local_json_files(json_list)

# json_list = create_json_list(pj_pages_2, read_local_files=True)


# print(len(gpu_price_list))
# print(gpu_price_list)

# test_local_html_page()
# test_local_json_file()

