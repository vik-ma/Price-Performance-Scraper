from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import price_fetcher.views as pf

def start():
    scheduler = BackgroundScheduler(timezone="Europe/Stockholm")
    scheduler.add_job(pf.update_benchmarks, 'cron', hour=0, minute=15)
    scheduler.start()