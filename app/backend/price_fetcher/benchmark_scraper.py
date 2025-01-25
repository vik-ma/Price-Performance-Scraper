import re
import cloudscraper
from bs4 import BeautifulSoup
import json
import datetime
import time
import logging
import os

"""
TODOLIST FOR ADDING A NEW MODEL:
    - UPDATE BENCHMARK SCRAPER LIST (list_of_gpus_to_scrape or list_of_cpus_to_scrape)
    - UPDATE PJ URL SET (gpu_pj_url_dict or cpu_pj_url_dict)
    - UPDATE API VIEWS.PY ALLOWED LIST (valid_gpu_set or valid_cpu_normal_list)
    - UPDATE PRODUCTLIST.TSX (FRONT END)
    - UPDATE/VALIDATE TIERS FOR ALL ENTRIES IN PRODUCTLIST.TSX (FRONT END)
    - UPDATE INCLUDED_MODELS.MD (ROOT)
    - UPDATE README.MD (ROOT)
"""

list_of_gpus_to_scrape = [
    "GeForce RTX 4090",
    "GeForce RTX 4080",
    "GeForce RTX 4080 Super",
    "GeForce RTX 4070 Ti Super",
    "GeForce RTX 4070 Super",
    "Radeon RX 7900 XTX",
    "GeForce RTX 4070 Ti",
    "Radeon RX 6950 XT",
    "Radeon RX 7900 XT",
    "Radeon RX 7900 GRE",
    "GeForce RTX 4070",
    "Radeon RX 7800 XT",
    "Radeon RX 7700 XT",
    "Radeon RX 6800 XT",
    "GeForce RTX 4060 Ti",
    "Radeon RX 6750 XT",
    "GeForce RTX 3060 Ti",
    "Radeon RX 6700 XT",
    "GeForce RTX 4060",
    "Radeon RX 7600",
    "Radeon RX 6650 XT",
    "GeForce RTX 3060",
    "Radeon RX 6600 XT",
    "Radeon RX 6600",
    "GeForce GTX 1660 Super",
    "GeForce RTX 3050",
    "Intel Arc B580",
]

list_of_cpus_to_scrape = [
    "AMD Ryzen 7 9800X3D",
    "AMD Ryzen 9 9950X",
    "AMD Ryzen 9 9900X",
    "AMD Ryzen 7 9700X",
    "AMD Ryzen 5 9600X",
    "AMD Ryzen 9 5950X",
    "AMD Ryzen 9 5900X",
    "AMD Ryzen 7 5800X",
    "AMD Ryzen 7 5700X",
    "AMD Ryzen 7 5700X3D",
    "AMD Ryzen 7 5700",
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
    "Intel Core Ultra 9 285K",
    "Intel Core Ultra 7 265K",
    "Intel Core Ultra 7 265KF",
    "Intel Core Ultra 5 245K",
    "Intel Core Ultra 5 245KF",
    "Intel Core i9-14900KS",
    "Intel Core i9-14900K",
    "Intel Core i9-14900KF",
    "Intel Core i9-14900F",
    "Intel Core i9-14900",
    "Intel Core i7-14700K",
    "Intel Core i7-14700KF",
    "Intel Core i7-14700F",
    "Intel Core i7-14700",
    "Intel Core i5-14600K",
    "Intel Core i5-14600KF",
    "Intel Core i5-14600",
    "Intel Core i5-14500",
    "Intel Core i5-14400F",
    "Intel Core i5-14400",
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


def scrape_passmark(benchmark_type, url, product_set, *, run_locally=False) -> dict:
    """
    Scrape Benchmarks from Passmark sites and return data.

        Parameters:
            benchmark_type (str): Type of benchmark to scrape 
                                  (Must be either "GPU", "CPU-Gaming" or "CPU-Normal")

            url (str): Link to the website to be scraped

            product_set (set): Set of products to collect Benchmark data from
                               (Use either gpu_set_lower_case or cpu_set_lower_case variables)

            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            percent_dict (dict): Dictionary where every product from product_set is paired
                                 with their benchmark value in percentage form
    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)

    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    chartlist = soup.find("ul", {"class": "chartlist"})

    for li in chartlist.find_all("li"):
        prdname = li.find("span", {"class": "prdname"}).text.strip()
        if prdname.lower() in product_set:
            count = li.find("span", {"class": "count"}).text.strip()
            count_num = int(count.replace(",", ""))
            if len(benchmarks_dict) == 0:
                # Adds the product in product_set which appears at the top of
                # the site list's benchmark value as max_value
                max_value = count_num
            if prdname == "GeForce GTX 1660 SUPER":
                benchmarks_dict["GeForce GTX 1660 Super"] = count_num
            elif prdname == "GeForce RTX 4080 SUPER":
                benchmarks_dict["GeForce RTX 4080 Super"] = count_num
            elif prdname == "GeForce RTX 4070 Ti SUPER":
                benchmarks_dict["GeForce RTX 4070 Ti Super"] = count_num
            elif prdname == "GeForce RTX 4070 SUPER":
                benchmarks_dict["GeForce RTX 4070 Super"] = count_num
            else:
                benchmarks_dict[prdname] = count_num

    # Get the benchmark values for every product in percentage form,
    # where the best product in product_set gets the value 100
    percent_dict = convert_dict_numbers_to_percent(benchmarks_dict, max_value)

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            percent_dict, f"{benchmark_type}_PASSMARK", run_locally=run_locally)

    return percent_dict


def scrape_toms_hardware_gpus(*, run_locally=False) -> dict:
    """
    Scrape Benchmarks from Tom's Hardware's GPU Hierarchy and return data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            benchmarks_dict (dict): Dictionary where every product from gpu_set_lower_case 
                                    is paired with their benchmark value
    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(
        "https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html")

    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    float_pattern = r'^[1-9]\d*(\.\d+)?$'

    tbody = soup.find("tbody", {"class": "table__body"})

    for tr in tbody.find_all("tr"):
        name = tr.find("a").text.strip()
        if name.lower() in gpu_set_lower_case:
            value_1080p = tr.find_all("td")[2].text.strip().split("%")[0]
            value_1440p = tr.find_all("td")[4].text.strip().split("%")[0]
            # Check if 1440p is a valid float number
            if re.match(float_pattern, value_1440p):
                # Get the average value of 1080p and 1440p benchmark scores
                value = round(
                    ((float(value_1080p) + float(value_1440p)) / 2), 2)
                benchmarks_dict[name] = value

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            benchmarks_dict, f"GPU_TH", run_locally=run_locally)

    return benchmarks_dict


