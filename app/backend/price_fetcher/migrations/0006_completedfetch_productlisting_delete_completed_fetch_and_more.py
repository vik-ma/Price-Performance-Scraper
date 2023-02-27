# Generated by Django 4.1.7 on 2023-02-27 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('price_fetcher', '0005_product_listing_timestamp_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompletedFetch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_list', models.TextField()),
                ('benchmark_type', models.CharField(max_length=10)),
                ('timestamp', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='ProductListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_category', models.CharField(max_length=50)),
                ('store_name', models.CharField(max_length=50)),
                ('price', models.IntegerField()),
                ('product_link', models.TextField()),
                ('product_name', models.TextField()),
                ('price_performance_ratio', models.DecimalField(decimal_places=2, max_digits=5)),
                ('benchmark_value', models.DecimalField(decimal_places=2, max_digits=5)),
                ('timestamp_id', models.DateTimeField()),
            ],
        ),
        migrations.DeleteModel(
            name='Completed_Fetch',
        ),
        migrations.DeleteModel(
            name='Product_Listing',
        ),
    ]
