from django.apps import AppConfig


class PriceFetcherConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'price_fetcher'

    def ready(self) -> None:
        from jobs import benchmark_updater
        benchmark_updater.start()