def scrape_toms_hardware_cpu_gaming(*, run_locally=False) -> dict:
    """
    Scrape Benchmarks from Tom's Hardware's CPU Hierarchy (Gaming Scores) and return data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            benchmarks_dict (dict): Dictionary where every product from cpu_set_lower_case 
                                    is paired with their benchmark value
    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(
        "https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html")

    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    # Remove first word from each entry in cpu_set_lower_case
    cpu_set_lower_case_th = {' '.join(full_cpu_name.split()[1:]).lower(
    ): full_cpu_name for full_cpu_name in cpu_set}

    table = soup.find("div", {"id": "slice-container-table-7"})

    for tr in table.find_all("tr"):
        name_column = tr.find("td")
        if name_column != None:
            name = name_column.text.strip().split(" - ")[1]
            columns = tr.find_all("td")
            if name.lower() in cpu_set_lower_case_th:
                value_1080p = columns[1].text.strip().split("%")[0]
                value_1440p = columns[2].text.strip().split("%")[0]
                # Get the average value of 1080p and 1440p benchmark scores
                value = round(
                    ((float(value_1080p) + float(value_1440p)) / 2), 2)
                benchmarks_dict[cpu_set_lower_case_th[name.lower()]] = value
            elif name == "Core i5-13400 / F":
                value_1080p = columns[1].text.strip().split("%")[0]
                value_1440p = columns[2].text.strip().split("%")[0]
                # Get the average value of 1080p and 1440p benchmark scores
                value = round(
                    ((float(value_1080p) + float(value_1440p)) / 2), 2)
                benchmarks_dict["Intel Core i5-13400"] = value
                benchmarks_dict["Intel Core i5-13400F"] = value

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            benchmarks_dict, f"CPU-Gaming_TH", run_locally=run_locally)

    return benchmarks_dict


def scrape_toms_hardware_cpu_normal(*, run_locally=False) -> dict:
    """
    Scrape Benchmarks from Tom's Hardware's CPU Hierarchy (Multithreading Scores) and return data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            benchmarks_dict (dict): Dictionary where every product from cpu_set_lower_case 
                                    is paired with their benchmark value
    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(
        "https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html")

    soup = BeautifulSoup(response.text, "html.parser")

    benchmarks_dict = {}

    # Remove first word from each entry in cpu_set_lower_case
    cpu_set_lower_case_th = {' '.join(full_cpu_name.split()[1:]).lower(
    ): full_cpu_name for full_cpu_name in cpu_set}

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

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            benchmarks_dict, f"CPU-Normal_TH", run_locally=run_locally)

    return benchmarks_dict


