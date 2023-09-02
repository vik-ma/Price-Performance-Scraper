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
        # This will run twice in dev mode
        benchmark_updater.start()
        