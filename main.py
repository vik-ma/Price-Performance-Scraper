import json
from bs4 import BeautifulSoup
import requests
import re



def import_benchmark_json(benchmark_type):
    with open(f"benchmarks/latest/{benchmark_type}.json", "r") as f:
        data = json.load(f)
    return data

def get_prices_test():
    # 2 Pages (3080)
    url = "https://www.prisjakt.nu/c/grafikkort?532=36254"
    # 1 Page (4090)
    # url = "https://www.prisjakt.nu/c/grafikkort?532=39780"

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    tag = soup.find("a", {"aria-label": "Visa nästa"})
    if tag:
        link = f"https://www.prisjakt.nu{tag['href']}"
        print(link)
    else:
        print("No link")


    # with open("pj.html", "w", encoding="utf-8") as file:
    #     file.write(soup.prettify())

def local_page_test():
    with open("pj.html", "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    price_dict = {}
    
    page_json = soup.find_all("script")[5].string

    start_text = r'{"__typename":"ProductsSlice"'
    end_text = r',{"__typename":"DescriptionSlice"'
    price_data = re.search(f"{start_text}.*?(?={end_text})", page_json).group(0)
    # price_data = re.search(f"{start_text}(.*?){end_text}", page_json).group(1)

    # json_data = json.loads(price_data)

    print(price_data)
    # with open("pjtestt.json", "w") as file:
    #     json.dump(json_data, file)


    # price_body = soup.find("tbody")
    # for tr in price_body.find_all("tr"):
    #     product = tr.find("a")
    #     if product:
    #         link = f"https://www.prisjakt.nu{product['href']}"
    #         price_dict[link] = 0
        # print(link)
        # print("end")
    # print(price_dict)


    # tag = soup.find("a", {"aria-label": "Visa nästa"})
    # if tag:
    #     href = f"https://www.prisjakt.nu{tag['href']}"
    #     print(href)
    # else:
    #     print("none")

local_page_test()
# get_prices_test()