def scrape_page(url):
    """
    Scrapes the page of provided url and locally saves the page as a .html file.

        Parameters:
            url (str): Link to the website to be scraped
    """
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    save_local_html_page(soup)


def save_local_html_page(soup):
    """
    Saves the provided BeautifulSoup object as a .html file.

        Parameters:
            soup (BeautifulSoup object): Website content scraped with BeautifulSoup 
    """
    # Get the current date and timestamp
    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    # Folder to save scraped websites to
    directory = "benchmarks/completed-scrapes"
    # Name the local file to be saved with current date and timestamp
    filename = f"{directory}/output_{current_time}.html"

    # Create directory if it does not exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Save the file
    with open(filename, "w", encoding="utf-8") as file:
        file.write(soup.prettify())


def save_to_json_with_timestamp(benchmarks_dict, dict_type, *, run_locally=False):
    """
    Saves the provided dictionary as a .json file with the current datetime as its filename.

        Parameters:
            benchmarks_dict (dict): Dictionary where every key is a product and
                                    their value is their benchmark score
    """
    # Get the current date and timestamp
    current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    # Set folder to save JSON file to
    if run_locally:
        # If module is run on its own
        directory = "app/backend/price_fetcher/benchmarks/completed-scrapes"
    else:
        # If function is run from Django
        directory = "price_fetcher/benchmarks/completed-scrapes"

    filename = f"{directory}/{dict_type}_{current_time}.json"

    # Create directory if it does not exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Save the file
    write_json_file(benchmarks_dict, filename)


def convert_dict_numbers_to_percent(benchmark_dict, max_value) -> dict:
    """
    Convert a dictionary where every key has a number as its value to a new value,
    which is the number's ratio to the maximum value in the dictionary, in percentage form.

        Parameters:
            benchmarks_dict (dict): Dictionary where every key is a product and
                                    their value is their benchmark score

            max_value (int): The maximum value of any key in the benchmarks_dict

        Returns:
            percent_dict (dict): Dictionary where every key is a product and their value
                                 is the equivalent percentage value compared to the maximum
                                 value of any key in the dictionary
    """
    percent_dict = {}

    for k, v in benchmark_dict.items():
        percent_value = round((v / max_value)*100, 2)
        percent_dict[k] = percent_value

    return percent_dict


def test_local_json_file(filepath):
    """
    Read the JSON data of a local .json file.
    (For debugging purposes)

        Parameters:
            filepath (str): Full filepath to the .json file
    """
    with open(filepath, "r") as file:
        json_data = json.load(file)


def get_average_benchmarks(benchmark_list) -> dict:
    """
    Get the average scores of a list of Benchmark dictionaries.

        Parameters:
            benchmark_list (list): List of Benchmark dictionaries which contains
                                   the same keys but have different number values

        Returns:
            sorted_average_benchmarks (dict): Dictionary where every value has been
                                              replaced by the average value of all
                                              dictionaries in the input list
    """
    benchmark_sums = {}

    # Get the sum of all Benchmark values for every key
    for benchmark in benchmark_list:
        for key, value in benchmark.items():
            benchmark_sums[key] = benchmark_sums.get(key, ()) + (value,)

    average_benchmarks = {}

    # Calculate the average Benchmark value for every key
    for key, value_tuple in benchmark_sums.items():
        average_value = round((sum(value_tuple) / len(value_tuple)), 2)
        average_benchmarks[key] = average_value

    # Sort Benchmark keys from highest value to lowest
    sorted_average_benchmarks = dict(
        sorted(average_benchmarks.items(), key=lambda x: x[1], reverse=True))

    return sorted_average_benchmarks


