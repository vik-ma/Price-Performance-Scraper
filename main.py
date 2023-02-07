import json
from bs4 import BeautifulSoup
import requests



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

    price_body = soup.find("tbody")
    for tr in price_body.find_all("tr"):
        product = tr.find("a")
        if product:
            link = f"https://www.prisjakt.nu{product['href']}"
            price_dict[link] = 0
        # print(link)
        # print("end")


    # tag = soup.find("a", {"aria-label": "Visa nästa"})
    # if tag:
    #     href = f"https://www.prisjakt.nu{tag['href']}"
    #     print(href)
    # else:
    #     print("none")
