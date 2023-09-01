from django.apps import AppConfig
import os

class PriceFetcherConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'price_fetcher'

    def ready(self) -> None:
        """
        Replace default ready function with function that includes 
        a job that updates benchmarks once per day.
        """
        from jobs import benchmark_updater
        # Stop benchmark_updater job from running twice in dev
        if os.environ.get('RUN_MAIN'):
            benchmark_updater.start()
        