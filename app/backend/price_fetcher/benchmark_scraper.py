import requests
from bs4 import BeautifulSoup
import json
import datetime
import time
import logging
import os

# ADDING NEW MODEL TODOLIST:
#     UPDATE BENCHMARK SCRAPER LIST
#     UPDATE PJ URL SET
#     UPDATE API VIEWS.PY ALLOWED LIST
#     UPDATE PRODUCTLIST (FRONT END)
#         UPDATE TIERS PRODUCTLIST

list_of_gpus_to_scrape = [
    "GeForce RTX 4090",
    "GeForce RTX 4080",
    "Radeon RX 7900 XTX",
    "GeForce RTX 4070 Ti",
    "Radeon RX 6950 XT",
    "Radeon RX 7900 XT",
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
    ]

list_of_cpus_to_scrape = [
    "AMD Ryzen 9 5950X",
    "AMD Ryzen 9 5900X",
    "AMD Ryzen 7 5800X",
    "AMD Ryzen 7 5800X3D",
    "AMD Ryzen 7 5700X",
    "AMD Ryzen 5 5600X",
    "AMD Ryzen 5 5600",
    "AMD Ryzen 5 5500",
    "AMD Ryzen 9 7950X3D",
    "AMD Ryzen 9 7950X",
    "AMD Ryzen 9 7900X3D",
    "AMD Ryzen 9 7900X",
    "AMD Ryzen 9 7900",
    "AMD Ryzen 7 7800X3D",
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

gpu_set = set(list_of_gpus_to_scrape)
cpu_set = set(list_of_cpus_to_scrape)

gpu_set_lower_case = {x.lower() for x in gpu_set}
cpu_set_lower_case = {x.lower() for x in cpu_set}

passmark_gpu_url = "https://www.videocardbenchmark.net/high_end_gpus.html"
passmark_cpu_normal_url = "https://www.cpubenchmark.net/high_end_cpus.html"
passmark_cpu_gaming_url = "https://www.cpubenchmark.net/top-gaming-cpus.html"


def scrape_passmark(benchmark_type, url, product_set, *, run_locally=False):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    chartlist = soup.find("ul", {"class": "chartlist"})

    for li in chartlist.find_all("li"):
        prdname = li.find("span", {"class": "prdname"}).text.strip()
        if prdname.lower() in product_set:
            count = li.find("span", {"class": "count"}).text.strip()
            count_num = int(count.replace(",", ""))
            if len(benchmarks_dict) == 0:
                max_value = count_num
            if prdname == "GeForce GTX 1660 SUPER":
                benchmarks_dict["GeForce GTX 1660 Super"] = count_num
            else:
                benchmarks_dict[prdname] = count_num

    percent_dict = convert_dict_numbers_to_percent(benchmarks_dict, max_value)

    save_to_json_with_timestamp(percent_dict, f"{benchmark_type}_PASSMARK", run_locally=run_locally)

    return percent_dict


def scrape_toms_hardware_gpus(*, run_locally=False):
    response = requests.get("https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html")
    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    tbody = soup.find("tbody", {"class": "table__body"})

    for tr in tbody.find_all("tr"):
        name = tr.find("a").text.strip()
        if name.lower() in gpu_set_lower_case or name == "Radeon RX 6700 10GB":
            value_1080p = tr.find_all("td")[1].text.strip().split("%")[0]
            value_1440p = tr.find_all("td")[3].text.strip().split("%")[0]
            if value_1440p != "":
                value = round(((float(value_1080p) + float(value_1440p)) / 2), 2)
            if name == "Radeon RX 6700 10GB":
                benchmarks_dict["Radeon RX 6700"] = value
            else:
                benchmarks_dict[name] = value

    save_to_json_with_timestamp(benchmarks_dict, f"GPU_TH", run_locally=run_locally)

    return benchmarks_dict


def scrape_toms_hardware_cpu_gaming(*, run_locally=False):
    response = requests.get("https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html")
    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    cpu_set_lower_case_th = {' '.join(full_cpu_name.split()[1:]).lower():full_cpu_name for full_cpu_name in cpu_set}

    table = soup.find("div", {"id": "slice-container-table-7"})

    for tr in table.find_all("tr"):
        name_column = tr.find("td")
        if name_column != None:
            name = name_column.text.strip().split(" - ")[1]
            columns = tr.find_all("td")
            if name.lower() in cpu_set_lower_case_th:
                value_1080p = columns[1].text.strip().split("%")[0]
                value_1440p = columns[2].text.strip().split("%")[0]
                value = round(((float(value_1080p) + float(value_1440p)) / 2), 2)
                benchmarks_dict[cpu_set_lower_case_th[name.lower()]] = value
            elif name == "Core i5-13400 / F":
                value_1080p = columns[1].text.strip().split("%")[0]
                value_1440p = columns[2].text.strip().split("%")[0]
                value = round(((float(value_1080p) + float(value_1440p)) / 2), 2)
                benchmarks_dict["Intel Core i5-13400"] = value 
                benchmarks_dict["Intel Core i5-13400F"] = value

    save_to_json_with_timestamp(benchmarks_dict, f"CPU-Gaming_TH", run_locally=run_locally)

    return benchmarks_dict


def scrape_toms_hardware_cpu_normal(*, run_locally=False):
    response = requests.get("https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html")
    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    cpu_set_lower_case_th = {' '.join(full_cpu_name.split()[1:]).lower():full_cpu_name for full_cpu_name in cpu_set}

    table = soup.find("div", {"id": "slice-container-table-17"})

    for tr in table.find_all("tr"):
        name_column = tr.find("td")
        if name_column != None:
            name = name_column.text.strip().split(" - ")[1]
            columns = tr.find_all("td")
            if name.lower() in cpu_set_lower_case_th:
                value = float(columns[1].text.strip().split("%")[0])
                benchmarks_dict[cpu_set_lower_case_th[name.lower()]] = value
            elif name == "Core i5-13400 / F":
                value = float(columns[1].text.strip().split("%")[0])
                benchmarks_dict["Intel Core i5-13400"] = value 
                benchmarks_dict["Intel Core i5-13400F"] = value

    save_to_json_with_timestamp(benchmarks_dict, f"CPU-Normal_TH", run_locally=run_locally)

    return benchmarks_dict


def scrape_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    save_local_html_page(soup)


def save_local_html_page(soup):
    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    directory = "benchmarks/completed-scrapes"
    filename = f"{directory}/output_{current_time}.html"

    if not os.path.exists(directory):
        os.makedirs(directory)

    with open(filename, "w", encoding="utf-8") as file:
        file.write(soup.prettify())


def save_to_json_with_timestamp(filtered_dict, dict_type, *, run_locally=False):
    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    if run_locally:
        directory = "app/backend/price_fetcher/benchmarks/completed-scrapes"
    else:
        directory = "benchmarks/completed-scrapes"
    
    filename = f"{directory}/{dict_type}_{current_time}.json"

    if not os.path.exists(directory):
        os.makedirs(directory)

    write_json_file(filtered_dict, filename)


def convert_dict_numbers_to_percent(benchmark_dict, max_value):
    percent_dict = {}

    for k, v in benchmark_dict.items():
        percent_value = round((v / max_value)*100, 2)
        percent_dict[k] = percent_value

    return percent_dict


def test_local_json_file(filepath):
    with open(filepath, "r") as file:
        json_data = json.load(file)

    max_value = json_data.keys()[0]

    print(max_value)
    for item in json_data.keys()[0]:
        # print(item)
        pass


def get_average_benchmarks(benchmark_list):
    benchmark_sums = {}

    for benchmark in benchmark_list:
        for key, value in benchmark.items():
            benchmark_sums[key] = benchmark_sums.get(key, ()) + (value,)

    average_benchmarks = {}

    for key, value_tuple in benchmark_sums.items():
        average_value = round((sum(value_tuple) / len(value_tuple)), 2)
        average_benchmarks[key] = average_value

    sorted_average_benchmarks = dict(sorted(average_benchmarks.items(), key=lambda x: x[1], reverse=True))

    return sorted_average_benchmarks
    

def fetch_gpu_benchmarks(*, run_locally=False):
    benchmark_list = []

    passmark_data = scrape_passmark("GPU", passmark_gpu_url, gpu_set_lower_case, run_locally=run_locally)
    benchmark_list.append(passmark_data)

    th_data = scrape_toms_hardware_gpus(run_locally=run_locally)
    benchmark_list.append(th_data)

    average_benchmark_data = get_average_benchmarks(benchmark_list)

    current_datetime = str(datetime.datetime.now())[:-7]

    average_benchmark_data["timestamp"] = current_datetime

    save_to_json_with_timestamp(average_benchmark_data, "GPU_AVERAGE", run_locally=run_locally)

    return average_benchmark_data


def fetch_cpu_gaming_benchmarks(*, run_locally=False):
    # benchmark_list = []

    # passmark_data = scrape_passmark("CPU-Gaming", passmark_cpu_gaming_url, cpu_set_lower_case, run_locally=run_locally)
    # benchmark_list.append(passmark_data)

    # th_data = scrape_toms_hardware_cpu_gaming(run_locally=run_locally)
    # benchmark_list.append(th_data)

    # average_benchmark_data = get_average_benchmarks(benchmark_list)

    # save_to_json(average_benchmark_data, "CPU-Gaming_AVERAGE", run_locally=run_locally)

    passmark_data = scrape_passmark("CPU-Gaming", passmark_cpu_gaming_url, cpu_set_lower_case, run_locally=run_locally)

    current_datetime = str(datetime.datetime.now())[:-7]

    passmark_data["timestamp"] = current_datetime

    save_to_json_with_timestamp(passmark_data, "CPU-Gaming_AVERAGE", run_locally=run_locally)

    return passmark_data


def fetch_cpu_normal_benchmarks(*, run_locally=False):
    # benchmark_list = []

    # passmark_data = scrape_passmark("CPU-Normal", passmark_cpu_normal_url, cpu_set_lower_case, run_locally=run_locally)
    # benchmark_list.append(passmark_data)

    # th_data = scrape_toms_hardware_cpu_normal(run_locally=run_locally)
    # benchmark_list.append(th_data)

    # average_benchmark_data = get_average_benchmarks(benchmark_list)

    # save_to_json(average_benchmark_data, "CPU-Normal_AVERAGE", run_locally=run_locally)

    passmark_data = scrape_passmark("CPU-Normal", passmark_cpu_normal_url, cpu_set_lower_case, run_locally=run_locally)

    current_datetime = str(datetime.datetime.now())[:-7]

    passmark_data["timestamp"] = current_datetime

    save_to_json_with_timestamp(passmark_data, "CPU-Normal_AVERAGE", run_locally=run_locally)

    return passmark_data
    

def test_offline_page(filepath):
    with open(filepath, "r", encoding='utf8') as file:
        soup = BeautifulSoup(file, "html.parser")


def replace_latest_benchmark(benchmark_type, new_benchmarks, *, run_locally=False):
    try:
        if run_locally:
            directory = "app/backend/price_fetcher/benchmarks/latest_benchmarks"
            directory_backup = f"{directory}/backup_benchmarks"
        else:
            directory = "benchmarks/latest_benchmarks"
            directory_backup = f"{directory}/backup_benchmarks"

        filename = f"{directory}/{benchmark_type}.json"
        filename_backup = f"{directory_backup}/{benchmark_type}.json"

        with open (filename, "r", encoding="utf-8") as file:
            old_benchmarks = json.load(file)

        if validate_new_benchmarks(old_benchmarks, new_benchmarks, run_locally=run_locally):
            if not os.path.exists(directory):
                os.makedirs(directory)
            if not os.path.exists(directory_backup):
                os.makedirs(directory_backup)
            
            write_json_file(new_benchmarks, filename)
            
            write_json_file(old_benchmarks, filename_backup)

            print(f"Successfully updated {benchmark_type} benchmarks")
            write_to_log(success=True, message=f"Successfully updated {benchmark_type} benchmarks", run_locally=run_locally)
        else:
            print(f"Failed to validate new {benchmark_type} benchmarks")
            write_to_log(success=False, message=f"Failed to validate new {benchmark_type} benchmarks", run_locally=run_locally)
    except Exception as e:
        print(f"Error Replacing {benchmark_type} Benchmark: {e}")
        write_to_log(success=False, message=f"Error Replacing {benchmark_type} Benchmark: {e}", run_locally=run_locally)  


def update_all_benchmarks(*, run_locally=False):
    print("Scraping GPU Benchmarks")
    try:
        gpu_benchmarks = fetch_gpu_benchmarks(run_locally=run_locally)
        print("Success")
    except Exception as e:
        print("Error Scraping GPU Benchmarks")
        write_to_log(success=False, message=f"Error Scraping GPU Benchmarks: {e}", run_locally=run_locally)
    else:
        replace_latest_benchmark("GPU", gpu_benchmarks, run_locally=run_locally)

    time.sleep(0.5)

    print("Scraping CPU-Gaming Benchmarks")
    try:
        cpu_gaming_benchmarks = fetch_cpu_gaming_benchmarks(run_locally=run_locally)
        print("Success")
    except Exception as e:
        print("Error Scraping CPU-Gaming Benchmarks")
        write_to_log(success=False, message=f"Error Scraping CPU-Gaming Benchmarks: {e}", run_locally=run_locally)
    else:
        replace_latest_benchmark("CPU-Gaming", cpu_gaming_benchmarks, run_locally=run_locally)

    time.sleep(0.5)

    print("Scraping CPU-Normal Benchmarks")
    try:
        cpu_normal_benchmarks = fetch_cpu_normal_benchmarks(run_locally=run_locally)
        print("Success")
    except Exception as e:
        print("Error Scraping CPU-Normal Benchmarks")
        write_to_log(success=False, message=f"Error Scraping CPU-Normal Benchmarks: {e}", run_locally=run_locally)
    else:
        replace_latest_benchmark("CPU-Normal", cpu_normal_benchmarks, run_locally=run_locally)


def validate_new_benchmarks(old_benchmark_json, new_benchmark_json, *, run_locally=False):
    if len(old_benchmark_json) != len(new_benchmark_json):
        print(f"Number of keys does not match. OLD: {len(old_benchmark_json)} NEW: {len(new_benchmark_json)}")
        write_to_log(success=False, message=f"Number of keys does not match. OLD: {len(old_benchmark_json)} NEW: {len(new_benchmark_json)}", run_locally=run_locally)
        return False
    
    if set(old_benchmark_json.keys()) != set(new_benchmark_json.keys()):
        print(f"All keys do not match. OLD: {old_benchmark_json.keys()} NEW: {new_benchmark_json.keys()}")
        write_to_log(success=False, message=f"All keys do not match. OLD: {old_benchmark_json.keys()} NEW: {new_benchmark_json.keys()}", run_locally=run_locally)
        return False
    
    if new_benchmark_json[next(iter(new_benchmark_json))] != 100:
        print(f"First Benchmark Value is not 100: {new_benchmark_json[next(iter(new_benchmark_json))]}")
        write_to_log(success=False, message=f"First Benchmark Value is not 100: {new_benchmark_json[next(iter(new_benchmark_json))]}", run_locally=run_locally)
        return False

    for key, value in new_benchmark_json.items():
        if not isinstance(key, str):
            print(f"Key is not String: {key}")
            write_to_log(success=False, message=f"Key is not String: {key}", run_locally=run_locally)
            return False
        if key != "timestamp":
            if not isinstance(value, float):
                print(f"Value is not Float: {key}: {value}")
                write_to_log(success=False, message=f"Value is not Float: {key}: {value}", run_locally=run_locally)
                return False
            if value > 100 or value < 0.01:
                print(f"Value is not within range: {key}: {value}")
                write_to_log(success=False, message=f"Value is not within range: {key}: {value}", run_locally=run_locally)
                return False

    return True


def write_json_file(json_data, filename):
    with open(filename, "w") as file:
        json.dump(json_data, file, indent=4)


def write_to_log(*, success, message, run_locally=False):
    if run_locally:
        directory = "app/backend/price_fetcher/benchmarks"
    else:
        directory = "benchmarks"
        
    filename = f"{directory}/update_log.log"

    if not os.path.exists(directory):
        os.makedirs(directory)

    logging.basicConfig(
    filename=filename,
    filemode="w",
    level=logging.INFO,
    format="%(asctime)s : %(levelname)s : %(message)s",
    datefmt="%Y-%m-%d %I:%M:%S",
    )
    
    if success:
        logging.info(message)
    else: 
        logging.error(message)

if __name__ == "__main__":
    # fetch_gpu_benchmarks(run_locally=True)
    # fetch_cpu_gaming_benchmarks(run_locally=True)
    # print(str(datetime.datetime.now())[:-7])
    # time.sleep(0.5)
    # fetch_cpu_normal_benchmarks(run_locally=True)
    # fetch_gpu_benchmarks(run_locally=True)
    # update_all_benchmarks(run_locally=True)
    # replace_latest_benchmark("test", {"asd":123}, run_locally=True)
    run_locally = True
    cpu_gaming_benchmarks = fetch_cpu_gaming_benchmarks(run_locally=run_locally)
    # replace_latest_benchmark("CPU-Gaming", cpu_gaming_benchmarks, run_locally=run_locally)
    # write_to_log(success=False, message="Test Message2232", run_locally=True)
    # write_to_log(success=True, message="Test Message25252", run_locally=True)
    pass
