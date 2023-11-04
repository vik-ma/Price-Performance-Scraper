# Price/Performance Scraper
Price/Performance Scraper is a full-stack web application that can scrape online price listings of GPU and CPU models in real-time, compare the prices to up-to-date performance benchmarks of said models, and then finally rank every listed product found by its **Price/Performance Score**. It is designed to make it really easy for a user to find out which product has the best value for money, and where to buy it.

![Price-Performance Scraper Preview GIF](pps-preview.gif)

***As of now, only online stores in Sweden are available for scraping.***

## Demo Deployment

**[The website can be visited here!](https://price-performance-scraper.vercel.app/)** However, since the project started, it has become impossible to perform price scraping if the back-end is hosted at a data center. Without either self-hosting the back-end from a residential IP-address, or using a residential proxy service, it is no longer possible to perform real-time price scrapes using the website.

**In the Demo Deployment, real-time Price Scraping is simulated.** When a Price Scrape is started, instead of performing a Price Scrape, the back-end will just wait for a few seconds, and then return a random completed Price Scrape of the same Benchmark Type from the database. Everything else on both the front-end and back-end still works.

The back-end still works like it should when you run it on localhost. If you want to set up the application on your localhost, follow the guide in the **[Set Up Application On Localhost](#set-up-application-on-localhost)** section.

## About The Application

The application consists of a back-end made in **Python** and **Django**, with a **PostgreSQL** database, and a front-end made with **TypeScript**, **React**, **Next.js 13** and **PicoCSS**. **Docker** is also being used to host the back-end in development.

The front-end is a website where the user can select which GPU or CPU models they want to compare. With just the click of a button, Python will start web-scraping on the back-end. Once the scrape is finished and the Price/Performance Scores calculated on the back-end, the user is presented with a table consisting of all product listings found, ranked by their Price/Performance Scores. The user is able to interact with the table, like filter out specific stores or products, or just sort the table by a different column.

All completed price scrapes are viewable from the website, and thanks to Next.js' **Static Site Generation**, each completed scrape page will load incredibly quickly.

### Things To Note
*A global **3 minute cooldown** is placed on price scraping. This means that only one person can start a price scrape every three minutes.*

*When scraping **GPU** models, only the 5 to 8 cheapest sub-models for every GPU model will get scraped.*

## Price/Performance Score
The Price/Performance Score given to every scraped product listing is calculated like this: <br>
**( Benchmark Value ÷ Price ) × 100**

**A higher Price/Performance Score indicates better value for money.** However, it does **not** indicate better performance, as flagship models usually has worse Price/Performance Score than their cheaper counterparts. It is up to the consumer to decide which they value more.

Also note that **GPU** models always come in various sub-models, made by third-party manufacturers. These sub-models often have differing performance benchmarks. This application does not have access to performance benchmark data of individual GPU sub-models, and can thus not differentiate between them.

The website does feature a **Manual Comparison Tool**, partly to deal with this problem. This tool allows the user to manually enter price and performance values for multiple products, in order to compare Price/Performance Scores.
## Benchmarks

There are three different types of benchmark values in this app; **GPU Performance**, **CPU (Gaming Performance)** and **CPU (Multi-threaded Performance)**. Benchmark values are automatically scraped and updated once every day. CPU benchmarks are sourced from PassMark and GPU benchmarks are an aggregate of data from PassMark and Tom's Hardware.

The current benchmark values in use are displayed on the website.

Benchmark Values range from **100.00** to **0.01**, where the highest performing model in the list will always have a Benchmark Value of 100.00. The values are linear, which means that a product with a Benchmark Value of 50.00 has half the performance of the best product in the same category.

Products are sorted into **Benchmark Tiers** based on having similar performance levels. This makes it easier to find products of comparable performance.

### Benchmark Disclaimers
Benchmark values are not always accurate and in no way definite.

CPU Gaming benchmark values are semi-theoretical and not based on performance benchmarks from actual games. Thus, they should be taken with a grain of salt.

No comparisons are made between individual third-party sub-models when it comes to GPU Benchmarks.
## Manual Comparison Tool
The Manual Comparison Tool on the website can be used to calculate Price/Performance Scores using custom prices and/or benchmark values instead of the prices and benchmark values scraped by the app. Keep in mind that these scores will not match the Price/Performance Scores generated by scrapes unless the benchmark values are constructed using the same formula shown in the 'Price/Performance Score' section.

## Included Models
This section lists which CPU and GPU models are available in this app. **Unavailable models are not available for price scraping, nor are their benchmark data collected.**

### Available GPU Models
*Many GPUs from the previous two generations are not included, mainly due to their retail prices often being higher than current generation GPUs, despite having worse benchmark scores. Since this will always result in a terrible Price/Performance Score, the models are simply not available.*

***Intel GPUs** also has terrible Price/Performance Scores no matter what, and are thus not included.*

The following models **are** included:

- GeForce RTX 4090
- GeForce RTX 4080
- Radeon RX 7900 XTX
- GeForce RTX 4070 Ti
- Radeon RX 7900 XT
- Radeon RX 6950 XT
- GeForce RTX 4070
- Radeon RX 7800 XT
- Radeon RX 7700 XT
- Radeon RX 6800 XT
- Radeon RX 6800
- GeForce RTX 4060 Ti
- GeForce RTX 3070 Ti
- GeForce RTX 3070
- Radeon RX 6750 XT
- Radeon RX 6700 XT
- GeForce RTX 3060 Ti
- GeForce RTX 4060
- Radeon RX 6700
- Radeon RX 7600
- Radeon RX 6650 XT
- Radeon RX 6600 XT
- GeForce RTX 3060
- Radeon RX 6600
- GeForce RTX 2060
- GeForce RTX 3050
- GeForce GTX 1660 Ti
- GeForce GTX 1660 Super
- GeForce GTX 1660
- Radeon RX 6500 XT
- Radeon RX 6400

#### Notable Unavailable GPU Models
- GeForce RTX 3090 Ti
- GeForce RTX 3090
- GeForce RTX 3080 Ti
- Radeon RX 6900 XT
- GeForce RTX 3080
- GeForce GTX 1650 SUPER
- GeForce GTX 1650
- GeForce GTX 1050 Ti
- Intel Arc A770
- Intel Arc A750

#### Additional Notes About GPU Models
- 4060 Ti 8GB and 16GB are not separated into different categories.

### Available CPU Models
*Only socket AM5, AM4 and LGA 1700 CPUs are available, which means no workstation CPUs are included.*

The following models **are** included:

- AMD Ryzen 9 7950X3D
- AMD Ryzen 9 7950X
- Intel Core i9-14900K
- Intel Core i9-14900KF
- Intel Core i9-13900KS
- Intel Core i9-13900K
- Intel Core i9-13900KF
- AMD Ryzen 9 7900X
- AMD Ryzen 9 7900X3D
- Intel Core i7-14700KF
- Intel Core i7-14700K
- Intel Core i9-13900F
- Intel Core i9-13900
- AMD Ryzen 9 7900
- Intel Core i7-13700K
- Intel Core i7-13700KF
- AMD Ryzen 9 5950X
- Intel Core i9-12900KS
- Intel Core i7-13700F
- Intel Core i9-12900K
- Intel Core i9-12900KF
- Intel Core i5-14600K
- Intel Core i5-14600KF
- AMD Ryzen 9 5900X
- Intel Core i7-13700
- Intel Core i5-13600K
- Intel Core i5-13600KF
- Intel Core i9-12900F
- AMD Ryzen 7 7700X
- AMD Ryzen 7 7700
- AMD Ryzen 7 7800X3D
- Intel Core i7-12700K
- Intel Core i9-12900
- Intel Core i7-12700KF
- Intel Core i5-13500
- Intel Core i7-12700F
- Intel Core i7-12700
- AMD Ryzen 5 7600X
- AMD Ryzen 7 5800X3D
- AMD Ryzen 7 5800X
- AMD Ryzen 5 7600
- Intel Core i5-12600K
- Intel Core i5-12600KF
- AMD Ryzen 7 5700X
- Intel Core i5-13400
- Intel Core i5-13400F
- AMD Ryzen 5 5600X
- AMD Ryzen 5 5600
- Intel Core i5-12600
- Intel Core i5-12500
- Intel Core i5-12400F
- AMD Ryzen 5 5500
- Intel Core i5-12400

## Set Up Application On Localhost
Make sure you have **Docker Engine/Docker Desktop**, **Pipenv** and a JS package manager **(npm/yarn/pnpm)** installed first.

### 1. Clone the localhost branch
Clone the project:

```git clone https://github.com/vik-ma/Price-Performance-Scraper.git```

### 2. Set up the backend
In the root of the project, install dependencies from Pipfile using Pipenv:

```pipenv install```

After installation is complete, go into the **app/backend** directory:

```cd app/backend```

Create a file called **.env** in the **app/backend** directory, paste this code into it and save:

```
DEBUG = True
SECRET_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
ALLOWED_HOSTS = '*'
CORS_ALLOWED_ORIGINS = 'http://localhost:3000'

DB_NAME = 'pps_db'
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_HOST = 'host.docker.internal'
DB_PORT = '5432'
```

*Change the Secret Key if you ever deploy the backend.*

Go up one step to the **app** directory:

```cd ..```

Create a file called **docker-compose.yaml** in the **app** directory, paste this code into it and save:

```
version: '3.9'


services:
  db:
    container_name: db_container
    image: postgres
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      PGDATA: /data/postgres
    volumes:
       - postgres:/data/postgres
    ports:
      - "5432:5432"
    networks:
      app_net:
        ipv4_address: 192.168.0.2

  backend: 
    build: 
      context: ./backend
      dockerfile: Dockerfile
    command: >
      sh -c "python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    ports:
      - '8000:8000'
    volumes:
      - ./backend:/app/backend
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      PGDATA: /data/postgres
    depends_on:
      - db

volumes:
    postgres:

networks:
  app_net:
    ipam:
      driver: default
      config:
        - subnet: "192.168.0.0/24"
          gateway: 192.168.0.1
```

Build the Docker containers:

```docker-compose build```

Once the Docker containers are built, start the backend:

```docker-compose up```
### 3. Access the backend dashboard

The backend dashboard can now be accessed on **http://localhost:8000/**.

**Before you can do a Price Scrape, you need to scrape benchmark data at least once.**

Click the **Scrape Benchmarks** button on the dashboard.

Once you have added benchmark data to the database, you can perform a test Price Scrape by clicking on any of the buttons under the **Price Scrapes** section.

### 4. Set up the frontend

Navigate to the **app/frontend** directory.

Install dependencies using your JavaScript package manager:

*Examples using npm*

```
npm install
```

Create a file called **.env.local** inside the *app/frontend* directory, paste these lines into it and save:

```
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/api
NEXT_PUBLIC_NEXT_API_URL=http://localhost:3000/api
```

Now, build the Next.js app *(Backend must be running during this)*:

```npm run build```

When building is complete, start the frontend:

```npm run start```

**Setup is now complete** and you can access the frontend on **http://localhost:3000/**!