def fetch_gpu_benchmarks(*, run_locally=False) -> dict:
    """    
    Scrape GPU benchmark scores from multiple websites and return the average data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            average_benchmark_data (dict): Dictionary where every key is a product
                                           and their value is the average scraped
                                           benchmark score for the product
    """
    benchmark_list = []

    # Benchmark Data from Passmark
    passmark_data = scrape_passmark(
        "GPU", passmark_gpu_url, gpu_set_lower_case, run_locally=run_locally)
    benchmark_list.append(passmark_data)

    # Benchmark Data from Tom's Hardware
    th_data = scrape_toms_hardware_gpus(run_locally=run_locally)
    benchmark_list.append(th_data)

    # Average Benchmark Data from all sites
    average_benchmark_data = get_average_benchmarks(benchmark_list)

    # Get time of scrape in readable format
    current_datetime = str(datetime.datetime.now())[:-7]

    # Add time of scrape to JSON
    average_benchmark_data["timestamp"] = current_datetime

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            average_benchmark_data, "GPU_AVERAGE", run_locally=run_locally)

    return average_benchmark_data


def fetch_cpu_gaming_benchmarks(*, run_locally=False) -> dict:
    """    
    Scrape CPU Gaming benchmark scores from multiple websites and return the average data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            average_benchmark_data (dict): Dictionary where every key is a product
                                           and their value is the average scraped
                                           benchmark score for the product
    """
    # Average of multiple sites (Currently not in use)
    # benchmark_list = []

    # passmark_data = scrape_passmark("CPU-Gaming", passmark_cpu_gaming_url, cpu_set_lower_case, run_locally=run_locally)
    # benchmark_list.append(passmark_data)

    # th_data = scrape_toms_hardware_cpu_gaming(run_locally=run_locally)
    # benchmark_list.append(th_data)

    # average_benchmark_data = get_average_benchmarks(benchmark_list)

    # save_to_json(average_benchmark_data, "CPU-Gaming_AVERAGE", run_locally=run_locally)

    # Currently only scraping Passmark data
    passmark_data = scrape_passmark(
        "CPU-Gaming", passmark_cpu_gaming_url, cpu_set_lower_case, run_locally=run_locally)

    # Get time of scrape in readable format
    current_datetime = str(datetime.datetime.now())[:-7]

    # Add time of scrape to JSON
    passmark_data["timestamp"] = current_datetime

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            passmark_data, "CPU-Gaming_AVERAGE", run_locally=run_locally)

    return passmark_data


def fetch_cpu_normal_benchmarks(*, run_locally=False) -> dict:
    """    
    Scrape CPU Multithreading benchmark scores from multiple websites and return the average data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            average_benchmark_data (dict): Dictionary where every key is a product
                                           and their value is the average scraped
                                           benchmark score for the product
    """
    # Average of multiple sites (Currently not in use)
    # benchmark_list = []

    # passmark_data = scrape_passmark("CPU-Normal", passmark_cpu_normal_url, cpu_set_lower_case, run_locally=run_locally)
    # benchmark_list.append(passmark_data)

    # th_data = scrape_toms_hardware_cpu_normal(run_locally=run_locally)
    # benchmark_list.append(th_data)

    # average_benchmark_data = get_average_benchmarks(benchmark_list)

    # save_to_json(average_benchmark_data, "CPU-Normal_AVERAGE", run_locally=run_locally)

    # Currently only scraping Passmark data
    passmark_data = scrape_passmark(
        "CPU-Normal", passmark_cpu_normal_url, cpu_set_lower_case, run_locally=run_locally)

    # Get time of scrape in readable format
    current_datetime = str(datetime.datetime.now())[:-7]

    # Add time of scrape to JSON
    passmark_data["timestamp"] = current_datetime

    # Save the data to a .json file
    if run_locally:
        save_to_json_with_timestamp(
            passmark_data, "CPU-Normal_AVERAGE", run_locally=run_locally)

    return passmark_data


def test_offline_page(filepath):
    """
    Parse a local .html file with BeautifulSoup.
    (For debugging purposes)

        Parameters:
            filepath (str): Full filepath to the .html file
    """
    with open(filepath, "r", encoding='utf8') as file:
        soup = BeautifulSoup(file, "html.parser")


