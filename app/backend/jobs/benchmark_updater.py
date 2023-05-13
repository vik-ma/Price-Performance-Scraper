import os
from apscheduler.schedulers.background import BackgroundScheduler
import price_fetcher.views as pf

def start():
    """
        Start a job that will attempt to update and replace existing benchmarks 
        every day at 07:00 Swedish time.
    """
    # Stop job from running twice
    # if os.environ.get('RUN_MAIN'):
    scheduler = BackgroundScheduler(timezone="Europe/Stockholm")
    scheduler.add_job(pf.update_benchmarks, 'cron', hour=21, minute=23)
    scheduler.start()