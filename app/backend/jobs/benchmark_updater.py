from apscheduler.schedulers.background import BackgroundScheduler
import price_fetcher.views as pf

class BenchmarkScrapeSessionLimiter():
    def __init__(self):
        self.is_scrape_running = False

scrape_limiter = BenchmarkScrapeSessionLimiter()

def start():
    """
        Start a job that will attempt to update and replace existing benchmarks 
        every day at 22:00 Swedish time.
    """
    scheduler = BackgroundScheduler(timezone="Europe/Stockholm")
    scheduler.add_job(update_benchmarks, 'cron', hour=22, minute=00, misfire_grace_time=None)
    scheduler.start()


def update_benchmarks():
    if not scrape_limiter.is_scrape_running:
        scrape_limiter.is_scrape_running = True
        pf.update_benchmarks()
        scrape_limiter.is_scrape_running = False