def replace_latest_benchmark(benchmark_type, new_benchmarks, *, run_locally=False):
    """
    Replace existing Benchmark .json files with new data, after backing up existing ones.

        Parameters:
            benchmark_type (str): Type of benchmark data to replace 
                                  (Must be either "GPU", "CPU-Gaming" or "CPU-Normal")

            new_benchmarks (dict): Dictionary of new benchmark data to replace existing one

            run_locally (bool): Must be True if module is ran outside of Django
    """
    try:
        # Set folders where current benchmarks and backup benchmarks resides
        if run_locally:
            directory = "app/backend/price_fetcher/benchmarks/latest_benchmarks"
            directory_backup = f"app/backend/price_fetcher/benchmarks/backup_benchmarks"
        else:
            directory = "price_fetcher/benchmarks/latest_benchmarks"
            directory_backup = f"price_fetcher/benchmarks/backup_benchmarks"

        filename = f"{directory}/{benchmark_type}.json"
        filename_backup = f"{directory_backup}/{benchmark_type}.json"

        # Create folders if they don't exist
        if not os.path.exists(directory):
            os.makedirs(directory)
        if not os.path.exists(directory_backup):
            os.makedirs(directory_backup)

        if not os.path.exists(filename_backup):
            # If no backup benchmarks exist, write new benchmarks to both
            write_json_file(new_benchmarks, filename)
            write_json_file(new_benchmarks, filename_backup)

            print(f"Successfully updated {benchmark_type} benchmarks")
            write_to_log(
                success=True, message=f"Successfully updated {benchmark_type} benchmarks", run_locally=run_locally)

            # Exit rest of function
            return

        # Load old benchmarks
        with open(filename, "r", encoding="utf-8") as file:
            old_benchmarks = json.load(file)

        # Compare new benchmark data to old one to see if it's valid
        if validate_new_benchmarks(old_benchmarks, new_benchmarks, run_locally=run_locally):
            # Write new benchmarks to latest_benchmarks folder
            write_json_file(new_benchmarks, filename)
            # Write old benchmarks to backup_benchmarks folder
            write_json_file(old_benchmarks, filename_backup)

            print(f"Successfully updated {benchmark_type} benchmarks")
            write_to_log(
                success=True, message=f"Successfully updated {benchmark_type} benchmarks", run_locally=run_locally)
        else:
            print(f"Failed to validate new {benchmark_type} benchmarks")
            write_to_log(
                success=False, message=f"Failed to validate new {benchmark_type} benchmarks", run_locally=run_locally)
    except Exception as e:
        # Log error if one occurs
        print(f"Error Replacing {benchmark_type} Benchmark: {e}")
        write_to_log(
            success=False, message=f"Error Replacing {benchmark_type} Benchmark: {e}", run_locally=run_locally)


def update_all_benchmarks(*, run_locally=False) -> dict:
    """
    Scrape benchmark data for all benchmark types and return dictionary of Benchmark Data.

        Parameters:
            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            If benchmark scraping was successful:
                new_benchmarks_dict (dict): Contains dictionary with keys "GPU", "CPU-Gaming"
                                            and "CPU-Normal" which all contains their own 
                                            dictionary of Benchmark Values for all products.
            If benchmark scraping failed:
                Exception class containing error message. 
    """

    print("Scraping GPU Benchmarks")
    try:
        # Attempt to scrape new GPU benchmark data
        gpu_benchmarks = fetch_gpu_benchmarks(run_locally=run_locally)
        print("Success")
    except Exception as e:
        error_msg = f"Error scraping GPU Benchmarks: {e}"
        print(error_msg)
        return Exception(error_msg)
    else:
        # Replace json old benchmark data with new benchmark data
        # if scrape was successful and benchmark scrape was ran locally
        if run_locally:
            replace_latest_benchmark(
                "GPU", gpu_benchmarks, run_locally=run_locally)

    # Wait half a second before scraping next benchmark type
    time.sleep(0.5)

    print("Scraping CPU-Gaming Benchmarks")
    try:
        # Attempt to scrape new CPU-Gaming benchmark data
        cpu_gaming_benchmarks = fetch_cpu_gaming_benchmarks(
            run_locally=run_locally)
        print("Success")
    except Exception as e:
        error_msg = f"Error scraping GPU Benchmarks: {e}"
        print(error_msg)
        return Exception(error_msg)
    else:
        # Replace json old benchmark data with new benchmark data
        # if scrape was successful and benchmark scrape was ran locally
        if run_locally:
            replace_latest_benchmark(
                "CPU-Gaming", cpu_gaming_benchmarks, run_locally=run_locally)

    # Wait half a second before scraping next benchmark type
    time.sleep(0.5)

    print("Scraping CPU-Normal Benchmarks")
    try:
        # Attempt to scrape new CPU-Normal (Multithreading) benchmark data
        cpu_normal_benchmarks = fetch_cpu_normal_benchmarks(
            run_locally=run_locally)
        print("Success")
    except Exception as e:
        error_msg = f"Error scraping GPU Benchmarks: {e}"
        print(error_msg)
        return Exception(error_msg)
    else:
        # Replace json old benchmark data with new benchmark data
        # if scrape was successful and benchmark scrape was ran locally
        if run_locally:
            replace_latest_benchmark(
                "CPU-Normal", cpu_normal_benchmarks, run_locally=run_locally)

    new_benchmarks_dict = {"GPU": gpu_benchmarks,
                           "CPU-Gaming": cpu_gaming_benchmarks,
                           "CPU-Normal": cpu_normal_benchmarks}

    return new_benchmarks_dict


