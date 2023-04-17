import os
from apscheduler.schedulers.background import BackgroundScheduler
import price_fetcher.views as pf

def start():
    if os.environ.get('RUN_MAIN'):
        scheduler = BackgroundScheduler(timezone="Europe/Stockholm")
        scheduler.add_job(pf.update_benchmarks, 'cron', hour=7, minute=00)
        scheduler.start()