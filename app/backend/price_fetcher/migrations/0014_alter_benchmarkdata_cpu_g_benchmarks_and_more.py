# Generated by Django 4.2 on 2023-05-09 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('price_fetcher', '0013_benchmarkdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='benchmarkdata',
            name='cpu_g_benchmarks',
            field=models.FileField(upload_to=''),
        ),
        migrations.AlterField(
            model_name='benchmarkdata',
            name='cpu_n_benchmarks',
            field=models.FileField(upload_to=''),
        ),
        migrations.AlterField(
            model_name='benchmarkdata',
            name='gpu_benchmarks',
            field=models.FileField(upload_to=''),
        ),
    ]
