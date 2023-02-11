import json
from bs4 import BeautifulSoup
import requests
import re



def import_benchmark_json(benchmark_type):
    with open(f"benchmarks/latest/{benchmark_type}.json", "r") as f:
        data = json.load(f)
    return data

def get_prices_test():
    # 1 Page (3080)
    # url = "https://www.prisjakt.nu/c/grafikkort?532=36254"
    # 1 Page (4090)
    # url = "https://www.prisjakt.nu/c/grafikkort?532=39780"
    # 17 Pages (NVIDIA GeForce Grafikkort)
    url = "https://www.prisjakt.nu/c/grafikkort?103551=36436"

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    tag = soup.find("a", {"aria-label": "Visa nästa"})
    if tag:
        link = f"https://www.prisjakt.nu{tag['href']}"
        print(link)
    else:
        print("No link")

    # TODO: Change to return SOUP OBJECT instead of writing file
    with open("pjmultpagetest3.html", "w", encoding="utf-8") as file:
        file.write(soup.prettify())

def write_local_json_file(page_list):
    for index, page in enumerate(page_list, start=1):
        # TODO: Change to SOUP OBJECT instead of file
        with open(page, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file, "html.parser")
    
        page_json = soup.find_all("script")[5].text

        start_text = r'{"__typename":"ProductsSlice"'
        end_text = r',{"__typename":"DescriptionSlice"'
        price_data = re.search(f"{start_text}.*?(?={end_text})", page_json).group(0)
        # price_data = re.search(f"{start_text}(.*?){end_text}", page_json).group(1)

        price_data = price_data.replace("\\", "")
        json_data = json.loads(price_data)

        with open(f"pjmultpagejson{index}.json", "w") as file:
            json.dump(json_data, file, indent=4)


def get_gpu_price_list(page_list):
    price_list = []

    for page in page_list:
        # TODO: Change to JSON OBJECT instead of file
        with open(page) as file:
            products_json = json.load(file)

        for product in products_json["products"]:
            if product["priceSummary"]["regular"] != None:
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
pj_json = ["pjmultpagejson1.json", "pjmultpagejson2.json", "pjmultpagejson3.json"]

print(get_gpu_price_list(pj_json))

# write_local_json_file(pj_pages)


# get_prices_test()