def validate_new_benchmarks(old_benchmark_json, new_benchmark_json, *, run_locally=False) -> bool:
    """
    Compare new benchmark data with existing benchmark data to see if the data is correctly structured.

        Parameters:
            old_benchmark_json (dict): Dictionary of benchmark data currently in use

            new_benchmark_json (dict): Dictionary of newly scraped benchmark data

            run_locally (bool): Must be True if module is ran outside of Django

        Returns:
            True if validation passed, False otherwise

    """
    # Check if the number of products are the same
    if len(old_benchmark_json) != len(new_benchmark_json):
        print(
            f"Number of keys does not match. OLD: {len(old_benchmark_json)} NEW: {len(new_benchmark_json)}")
        write_to_log(
            success=False, message=f"Number of keys does not match. OLD: {len(old_benchmark_json)} NEW: {len(new_benchmark_json)}", run_locally=run_locally)
        return False

    # Check if every single product is the same
    if set(old_benchmark_json.keys()) != set(new_benchmark_json.keys()):
        print(
            f"All keys do not match. OLD: {old_benchmark_json.keys()} NEW: {new_benchmark_json.keys()}")
        write_to_log(
            success=False, message=f"All keys do not match. OLD: {old_benchmark_json.keys()} NEW: {new_benchmark_json.keys()}", run_locally=run_locally)
        return False

    # Check if the first key of the benchmark data has a value of 100
    if new_benchmark_json[next(iter(new_benchmark_json))] != 100:
        print(
            f"First Benchmark Value is not 100: {new_benchmark_json[next(iter(new_benchmark_json))]}")
        write_to_log(
            success=False, message=f"First Benchmark Value is not 100: {new_benchmark_json[next(iter(new_benchmark_json))]}", run_locally=run_locally)
        return False

    for key, value in new_benchmark_json.items():
        # Check if every key is of type str
        if not isinstance(key, str):
            print(f"Key is not String: {key}")
            write_to_log(
                success=False, message=f"Key is not String: {key}", run_locally=run_locally)
            return False

        if key != "timestamp":
            # Check if every key except for "timestamp" has a value of type float
            if not isinstance(value, float):
                print(f"Value is not Float: {key}: {value}")
                write_to_log(
                    success=False, message=f"Value is not Float: {key}: {value}", run_locally=run_locally)
                return False
            # Check if every key except for "timestamp" has a value between 100 and 0.01
            if value > 100 or value < 0.01:
                print(f"Value is not within range: {key}: {value}")
                write_to_log(
                    success=False, message=f"Value is not within range: {key}: {value}", run_locally=run_locally)
                return False

    # If no issues found, return True
    return True


def write_json_file(json_data, filename):
    """
    Save provided dictionary as .json file with provided filename.

        Parameters:
            json_data (dict): Dictionary to be written as .json file

            filename (dict): Full path of filename of .json file to be saved
    """
    with open(filename, "w") as file:
        json.dump(json_data, file, indent=4)


def write_to_log(*, success, message, run_locally=False):
    """
    Write a message to update_log.log file.

        Parameters:
            success (bool): Result of whatever operation was attempted

            message (str): Message to be printed in log

            run_locally (bool): Must be True if module is ran outside of Django
    """
    # Set the folder of the log file
    if run_locally:
        directory = "app/backend/price_fetcher/benchmarks"
    else:
        directory = "price_fetcher/benchmarks"

    # Name of log file
    filename = f"{directory}/update_log.log"

    # Create folder if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    logging.basicConfig(
        filename=filename,
        filemode="w",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    if success:
        # Log message at INFO level if attempted operation was successful
        logging.info(message)
    else:
        # Log message at ERROR level if attempted operation was unsuccessful
        logging.error(message)


if __name__ == "__main__":
    pass
