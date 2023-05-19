import os
from apscheduler.schedulers.background import BackgroundScheduler
import price_fetcher.views as pf

def start():
    """
        Start a job that will attempt to update and replace existing benchmarks 
        every day at 22:00 Swedish time.
    """
    # Stop job from running twice in dev
    if os.environ.get('RUN_MAIN'):
        pass
    scheduler = BackgroundScheduler(timezone="Europe/Stockholm")
    scheduler.add_job(pf.update_benchmarks, 'cron', hour=22, minute=00)
    scheduler.start()